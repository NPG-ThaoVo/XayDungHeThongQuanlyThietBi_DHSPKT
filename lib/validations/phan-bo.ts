import { z } from "zod";

export const phanBoSchema = z.object({
  thietBiId: z.string().min(1, { message: "Vui lòng chọn thiết bị." }),
  denPhong: z.string().optional(),
  denKhoa: z.string().optional(),
  lyDo: z.string().optional(),
}).refine(
  (data) => data.denPhong || data.denKhoa,
  { message: "Vui lòng chọn phòng hoặc khoa đích.", path: ["denPhong"] },
);

export type PhanBoInput = z.infer<typeof phanBoSchema>;
