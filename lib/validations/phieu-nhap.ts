import { z } from "zod";

export const phieuNhapChiTietSchema = z.object({
  tenThietBi: z.string().min(1, "Tên thiết bị không được để trống"),
  soLuong: z.coerce.number().int().min(1, "Số lượng phải ít nhất 1"),
  donGia: z.coerce.number().positive("Đơn giá phải lớn hơn 0"),
  ghiChu: z.string().optional(),
});

export const createPhieuNhapSchema = z.object({
  nhaCungCapId: z.string().min(1, "Vui lòng chọn nhà cung cấp"),
  ghiChu: z.string().optional(),
  chiTiet: z
    .array(phieuNhapChiTietSchema)
    .min(1, "Phiếu nhập phải có ít nhất một dòng thiết bị"),
});

export const updatePhieuNhapSchema = z.object({
  trangThai: z.enum(["CHO_DUYET", "DA_DUYET", "TU_CHOI", "HOAN_TAT"]),
  ghiChu: z.string().optional(),
});
