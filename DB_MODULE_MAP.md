# Mởdule Mapping: Source Hiện Tại -> Database Mới

Tài liệu này đối chiếu code hiện tại với schema database mới trong `pasted-text.txt`.

## Quy ước
- `Giữ`: có thể dùng tiếp gần như nguyên vẹn
- `Sửa`: giữ ý tưởng nhưng phải đổi model/field/luồng xử lý
- `Xóa`: không còn phù hợp với schema mới
- `Thêm mới`: chưa có trong source hiện tại

## Tổng Quan

| Mởdule | Trạng thái | Ghi chú |
|---|---|---|
| `ThietBi` | Sửa | Đổi toàn bộ field sang schema mới: `ma_thiet_bi`, `ten_thiet_bi`, `so_serial`, `model`, `nam_san_xuat`, `don_vi_tinh`, `gia_tri`, `ngay_mua`, `han_bao_hanh`, `trang_thai` |
| `Khoa` | Sửa | Có trong cả hai phía nhưng khác tên field và relation |
| `Phong` | Sửa | Có trong cả hai phía nhưng khác tên field và relation |
| `DanhMucThietBi` | Sửa | Đổi field sang `ma_dm`, `ten_dm`, `mo_ta` |
| `NhaCungCap` | Sửa | Đổi field sang `ten_ncc`, `dia_chi`, `so_dien_thoai`, `email` |
| `BaoTri` | Sửa | Giữ nghiệp vụ bảo trì, nhưng map sang schema mới (`ky_thuat_vien_id`, `ngay_bat_dau`, `ngay_hoan_thanh`, `ngay_tao`) |
| `KiemKe` | Sửa | Flow kiểm kê vẫn có, nhưng item phải đổi sang `MucKiemKe` |
| `MuonTra` | Xóa / Viết lại | Schema mới không có `PhiếuMuon` |
| `User/Auth` | Sửa lớn | Schema mới dùng `NguoiDung`, không còn các bảng auth hiện tại |
| `AuditLog` | Xóa / Thay thế | Schema mới dùng `NhatKyHoatDòng` |

## Mởdule Hiện Tại

### 1. Thiết Bị
Trạng thái: `Sửa`

- File cần sửa:
  - `app/(dashboard)/thiet-bi/page.tsx`
  - `app/(dashboard)/thiet-bi/[id]/page.tsx`
  - `app/api/thiet-bi/route.ts`
  - `app/api/thiet-bi/[id]/route.ts`
  - `app/api/thiet-bi/[id]/qr/route.ts`
  - `app/api/thiet-bi/import/route.ts`
  - `components/thiet-bi/device-management-panel.tsx`
  - `components/thiet-bi/device-table.tsx`
  - `lib/validations/thiet-bi.ts`

- Cần đổi:
  - `maThietBi` -> `ma_thiet_bi`
  - `tenThietBi` -> `ten_thiet_bi`
  - `serialNumber` -> `so_serial`
  - `thongSoKyThuat` -> `model` hoặc field tương đương
  - `namNhap` -> `nam_san_xuat`
  - `giaTriBanDau` -> `gia_tri`
  - `baoHanhDen` -> `han_bao_hanh`
  - `danhMucId` -> `danh_muc_id`

### 2. Khoa
Trạng thái: `Sửa`

- File liên quan:
  - `app/api/*` nào đang gọi `prisma.khoa`
  - `components`/`pages` nào hiển thị danh sách khoa

- Cần đổi:
  - `tenKhoa` -> `ten_khoa`
  - `maKhoa` -> `ma_khoa`
  - `createdAt` -> `ngay_tao`
  - relation `users`, `phongs`, `thietBis` theo schema mới

### 3. Phong
Trạng thái: `Sửa`

- Cần đổi:
  - `tenPhong` -> `ten_phong`
  - `maPhong` -> `ma_phong`
  - `loaiPhong` -> `loai_phong`
  - `khoaId` -> `khoa_id`
  - `createdAt` -> `ngay_tao`

### 4. Danh Muc Thiet Bi
Trạng thái: `Sửa`

- Cần đổi:
  - `tenDM` -> `ten_dm`
  - `maDM` -> `ma_dm`
  - `moTa` -> `mo_ta`

### 5. Nha Cung Cap
Trạng thái: `Sửa`

- Cần đổi:
  - `tenNCC` -> `ten_ncc`
  - `diaChi` -> `dia_chi`
  - `soDienThoai` -> `so_dien_thoai`

### 6. Bao Tri
Trạng thái: `Sửa`

- Mởdule hiện tại có thể giữ logic quản lý bảo trì, nhưng phải map lại theo schema mới.
- Cần đổi:
  - `kyThuatVienId` -> `ky_thuat_vien_id`
  - `ngayBatDau` -> `ngay_bat_dau`
  - `ngayHoanThanh` -> `ngay_hoan_thanh`
  - `createdAt` -> `ngay_tao`

### 7. Kiem Ke
Trạng thái: `Sửa`

- Flow kiểm kê vẫn nên giữ.
- Nhưng item hiện tại `KiemKeItem` phải đổi sang `MucKiemKe`.
- Cần đổi:
  - `daXacNhãn` -> `da_xac_nhan`
  - `ngayXacNhãn` -> `ngay_xac_nhan`
  - `nguoiXacNhãnId` cần thêm vào code nếu dùng

### 8. Muon Tra
Trạng thái: `Xóa / Viết lại`

- Schema mới không có:
  - `PhiếuMuon`
  - `nguoiMuon`
  - `ngayMuon`
  - `ngayTraDuKien`
  - `ngayTraThucTe`
  - `phiQhanHan`

- Các file nên bỏ hoặc viết lại:
  - `app/(dashboard)/muon-tra/*`
  - `app/api/muon-tra/*`
  - `components/muon-tra/*`
  - `lib/muon-tra.ts`
  - `app/actions/muon-tra.actions.ts`

### 9. Auth / User
Trạng thái: `Sửa lớn`

- Source hiện tại đang dùng:
  - `User`
  - `Account`
  - `Session`
  - `Authenticator`
  - `VerificationToken`
  - `PrismaAdapter`
  - `next-auth`

- Schema mới lại dùng:
  - `NguoiDung`
  - không có các bảng auth ở trên

- Kết luận:
  - Nếu giữ `next-auth` theo cách hiện tại thì phải thêm lại các bảng auth chuẩn.
  - Nếu giữ schema mới nguyên bản thì phải bỏ `PrismaAdapter` và viết auth mới theo `NguoiDung`.

### 10. Audit Log
Trạng thái: `Xóa / Thay thế`

- Schema mới dùng `NhatKyHoatDòng`.
- Cần đổi toàn bộ chỗ gọi `prisma.auditLog` sang model mới.

## Mởdule Cần Thêm Mới

| Mởdule | Trạng thái | Ghi chú |
|---|---|---|
| `PhiếuNhap` | Thêm mới | Quản lý nhập thiết bị |
| `ChiTietPhiếuNhap` | Thêm mới | Chi tiết từng dòng thiết bị nhập |
| `PhanBoThietBi` | Thêm mới | Cấp phát thiết bị cho khoa/phòng/người bàn giao |
| `ThanhLy` | Thêm mới | Thanh lý thiết bị, giá trị thu hồi |
| `NhatKyHoatDòng` | Thêm mới | Nhật ký hành động thay cho `AuditLog` |
| `MucKiemKe` | Thêm mới | Chi tiết kiểm kê thay cho `KiemKeItem` |
| `NguoiDung` | Thêm mới / Sửa lớn | Thay cho user model hiện tại |

## Ưu Tiên Triển Khai

1. Quyết định lại kiến trúc auth
2. Chuyển `ThietBi`, `Khoa`, `Phong`, `DanhMucThietBi`, `NhaCungCap`
3. Viết lại `MuonTra` theo nghiệp vụ mới, hoặc loại bỏ
4. Thêm `PhiếuNhap`, `PhanBoThietBi`, `ThanhLy`
5. Đổi toàn bộ log/kiểm kê sang `NhatKyHoatDòng` và `MucKiemKe`

## Ghi Chú

- Đây là mapping theo source hiện tại trong repo và schema bạn đã gửi.
- Nếu bạn muốn, bước tiếp theo nên là chốt:
  - giữ `next-auth` hay bỏ `next-auth`
  - giữ module `mượn/trả` hay thay bằng `phân bổ/thanh lý/nhập kho`

