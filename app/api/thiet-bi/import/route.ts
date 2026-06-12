import * as XLSX from "xlsx";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { importThietBiRowSchema } from "@/lib/validations/thiet-bi";

type ExcelRow = {
  [key: string]: string | number | undefined;
};

function getRowValue(row: ExcelRow, keys: string[]) {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return undefined;
}

export async function POST(request: Request) {
  const session = await auth();
  const user = session?.user;

  if (!user || !["ADMIN", "THU_KHO"].includes(user.role)) {
    return Response.json({ error: "Không có quyền truy cập" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "Thiếu tệp" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

  const results = { success: 0, failed: 0, errors: [] as string[] };

  for (const row of rows) {
    try {
      const parsed = importThietBiRowSchema.parse({
        maThietBi: getRowValue(row, ["Mã thiết bị", "Ma thiet bi"]),
        tenThietBi: getRowValue(row, ["Tên thiết bị", "Ten thiet bi"]),
        namNhap: getRowValue(row, ["Năm nhập", "Nam nhap"]),
        giaTriBanDau: getRowValue(row, ["Giá trị", "Gia tri"]),
        danhMucId: getRowValue(row, ["Mã danh mục", "Ma danh muc"]),
      });

      await prisma.thietBi.create({
        data: {
          ...parsed,
          hinhAnh: [],
        },
      });

      results.success += 1;
    } catch (error) {
      results.failed += 1;
      results.errors.push(`Dòng ${String(getRowValue(row, ["Mã thiết bị", "Ma thiet bi"]) ?? "--")}: ${String(error)}`);
    }
  }

  return Response.json(results);
}
