-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'TRUONG_KHOA', 'GIANG_VIEN', 'THU_KHO', 'SINH_VIEN', 'KY_THUAT_VIEN');

-- CreateEnum
CREATE TYPE "public"."TrangThaiPhieu" AS ENUM ('CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'DANG_MUON', 'DA_TRA', 'QUA_HAN');

-- CreateEnum
CREATE TYPE "public"."TrangThaiPhieuNhap" AS ENUM ('CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'HOAN_TAT');

-- CreateEnum
CREATE TYPE "public"."TrangThaiThietBi" AS ENUM ('TOT', 'HONG', 'BAO_TRI', 'THANH_LY', 'CHO_DUYET', 'CHO_THANH_LY', 'DA_THANH_LY');

-- CreateTable
CREATE TABLE "public"."Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "detail" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Authenticator" (
    "credentialID" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    CONSTRAINT "Authenticator_pkey" PRIMARY KEY ("userId","credentialID")
);

-- CreateTable
CREATE TABLE "public"."BaoTri" (
    "id" TEXT NOT NULL,
    "thietBiId" TEXT NOT NULL,
    "loaiBaoTri" TEXT NOT NULL,
    "moTaVanDe" TEXT NOT NULL,
    "ketQua" TEXT,
    "chiPhi" DECIMAL(65,30),
    "kyThuatVienId" TEXT,
    "ngayBatDau" TIMESTAMP(3) NOT NULL,
    "ngayHoanThanh" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BaoTri_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DanhMucThietBi" (
    "id" TEXT NOT NULL,
    "tenDM" TEXT NOT NULL,
    "maDM" TEXT NOT NULL,
    "moTa" TEXT,

    CONSTRAINT "DanhMucThietBi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DotKiemKe" (
    "id" TEXT NOT NULL,
    "tenDot" TEXT NOT NULL,
    "ngayBatDau" TIMESTAMP(3) NOT NULL,
    "ngayKetThuc" TIMESTAMP(3),
    "trangThai" TEXT NOT NULL DEFAULT 'DANG_THUC_HIEN',
    "nguoiTao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DotKiemKe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Khoa" (
    "id" TEXT NOT NULL,
    "tenKhoa" TEXT NOT NULL,
    "maKhoa" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Khoa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."KiemKeItem" (
    "id" TEXT NOT NULL,
    "dotKiemKeId" TEXT NOT NULL,
    "thietBiId" TEXT NOT NULL,
    "trangThaiThucTe" TEXT,
    "ghiChu" TEXT,
    "daXacNhan" BOOLEAN NOT NULL DEFAULT false,
    "ngayXacNhan" TIMESTAMP(3),

    CONSTRAINT "KiemKeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LichSuDiChuyen" (
    "id" TEXT NOT NULL,
    "thietBiId" TEXT NOT NULL,
    "tuPhong" TEXT,
    "denPhong" TEXT,
    "lyDo" TEXT,
    "nguoiThucHien" TEXT NOT NULL,
    "ngayDiChuyen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "denKhoa" TEXT,
    "tuKhoa" TEXT,

    CONSTRAINT "LichSuDiChuyen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NhaCungCap" (
    "id" TEXT NOT NULL,
    "tenNCC" TEXT NOT NULL,
    "diaChi" TEXT,
    "soDienThoai" TEXT,
    "email" TEXT,

    CONSTRAINT "NhaCungCap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PhieuMuon" (
    "id" TEXT NOT NULL,
    "maPhieu" TEXT NOT NULL,
    "thietBiId" TEXT NOT NULL,
    "nguoiMuonId" TEXT NOT NULL,
    "mucDich" TEXT NOT NULL,
    "ngayMuon" TIMESTAMP(3) NOT NULL,
    "ngayTraDuKien" TIMESTAMP(3) NOT NULL,
    "ngayTraThucTe" TIMESTAMP(3),
    "trangThai" "public"."TrangThaiPhieu" NOT NULL DEFAULT 'CHO_DUYET',
    "ghiChu" TEXT,
    "tinhTrangTra" TEXT,
    "phiQhanHan" DECIMAL(65,30),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhieuMuon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PhieuNhap" (
    "id" TEXT NOT NULL,
    "maPhieu" TEXT NOT NULL,
    "nhaCungCapId" TEXT NOT NULL,
    "nguoiTaoId" TEXT NOT NULL,
    "tongTien" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ghiChu" TEXT,
    "trangThai" "public"."TrangThaiPhieuNhap" NOT NULL DEFAULT 'CHO_DUYET',
    "ngayNhap" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhieuNhap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PhieuNhapChiTiet" (
    "id" TEXT NOT NULL,
    "phieuNhapId" TEXT NOT NULL,
    "tenThietBi" TEXT NOT NULL,
    "soLuong" INTEGER NOT NULL DEFAULT 1,
    "donGia" DECIMAL(65,30) NOT NULL,
    "thietBiId" TEXT,
    "ghiChu" TEXT,

    CONSTRAINT "PhieuNhapChiTiet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Phong" (
    "id" TEXT NOT NULL,
    "tenPhong" TEXT NOT NULL,
    "maPhong" TEXT NOT NULL,
    "loaiPhong" TEXT NOT NULL,
    "khoaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Phong_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sessionToken")
);

-- CreateTable
CREATE TABLE "public"."ThietBi" (
    "id" TEXT NOT NULL,
    "maThietBi" TEXT NOT NULL,
    "tenThietBi" TEXT NOT NULL,
    "moTa" TEXT,
    "thongSoKyThuat" TEXT,
    "serialNumber" TEXT,
    "namNhap" INTEGER NOT NULL,
    "giaTriBanDau" DECIMAL(65,30) NOT NULL,
    "baoHanhDen" TIMESTAMP(3),
    "trangThai" "public"."TrangThaiThietBi" NOT NULL DEFAULT 'TOT',
    "hinhAnh" TEXT[],
    "qrCode" TEXT,
    "danhMucId" TEXT NOT NULL,
    "nhaCungCapId" TEXT,
    "khoaId" TEXT,
    "phongId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ThietBi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'SINH_VIEN',
    "phone" TEXT,
    "maSoNV" TEXT,
    "khoaId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateIndex
CREATE UNIQUE INDEX "Authenticator_credentialID_key" ON "public"."Authenticator"("credentialID" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "DanhMucThietBi_maDM_key" ON "public"."DanhMucThietBi"("maDM" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Khoa_maKhoa_key" ON "public"."Khoa"("maKhoa" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "KiemKeItem_dotKiemKeId_thietBiId_key" ON "public"."KiemKeItem"("dotKiemKeId" ASC, "thietBiId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "public"."PasswordResetToken"("token" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PhieuMuon_maPhieu_key" ON "public"."PhieuMuon"("maPhieu" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PhieuNhap_maPhieu_key" ON "public"."PhieuNhap"("maPhieu" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Phong_maPhong_key" ON "public"."Phong"("maPhong" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ThietBi_maThietBi_key" ON "public"."ThietBi"("maThietBi" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "ThietBi_serialNumber_key" ON "public"."ThietBi"("serialNumber" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "User_maSoNV_key" ON "public"."User"("maSoNV" ASC);

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Authenticator" ADD CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BaoTri" ADD CONSTRAINT "BaoTri_kyThuatVienId_fkey" FOREIGN KEY ("kyThuatVienId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BaoTri" ADD CONSTRAINT "BaoTri_thietBiId_fkey" FOREIGN KEY ("thietBiId") REFERENCES "public"."ThietBi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KiemKeItem" ADD CONSTRAINT "KiemKeItem_dotKiemKeId_fkey" FOREIGN KEY ("dotKiemKeId") REFERENCES "public"."DotKiemKe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."KiemKeItem" ADD CONSTRAINT "KiemKeItem_thietBiId_fkey" FOREIGN KEY ("thietBiId") REFERENCES "public"."ThietBi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LichSuDiChuyen" ADD CONSTRAINT "LichSuDiChuyen_thietBiId_fkey" FOREIGN KEY ("thietBiId") REFERENCES "public"."ThietBi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhieuMuon" ADD CONSTRAINT "PhieuMuon_nguoiMuonId_fkey" FOREIGN KEY ("nguoiMuonId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhieuMuon" ADD CONSTRAINT "PhieuMuon_thietBiId_fkey" FOREIGN KEY ("thietBiId") REFERENCES "public"."ThietBi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhieuNhap" ADD CONSTRAINT "PhieuNhap_nguoiTaoId_fkey" FOREIGN KEY ("nguoiTaoId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhieuNhap" ADD CONSTRAINT "PhieuNhap_nhaCungCapId_fkey" FOREIGN KEY ("nhaCungCapId") REFERENCES "public"."NhaCungCap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhieuNhapChiTiet" ADD CONSTRAINT "PhieuNhapChiTiet_phieuNhapId_fkey" FOREIGN KEY ("phieuNhapId") REFERENCES "public"."PhieuNhap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PhieuNhapChiTiet" ADD CONSTRAINT "PhieuNhapChiTiet_thietBiId_fkey" FOREIGN KEY ("thietBiId") REFERENCES "public"."ThietBi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Phong" ADD CONSTRAINT "Phong_khoaId_fkey" FOREIGN KEY ("khoaId") REFERENCES "public"."Khoa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ThietBi" ADD CONSTRAINT "ThietBi_danhMucId_fkey" FOREIGN KEY ("danhMucId") REFERENCES "public"."DanhMucThietBi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ThietBi" ADD CONSTRAINT "ThietBi_khoaId_fkey" FOREIGN KEY ("khoaId") REFERENCES "public"."Khoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ThietBi" ADD CONSTRAINT "ThietBi_nhaCungCapId_fkey" FOREIGN KEY ("nhaCungCapId") REFERENCES "public"."NhaCungCap"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ThietBi" ADD CONSTRAINT "ThietBi_phongId_fkey" FOREIGN KEY ("phongId") REFERENCES "public"."Phong"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_khoaId_fkey" FOREIGN KEY ("khoaId") REFERENCES "public"."Khoa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

