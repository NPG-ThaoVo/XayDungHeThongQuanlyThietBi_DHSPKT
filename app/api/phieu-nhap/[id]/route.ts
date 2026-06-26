import { NextRequest } from "next/server";

import { recordAuditLog } from "@/lib/audit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePhieuNhapSchema } from "@/lib/validations/phieu-nhap";

const allowedRoles = ["ADMIN", "THU_KHO", "TRUONG_KHOA"] as const;

type Params = { params: Promise<{ id: string }> };

async function completeReceipt(id: string, userId: string, danhMucId: string) {
  const phieu = await prisma.phieuNhap.findUnique({
    where: { id },
    include: {
      chiTiet: true,
      nguoiTao: { select: { khoaId: true } },
    },
  });

  if (!phieu) {
    throw new Error("Không tìm thấy phiếu nhập");
  }

  if (phieu.trangThai === "HOAN_TAT") {
    return phieu;
  }

  const existingDeviceCount = await prisma.thietBi.count();
  let runningIndex = existingDeviceCount + 1;

  await prisma.$transaction(async (tx) => {
    for (const item of phieu.chiTiet) {
      if (item.thietBiId) continue;

      const createdDeviceIds: string[] = [];
      for (let i = 0; i < item.soLuong; i += 1) {
        const maThietBi = `TB-NK-${String(runningIndex).padStart(5, "0")}`;
        const serialNumber = `PN-${phieu.maPhieu}-${runningIndex}`;
        runningIndex += 1;

        const device = await tx.thietBi.create({
          data: {
            maThietBi,
            tenThietBi: item.tenThietBi,
            serialNumber,
            namNhap: new Date(phieu.ngayNhap).getFullYear(),
            giaTriBanDau: item.donGia,
            trangThai: "CHO_DUYET",
            moTa: item.ghiChu ?? undefined,
            thongSoKyThuat: `Nguồn gốc phiếu nhập ${phieu.maPhieu}`,
            hinhAnh: [],
            danhMucId,
            nhaCungCapId: phieu.nhaCungCapId,
            khoaId: phieu.nguoiTao.khoaId ?? undefined,
          },
        });

        createdDeviceIds.push(device.id);

        await recordAuditLog(tx, {
          userId,
          action: "CREATE_FROM_RECEIPT",
          entity: "ThietBi",
          entityId: device.id,
          detail: `Tạo từ phiếu nhập ${phieu.maPhieu} - ${item.tenThietBi}`,
        });
      }

      if (createdDeviceIds.length > 0) {
        await tx.phieuNhapChiTiet.update({
          where: { id: item.id },
          data: { thietBiId: createdDeviceIds[0] },
        });
      }
    }

    await tx.phieuNhap.update({
      where: { id },
      data: { trangThai: "HOAN_TAT" },
    });
  });

  return prisma.phieuNhap.findUnique({
    where: { id },
    include: {
      nhaCungCap: true,
      nguoiTao: { select: { id: true, name: true, email: true } },
      chiTiet: true,
    },
  });
}

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user) return Response.json({ error: "Không được xác thực" }, { status: 401 });

  const { id } = await params;
  const phieu = await prisma.phieuNhap.findUnique({
    where: { id },
    include: {
      nhaCungCap: true,
      nguoiTao: { select: { id: true, name: true, email: true } },
      chiTiet: true,
    },
  });

  if (!phieu) return Response.json({ error: "Không tìm thấy phiếu nhập" }, { status: 404 });
  return Response.json(phieu);
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await auth();
  const user = session?.user;
  if (!user || !allowedRoles.includes(user.role as (typeof allowedRoles)[number])) {
    return Response.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = updatePhieuNhapSchema.parse(body);

    const existing = await prisma.phieuNhap.findUnique({
      where: { id },
      include: { nhaCungCap: { select: { id: true } }, chiTiet: true },
    });

    if (!existing) {
      return Response.json({ error: "Không tìm thấy phiếu nhập" }, { status: 404 });
    }

    if (parsed.trangThai === "HOAN_TAT" && !existing.nhaCungCapId) {
      return Response.json({ error: "Phiếu nhập chưa có nhà cung cấp hợp lệ" }, { status: 400 });
    }

    let danhMucId: string | undefined;
    if (parsed.trangThai === "HOAN_TAT") {
      const firstCategory = await prisma.danhMucThietBi.findFirst({ select: { id: true } });
      if (!firstCategory) {
        return Response.json(
          { error: "Cần có ít nhất một danh mục thiết bị trước khi hoàn tất phiếu nhập" },
          { status: 400 },
        );
      }
      danhMucId = firstCategory.id;
    }

    const phieu =
      parsed.trangThai === "HOAN_TAT"
        ? await completeReceipt(id, user.id, danhMucId!)
        : await prisma.phieuNhap.update({
            where: { id },
            data: parsed,
            include: {
              nhaCungCap: true,
              nguoiTao: { select: { id: true, name: true, email: true } },
              chiTiet: true,
            },
          });

    await recordAuditLog(prisma, {
      userId: user.id,
      action: parsed.trangThai === "TU_CHOI" ? "REJECT_RECEIPT" : "UPDATE_STATUS",
      entity: "PhieuNhap",
      entityId: id,
      detail: `Trạng thái: ${parsed.trangThai}${parsed.ghiChu ? ` | Ghi chú: ${parsed.ghiChu}` : ""}`,
    });

    return Response.json(phieu);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Không thể cập nhật" },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await auth();
  const user = session?.user;
  if (!user || user.role !== "ADMIN") {
    return Response.json({ error: "Chỉ ADMIN mới có thể xóa phiếu nhập" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.phieuNhap.delete({ where: { id } });

  await recordAuditLog(prisma, {
    userId: user.id,
    action: "DELETE",
    entity: "PhieuNhap",
    entityId: id,
  });

  return Response.json({ success: true });
}
