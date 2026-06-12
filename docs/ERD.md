# ERD (Entity Relationship Diagram)

> Nguồn: `prisma/schema.prisma`

```mermaid
erDiagram
  User {
    String id PK
    String email UK
    String maSoNV UK
    String khoaId FK
    Role role
    Boolean isActive
    Boolean twoFactorEnabled
    DateTime createdAt
    DateTime updatedAt
  }

  Khoa {
    String id PK
    String maKhoa UK
    String tenKhoa
    DateTime createdAt
  }

  Phong {
    String id PK
    String maPhong UK
    String tenPhong
    String loaiPhong
    String khoaId FK
    DateTime createdAt
  }

  DanhMucThietBi {
    String id PK
    String maDM UK
    String tenDM
    String moTa
  }

  NhaCungCap {
    String id PK
    String tenNCC
    String diaChi
    String soDienThoai
    String email
  }

  ThietBi {
    String id PK
    String maThietBi UK
    String serialNumber UK
    String tenThietBi
    Decimal giaTriBanDau
    TrangThaiThietBi trangThai
    String danhMucId FK
    String nhaCungCapId FK
    String khoaId FK
    String phongId FK
    DateTime createdAt
    DateTime updatedAt
  }

  LichSuDiChuyen {
    String id PK
    String thietBiId FK
    String tuPhong
    String denPhong
    String nguoiThucHien
    DateTime ngayDiChuyen
  }

  PhiếuMuon {
    String id PK
    String maPhiếu UK
    String thietBiId FK
    String nguoiMuonId FK
    TrangThaiPhiếu trangThai
    DateTime ngayMuon
    DateTime ngayTraDuKien
    DateTime ngayTraThucTe
    Decimal phiQhanHan
    DateTime createdAt
    DateTime updatedAt
  }

  BaoTri {
    String id PK
    String thietBiId FK
    String kyThuatVienId FK
    String loaiBaoTri
    String moTaVanDe
    String ketQua
    Decimal chiPhi
    DateTime ngayBatDau
    DateTime ngayHoanThanh
    DateTime createdAt
  }

  DotKiemKe {
    String id PK
    String tenDot
    DateTime ngayBatDau
    DateTime ngayKetThuc
    String trangThai
    String nguoiTao
    DateTime createdAt
  }

  KiemKeItem {
    String id PK
    String dotKiemKeId FK
    String thietBiId FK
    String trangThaiThucTe
    Boolean daXacNhãn
    DateTime ngayXacNhãn
  }

  AuditLog {
    String id PK
    String userId FK
    String action
    String entity
    String entityId
    DateTime createdAt
  }

  Account {
    String userId FK
    String provider PK
    String providerAccountId PK
  }

  Session {
    String sessionToken PK
    String userId FK
    DateTime expires
  }

  VerificationToken {
    String identifier PK
    String token PK
    DateTime expires
  }

  Authenticator {
    String userId PK
    String credentialID PK
    String providerAccountId
    Int counter
    Boolean credentialBackedUp
  }

  %% Relationships (cardinality reflects Prisma relations; some FKs are optional in schema)
  Khoa ||--o{ User : "users (optional)"
  Khoa ||--o{ Phong : "phongs"
  Khoa ||--o{ ThietBi : "thietBis (optional)"

  Phong ||--o{ ThietBi : "thietBis (optional)"
  DanhMucThietBi ||--o{ ThietBi : "thietBis"
  NhaCungCap ||--o{ ThietBi : "thietBis (optional)"

  ThietBi ||--o{ PhiếuMuon : "phieuMuon"
  User ||--o{ PhiếuMuon : "phieuMuon"

  ThietBi ||--o{ BaoTri : "baoTri"
  User ||--o{ BaoTri : "baoTriAssigned (optional)"

  ThietBi ||--o{ LichSuDiChuyen : "lichSuDiChuyen"

  DotKiemKe ||--o{ KiemKeItem : "items"
  ThietBi ||--o{ KiemKeItem : "kiemKeItems"

  User ||--o{ AuditLog : "auditLogs"

  User ||--o{ Account : "accounts"
  User ||--o{ Session : "sessions"
  User ||--o{ Authenticator : "authenticators"
```

## Ghi chú

- Các enum chính: `Role`, `TrangThaiThietBi`, `TrangThaiPhiếu`.
- `Account`, `Session`, `VerificationToken`, `Authenticator` là các bảng phục vụ Auth.js/NextAuth (Prisma Adapter).

