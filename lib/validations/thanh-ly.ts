import { z } from "zod";

export const thanhLySchema = z.object({
  thietBiId: z.string().min(1, { message: "Vui lòng chọn thiết bị." }),
  giaTriThuHoi: z.coerce.number().nonnegative({ message: "Giá trị thu hồi không được âm." }),
  phuongThuc: z.enum(["BAN", "HUY", "TAI_SU_DUNG"], { message: "Vui lòng chọn phương thức." }),
  lyDo: z.string().optional(),
});

export type ThanhLyInput = z.infer<typeof thanhLySchema>;
