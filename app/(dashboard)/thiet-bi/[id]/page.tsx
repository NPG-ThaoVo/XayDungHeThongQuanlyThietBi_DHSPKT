import Image from "next/image";
import { notFound } from "next/navigation";
import QRCode from "qrcode";

import { StatusBadge } from "@/components/shared/status-badge";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { getAppOrigin } from "@/lib/app-url";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DeviceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [device, maintenanceHistory, movementHistory] = await Promise.all([
    prisma.thietBi.findUnique({
      where: { id },
      include: {
        danhMuc: true,
        phong: true,
        khoa: true,
        nhaCungCap: true,
      },
    }),
    prisma.baoTri.findMany({
      where: { thietBiId: id },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.lichSuDiChuyen.findMany({
      where: { thietBiId: id },
      orderBy: { ngayDiChuyen: "desc" },
      take: 5,
    }),
  ]);

  if (!device) {
    notFound();
  }

  const qrCodeDataUrl = await QRCode.toDataURL(
    `${await getAppOrigin()}/thiet-bi/${device.id}`,
  );

  const warrantyLabel = device.baoHanhDen ? formatDate(device.baoHanhDen) : "Chưa có";

  const stats = [
    {
      label: "Giá trị",
      value: formatCurrency(Number(device.giaTriBanDau)),
      note: "Giá trị ban đầu của tài sản",
    },
    {
      label: "Năm nhập",
      value: String(device.namNhap),
      note: "Năm ghi nhận trong hệ thống",
    },
    {
      label: "Bảo hành đến",
      value: warrantyLabel,
      note: "Hạn bảo hành đang áp dụng",
    },
    {
      label: "Trạng thái",
      value: device.trangThai,
      note: "Trạng thái hiện tại của thiết bị",
    },
  ];

  return (
    <>
      <Topbar
        title={device.tenThietBi}
        description="Thông tin chi tiết, lịch sử sử dụng và QR truy xuất cho thiết bị này."
      />
      <main className="space-y-6 p-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <Card key={item.label} className="p-5">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-3 text-xl font-semibold text-slate-950">{item.value}</p>
              <p className="mt-2 text-sm text-slate-500">{item.note}</p>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">{device.maThietBi}</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">{device.tenThietBi}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {device.moTa ?? "Không có mô tả chi tiết cho thiết bị này."}
                </p>
              </div>
              <StatusBadge status={device.trangThai} />
            </div>

            <dl className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Serial</dt>
                <dd className="mt-1 font-medium text-slate-900">{device.serialNumber ?? "--"}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Thông số kỹ thuật</dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {device.thongSoKyThuat ?? "Chưa cập nhật"}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Danh mục</dt>
                <dd className="mt-1 font-medium text-slate-900">{device.danhMuc.tenDM}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Nhà cung cấp</dt>
                <dd className="mt-1 font-medium text-slate-900">
                  {device.nhaCungCap?.tenNCC ?? "Chưa gán"}
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Khoa</dt>
                <dd className="mt-1 font-medium text-slate-900">{device.khoa?.tenKhoa ?? "Chưa gán"}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Phòng</dt>
                <dd className="mt-1 font-medium text-slate-900">{device.phong?.tenPhong ?? "Chưa gán"}</dd>
              </div>
            </dl>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-950">QR Lookup</h3>
            <p className="mt-2 text-sm text-slate-500">
              QR này dùng cho tra cứu nhanh và xác thực tài sản.
            </p>
            <div className="mt-6 rounded-[28px] bg-slate-950 p-8 text-center text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Mã QR truy xuất</p>
              <div className="mt-5 inline-flex h-44 w-44 items-center justify-center rounded-3xl bg-white p-2 text-slate-950">
                <Image
                  src={qrCodeDataUrl}
                  alt={`QR Code ${device.maThietBi}`}
                  width={176}
                  height={176}
                  unoptimized
                  className="h-full w-full rounded-2xl object-cover"
                />
              </div>
              <p className="mt-5 text-sm text-slate-300">
                Đường dẫn tra cứu QR theo {device.maThietBi}
              </p>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-950">Lịch sử bảo trì gần đây</h3>
            <div className="mt-5 space-y-3">
              {maintenanceHistory.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  Chưa có phiếu bảo trì nào được ghi nhận.
                </div>
              ) : (
                maintenanceHistory.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                    <p className="font-medium text-slate-950">{item.loaiBaoTri}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.moTaVanDe}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Bắt đầu: {formatDate(item.ngayBatDau)}
                      {item.ngayHoanThanh ? ` | Hoàn thành: ${formatDate(item.ngayHoanThanh)}` : ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-950">Lịch sử di chuyển</h3>
            <div className="mt-5 space-y-3">
              {movementHistory.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  Chưa có lịch sử di chuyển nào cho thiết bị này.
                </div>
              ) : (
                movementHistory.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-100 p-4">
                    <p className="font-medium text-slate-950">
                      {item.tuPhong ?? "--"} {"->"} {item.denPhong ?? "--"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {item.lyDo ?? "Không có lý do ghi nhận"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Thực hiện bởi: {item.nguoiThucHien} | {formatDate(item.ngayDiChuyen)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </section>
      </main>
    </>
  );
}
