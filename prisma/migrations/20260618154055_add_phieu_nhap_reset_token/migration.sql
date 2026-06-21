-- CreateEnum
CREATE TYPE "TrangThaiPhieuNhap" AS ENUM ('CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'HOAN_TAT');

-- AlterTable: Add phieuNhap relation to NhaCungCap (no column change needed, handled via FK)

-- CreateTable PhieuNhap
CREATE TABLE "PhieuNhap" (
    "id" TEXT NOT NULL,
    "maPhieu" TEXT NOT NULL,
    "nhaCungCapId" TEXT NOT NULL,
    "nguoiTaoId" TEXT NOT NULL,
    "tongTien" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "ghiChu" TEXT,
    "trangThai" "TrangThaiPhieuNhap" NOT NULL DEFAULT 'CHO_DUYET',
    "ngayNhap" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhieuNhap_pkey" PRIMARY KEY ("id")
);

-- CreateTable PhieuNhapChiTiet
CREATE TABLE "PhieuNhapChiTiet" (
    "id" TEXT NOT NULL,
    "phieuNhapId" TEXT NOT NULL,
    "tenThietBi" TEXT NOT NULL,
    "soLuong" INTEGER NOT NULL DEFAULT 1,
    "donGia" DECIMAL(65,30) NOT NULL,
    "thietBiId" TEXT,
    "ghiChu" TEXT,

    CONSTRAINT "PhieuNhapChiTiet_pkey" PRIMARY KEY ("id")
);

-- CreateTable PasswordResetToken
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PhieuNhap_maPhieu_key" ON "PhieuNhap"("maPhieu");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- AddForeignKey
ALTER TABLE "PhieuNhap" ADD CONSTRAINT "PhieuNhap_nhaCungCapId_fkey" FOREIGN KEY ("nhaCungCapId") REFERENCES "NhaCungCap"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuNhap" ADD CONSTRAINT "PhieuNhap_nguoiTaoId_fkey" FOREIGN KEY ("nguoiTaoId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuNhapChiTiet" ADD CONSTRAINT "PhieuNhapChiTiet_phieuNhapId_fkey" FOREIGN KEY ("phieuNhapId") REFERENCES "PhieuNhap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuNhapChiTiet" ADD CONSTRAINT "PhieuNhapChiTiet_thietBiId_fkey" FOREIGN KEY ("thietBiId") REFERENCES "ThietBi"("id") ON DELETE SET NULL ON UPDATE CASCADE;
