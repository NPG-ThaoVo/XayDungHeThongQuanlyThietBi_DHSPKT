import { z } from "zod";

export const kiemKeRoundCreateSchema = z.object({
  tenDot: z.string().min(1),
  ngayBatDau: z.string().datetime(),
  thietBiIds: z.array(z.string().min(1)).optional(),
});

export const kiemKeRoundUpdateSchema = z.object({
  trangThai: z.enum(["DANG_THUC_HIEN", "HOAN_THANH"]).optional(),
  ngayKetThuc: z.string().datetime().optional().or(z.literal("")),
});

export const kiemKeItemUpdateSchema = z.object({
  trangThaiThucTe: z.enum(["TOT", "HONG", "BAO_TRI", "THANH_LY"]).optional().or(z.literal("")),
  ghiChu: z.string().optional().or(z.literal("")),
  daXacNhan: z.coerce.boolean().optional(),
});


