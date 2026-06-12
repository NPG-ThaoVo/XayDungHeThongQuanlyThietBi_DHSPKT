import { PrismaClient, Role, TrangThaiPhiếu, TrangThaiThietBi } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertSupplier(data: {
  tenNCC: string;
  email?: string;
  soDienThoai?: string;
  diaChi?: string;
}) {
  const existing = await prisma.nhaCungCap.findFirst({
    where: { tenNCC: data.tenNCC },
  });

  if (existing) {
    return prisma.nhaCungCap.update({
      where: { id: existing.id },
      data,
    });
  }

  return prisma.nhaCungCap.create({ data });
}

async function createOrUpdateAuditLog(params: {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  detail?: string;
}) {
  const existing = await prisma.auditLog.findFirst({
    where: {
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
    },
  });

  if (existing) {
    return prisma.auditLog.update({
      where: { id: existing.id },
      data: { detail: params.detail },
    });
  }

  return prisma.auditLog.create({ data: params });
}

async function createOrUpdateMovement(params: {
  thietBiId: string;
  tuPhong?: string;
  denPhong?: string;
  lyDo?: string;
  nguoiThucHien: string;
}) {
  const existing = await prisma.lichSuDiChuyen.findFirst({
    where: {
      thietBiId: params.thietBiId,
      tuPhong: params.tuPhong,
      denPhong: params.denPhong,
      lyDo: params.lyDo,
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.lichSuDiChuyen.create({ data: params });
}

async function main() {
  const hashedPasswords = await Promise.all([
    bcrypt.hash("Admin@123", 12),
    bcrypt.hash("TruongKhoa@123", 12),
    bcrypt.hash("ThuKho@123", 12),
    bcrypt.hash("GiangVien@123", 12),
    bcrypt.hash("SinhVien@123", 12),
  ]);

  const [adminPassword, truongKhoaPassword, thuKhoPassword, giangVienPassword, sinhVienPassword] =
    hashedPasswords;

  const khoaCNS = await prisma.khoa.upsert({
    where: { maKhoa: "CNS" },
    update: { tenKhoa: "Khoa Cong nghe so" },
    create: { maKhoa: "CNS", tenKhoa: "Khoa Cong nghe so" },
  });

  const khoaDTVT = await prisma.khoa.upsert({
    where: { maKhoa: "DTVT" },
    update: { tenKhoa: "Khoa Dien tu Vien thong" },
    create: { maKhoa: "DTVT", tenKhoa: "Khoa Dien tu Vien thong" },
  });

  const phongKhoCNS = await prisma.phong.upsert({
    where: { maPhong: "KHO-01" },
    update: {
      tenPhong: "Kho Thiet Bi CNS",
      loaiPhong: "KHO",
      khoaId: khoaCNS.id,
    },
    create: {
      tenPhong: "Kho Thiet Bi CNS",
      maPhong: "KHO-01",
      loaiPhong: "KHO",
      khoaId: khoaCNS.id,
    },
  });

  const phongLabMang = await prisma.phong.upsert({
    where: { maPhong: "TN-101" },
    update: {
      tenPhong: "Phong Thi Nghiem Mang",
      loaiPhong: "PHONG_TN",
      khoaId: khoaCNS.id,
    },
    create: {
      tenPhong: "Phong Thi Nghiem Mang",
      maPhong: "TN-101",
      loaiPhong: "PHONG_TN",
      khoaId: khoaCNS.id,
    },
  });

  const phongHocSmart = await prisma.phong.upsert({
    where: { maPhong: "A2-204" },
    update: {
      tenPhong: "Phong hoc thong minh A2-204",
      loaiPhong: "PHONG_HOC",
      khoaId: khoaCNS.id,
    },
    create: {
      tenPhong: "Phong hoc thong minh A2-204",
      maPhong: "A2-204",
      loaiPhong: "PHONG_HOC",
      khoaId: khoaCNS.id,
    },
  });

  const phongLabIoT = await prisma.phong.upsert({
    where: { maPhong: "B1-302" },
    update: {
      tenPhong: "Lab IoT B1-302",
      loaiPhong: "PHONG_TN",
      khoaId: khoaDTVT.id,
    },
    create: {
      tenPhong: "Lab IoT B1-302",
      maPhong: "B1-302",
      loaiPhong: "PHONG_TN",
      khoaId: khoaDTVT.id,
    },
  });

  const danhMucLaptop = await prisma.danhMucThietBi.upsert({
    where: { maDM: "LAPTOP" },
    update: { tenDM: "Laptop", moTa: "May tinh xach tay phuc vu giang day va muon ngan han" },
    create: {
      maDM: "LAPTOP",
      tenDM: "Laptop",
      moTa: "May tinh xach tay phuc vu giang day va muon ngan han",
    },
  });

  const danhMucProjector = await prisma.danhMucThietBi.upsert({
    where: { maDM: "MAYCHIEU" },
    update: { tenDM: "May chieu", moTa: "Thiết bị trinh chieu cho lop hoc va seminar" },
    create: {
      maDM: "MAYCHIEU",
      tenDM: "May chieu",
      moTa: "Thiết bị trinh chieu cho lop hoc va seminar",
    },
  });

  const danhMucNetwork = await prisma.danhMucThietBi.upsert({
    where: { maDM: "NETWORK" },
    update: { tenDM: "Networking", moTa: "Router, switch va bo kit thuc hanh mang" },
    create: {
      maDM: "NETWORK",
      tenDM: "Networking",
      moTa: "Router, switch va bo kit thuc hanh mang",
    },
  });

  const danhMucIoT = await prisma.danhMucThietBi.upsert({
    where: { maDM: "IOT" },
    update: { tenDM: "IoT Kit", moTa: "Bo kit vi dieu khien va cam bien" },
    create: {
      maDM: "IOT",
      tenDM: "IoT Kit",
      moTa: "Bo kit vi dieu khien va cam bien",
    },
  });

  const supplierTBHCM = await upsertSupplier({
    tenNCC: "Cong ty Thiet Bi HCM",
    email: "support@tbhcm.vn",
    soDienThoai: "0909000111",
    diaChi: "1 Vo Van Ngan, Thu Duc",
  });

  const supplierFPT = await upsertSupplier({
    tenNCC: "FPT Smart Edu",
    email: "edu@fpt.vn",
    soDienThoai: "02873007300",
    diaChi: "52 Lac Long Quan, Tan Binh",
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@hcmute.edu.vn" },
    update: {
      name: "Quan tri vien",
      password: adminPassword,
      role: Role.ADMIN,
      khoaId: khoaCNS.id,
      maSoNV: "ADMIN001",
      phone: "0901000001",
    },
    create: {
      name: "Quan tri vien",
      email: "admin@hcmute.edu.vn",
      password: adminPassword,
      role: Role.ADMIN,
      khoaId: khoaCNS.id,
      maSoNV: "ADMIN001",
      phone: "0901000001",
    },
  });

  const truongKhoa = await prisma.user.upsert({
    where: { email: "truongkhoa.cns@hcmute.edu.vn" },
    update: {
      name: "Le Thi Truong Khoa",
      password: truongKhoaPassword,
      role: Role.TRUONG_KHOA,
      khoaId: khoaCNS.id,
      maSoNV: "TK001",
      phone: "0901000002",
    },
    create: {
      name: "Le Thi Truong Khoa",
      email: "truongkhoa.cns@hcmute.edu.vn",
      password: truongKhoaPassword,
      role: Role.TRUONG_KHOA,
      khoaId: khoaCNS.id,
      maSoNV: "TK001",
      phone: "0901000002",
    },
  });

  const thuKho = await prisma.user.upsert({
    where: { email: "thukho@hcmute.edu.vn" },
    update: {
      name: "Pham Van Thu Kho",
      password: thuKhoPassword,
      role: Role.THU_KHO,
      khoaId: khoaCNS.id,
      maSoNV: "TKHO01",
      phone: "0901000003",
    },
    create: {
      name: "Pham Van Thu Kho",
      email: "thukho@hcmute.edu.vn",
      password: thuKhoPassword,
      role: Role.THU_KHO,
      khoaId: khoaCNS.id,
      maSoNV: "TKHO01",
      phone: "0901000003",
    },
  });

  const giangVien = await prisma.user.upsert({
    where: { email: "giangvien@hcmute.edu.vn" },
    update: {
      name: "Nguyen Van A",
      password: giangVienPassword,
      role: Role.GIANG_VIEN,
      khoaId: khoaCNS.id,
      maSoNV: "GV001",
      phone: "0901000004",
    },
    create: {
      name: "Nguyen Van A",
      email: "giangvien@hcmute.edu.vn",
      password: giangVienPassword,
      role: Role.GIANG_VIEN,
      khoaId: khoaCNS.id,
      maSoNV: "GV001",
      phone: "0901000004",
    },
  });

  const sinhVien = await prisma.user.upsert({
    where: { email: "sinhvien@hcmute.edu.vn" },
    update: {
      name: "Tran Thi B",
      password: sinhVienPassword,
      role: Role.SINH_VIEN,
      khoaId: khoaCNS.id,
      maSoNV: "22110002",
      phone: "0901000005",
    },
    create: {
      name: "Tran Thi B",
      email: "sinhvien@hcmute.edu.vn",
      password: sinhVienPassword,
      role: Role.SINH_VIEN,
      khoaId: khoaCNS.id,
      maSoNV: "22110002",
      phone: "0901000005",
    },
  });

  const thietBi1 = await prisma.thietBi.upsert({
    where: { maThietBi: "TB-0001" },
    update: {
      tenThietBi: "Laptop Dell Latitude 5440",
      moTa: "May phuc vu giang day va muon tam thoi",
      thongSoKyThuat: JSON.stringify({ cpu: "Intel Core i5", ram: "16GB", ssd: "512GB" }),
      serialNumber: "DL5440-001",
      namNhap: 2025,
      giaTriBanDau: 25000000,
      baoHanhDen: new Date("2027-12-31"),
      trangThai: TrangThaiThietBi.TOT,
      hinhAnh: [],
      danhMucId: danhMucLaptop.id,
      nhaCungCapId: supplierTBHCM.id,
      khoaId: khoaCNS.id,
      phongId: phongKhoCNS.id,
    },
    create: {
      maThietBi: "TB-0001",
      tenThietBi: "Laptop Dell Latitude 5440",
      moTa: "May phuc vu giang day va muon tam thoi",
      thongSoKyThuat: JSON.stringify({ cpu: "Intel Core i5", ram: "16GB", ssd: "512GB" }),
      serialNumber: "DL5440-001",
      namNhap: 2025,
      giaTriBanDau: 25000000,
      baoHanhDen: new Date("2027-12-31"),
      trangThai: TrangThaiThietBi.TOT,
      hinhAnh: [],
      danhMucId: danhMucLaptop.id,
      nhaCungCapId: supplierTBHCM.id,
      khoaId: khoaCNS.id,
      phongId: phongKhoCNS.id,
    },
  });

  const thietBi2 = await prisma.thietBi.upsert({
    where: { maThietBi: "TB-0002" },
    update: {
      tenThietBi: 'May chieu Epson EB-X51',
      moTa: "May chieu dung cho phong hoc thong minh",
      thongSoKyThuat: JSON.stringify({ doSang: "3800 lumens", congNghe: "3LCD" }),
      serialNumber: "EPSON-9988",
      namNhap: 2024,
      giaTriBanDau: 13900000,
      baoHanhDen: new Date("2026-10-10"),
      trangThai: TrangThaiThietBi.BAO_TRI,
      hinhAnh: [],
      danhMucId: danhMucProjector.id,
      nhaCungCapId: supplierFPT.id,
      khoaId: khoaCNS.id,
      phongId: phongHocSmart.id,
    },
    create: {
      maThietBi: "TB-0002",
      tenThietBi: "May chieu Epson EB-X51",
      moTa: "May chieu dung cho phong hoc thong minh",
      thongSoKyThuat: JSON.stringify({ doSang: "3800 lumens", congNghe: "3LCD" }),
      serialNumber: "EPSON-9988",
      namNhap: 2024,
      giaTriBanDau: 13900000,
      baoHanhDen: new Date("2026-10-10"),
      trangThai: TrangThaiThietBi.BAO_TRI,
      hinhAnh: [],
      danhMucId: danhMucProjector.id,
      nhaCungCapId: supplierFPT.id,
      khoaId: khoaCNS.id,
      phongId: phongHocSmart.id,
    },
  });

  const thietBi3 = await prisma.thietBi.upsert({
    where: { maThietBi: "TB-0003" },
    update: {
      tenThietBi: "Bo kit Cisco Lab",
      moTa: "Bo switch va router phuc vu thuc hanh mang",
      thongSoKyThuat: JSON.stringify({ router: 2, switch: 2, console: true }),
      serialNumber: "CISCO-LAB-01",
      namNhap: 2023,
      giaTriBanDau: 32000000,
      trangThai: TrangThaiThietBi.HONG,
      hinhAnh: [],
      danhMucId: danhMucNetwork.id,
      nhaCungCapId: supplierTBHCM.id,
      khoaId: khoaCNS.id,
      phongId: phongLabMang.id,
    },
    create: {
      maThietBi: "TB-0003",
      tenThietBi: "Bo kit Cisco Lab",
      moTa: "Bo switch va router phuc vu thuc hanh mang",
      thongSoKyThuat: JSON.stringify({ router: 2, switch: 2, console: true }),
      serialNumber: "CISCO-LAB-01",
      namNhap: 2023,
      giaTriBanDau: 32000000,
      trangThai: TrangThaiThietBi.HONG,
      hinhAnh: [],
      danhMucId: danhMucNetwork.id,
      nhaCungCapId: supplierTBHCM.id,
      khoaId: khoaCNS.id,
      phongId: phongLabMang.id,
    },
  });

  const thietBi4 = await prisma.thietBi.upsert({
    where: { maThietBi: "TB-0004" },
    update: {
      tenThietBi: "Bo kit IoT ESP32",
      moTa: "Bo kit thuc hanh cam bien va dieu khien",
      thongSoKyThuat: JSON.stringify({ board: "ESP32", camBien: 6, relay: 2 }),
      serialNumber: "IOT-ESP32-01",
      namNhap: 2025,
      giaTriBanDau: 4200000,
      trangThai: TrangThaiThietBi.TOT,
      hinhAnh: [],
      danhMucId: danhMucIoT.id,
      nhaCungCapId: supplierFPT.id,
      khoaId: khoaDTVT.id,
      phongId: phongLabIoT.id,
    },
    create: {
      maThietBi: "TB-0004",
      tenThietBi: "Bo kit IoT ESP32",
      moTa: "Bo kit thuc hanh cam bien va dieu khien",
      thongSoKyThuat: JSON.stringify({ board: "ESP32", camBien: 6, relay: 2 }),
      serialNumber: "IOT-ESP32-01",
      namNhap: 2025,
      giaTriBanDau: 4200000,
      trangThai: TrangThaiThietBi.TOT,
      hinhAnh: [],
      danhMucId: danhMucIoT.id,
      nhaCungCapId: supplierFPT.id,
      khoaId: khoaDTVT.id,
      phongId: phongLabIoT.id,
    },
  });

  await prisma.phieuMuon.upsert({
    where: { maPhiếu: "PM-001" },
    update: {
      thietBiId: thietBi1.id,
      nguoiMuonId: giangVien.id,
      mucDich: "Phuc vu giang day mon mang may tinh",
      ngayMuon: new Date("2026-04-09T08:00:00.000Z"),
      ngayTraDuKien: new Date("2026-04-12T10:00:00.000Z"),
      trangThai: TrangThaiPhiếu.CHO_DUYET,
      ghiChu: "Cho thu kho duyet",
    },
    create: {
      maPhiếu: "PM-001",
      thietBiId: thietBi1.id,
      nguoiMuonId: giangVien.id,
      mucDich: "Phuc vu giang day mon mang may tinh",
      ngayMuon: new Date("2026-04-09T08:00:00.000Z"),
      ngayTraDuKien: new Date("2026-04-12T10:00:00.000Z"),
      trangThai: TrangThaiPhiếu.CHO_DUYET,
      ghiChu: "Cho thu kho duyet",
    },
  });

  await prisma.phieuMuon.upsert({
    where: { maPhiếu: "PM-002" },
    update: {
      thietBiId: thietBi2.id,
      nguoiMuonId: sinhVien.id,
      mucDich: "Trinh bay bao cao do an mon hoc",
      ngayMuon: new Date("2026-04-07T01:00:00.000Z"),
      ngayTraDuKien: new Date("2026-04-10T10:00:00.000Z"),
      trangThai: TrangThaiPhiếu.DANG_MUON,
      ghiChu: "Da ban giao tai phong A2-204",
    },
    create: {
      maPhiếu: "PM-002",
      thietBiId: thietBi2.id,
      nguoiMuonId: sinhVien.id,
      mucDich: "Trinh bay bao cao do an mon hoc",
      ngayMuon: new Date("2026-04-07T01:00:00.000Z"),
      ngayTraDuKien: new Date("2026-04-10T10:00:00.000Z"),
      trangThai: TrangThaiPhiếu.DANG_MUON,
      ghiChu: "Da ban giao tai phong A2-204",
    },
  });

  await prisma.phieuMuon.upsert({
    where: { maPhiếu: "PM-003" },
    update: {
      thietBiId: thietBi3.id,
      nguoiMuonId: giangVien.id,
      mucDich: "Muon bo kit de kiem tra module router",
      ngayMuon: new Date("2026-04-01T01:00:00.000Z"),
      ngayTraDuKien: new Date("2026-04-05T10:00:00.000Z"),
      ngayTraThucTe: new Date("2026-04-06T08:30:00.000Z"),
      trangThai: TrangThaiPhiếu.DA_TRA,
      tinhTrangTra: "HONG",
      phiQhanHan: 50000,
      ghiChu: "Tra tre 1 ngay, phat hien loi nguon",
    },
    create: {
      maPhiếu: "PM-003",
      thietBiId: thietBi3.id,
      nguoiMuonId: giangVien.id,
      mucDich: "Muon bo kit de kiem tra module router",
      ngayMuon: new Date("2026-04-01T01:00:00.000Z"),
      ngayTraDuKien: new Date("2026-04-05T10:00:00.000Z"),
      ngayTraThucTe: new Date("2026-04-06T08:30:00.000Z"),
      trangThai: TrangThaiPhiếu.DA_TRA,
      tinhTrangTra: "HONG",
      phiQhanHan: 50000,
      ghiChu: "Tra tre 1 ngay, phat hien loi nguon",
    },
  });

  const baoTri1 = await prisma.baoTri.upsert({
    where: { id: "bt-fixed-001" },
    update: {
      thietBiId: thietBi2.id,
      loaiBaoTri: "DINH_KY",
      moTaVanDe: "Canh bao den bao tri va can chinh lai ong kinh",
      ketQua: "Da ve sinh bo loc va can chinh hinh anh",
      chiPhi: 800000,
      kyThuatVienId: thuKho.id,
      ngayBatDau: new Date("2026-04-08T02:00:00.000Z"),
      ngayHoanThanh: new Date("2026-04-08T07:00:00.000Z"),
    },
    create: {
      id: "bt-fixed-001",
      thietBiId: thietBi2.id,
      loaiBaoTri: "DINH_KY",
      moTaVanDe: "Canh bao den bao tri va can chinh lai ong kinh",
      ketQua: "Da ve sinh bo loc va can chinh hinh anh",
      chiPhi: 800000,
      kyThuatVienId: thuKho.id,
      ngayBatDau: new Date("2026-04-08T02:00:00.000Z"),
      ngayHoanThanh: new Date("2026-04-08T07:00:00.000Z"),
    },
  });

  const baoTri2 = await prisma.baoTri.upsert({
    where: { id: "bt-fixed-002" },
    update: {
      thietBiId: thietBi3.id,
      loaiBaoTri: "SUA_CHUA",
      moTaVanDe: "Hong nguon, khong khoi dong duoc router",
      ketQua: null,
      chiPhi: 2500000,
      kyThuatVienId: thuKho.id,
      ngayBatDau: new Date("2026-04-09T02:00:00.000Z"),
      ngayHoanThanh: null,
    },
    create: {
      id: "bt-fixed-002",
      thietBiId: thietBi3.id,
      loaiBaoTri: "SUA_CHUA",
      moTaVanDe: "Hong nguon, khong khoi dong duoc router",
      ketQua: null,
      chiPhi: 2500000,
      kyThuatVienId: thuKho.id,
      ngayBatDau: new Date("2026-04-09T02:00:00.000Z"),
      ngayHoanThanh: null,
    },
  });

  const dotKiemKe = await prisma.dotKiemKe.upsert({
    where: { id: "kk-fixed-001" },
    update: {
      tenDot: "Kiểm kê Quy II/2026",
      ngayBatDau: new Date("2026-04-01T00:00:00.000Z"),
      trangThai: "DANG_THUC_HIEN",
      nguoiTao: admin.name,
    },
    create: {
      id: "kk-fixed-001",
      tenDot: "Kiểm kê Quy II/2026",
      ngayBatDau: new Date("2026-04-01T00:00:00.000Z"),
      trangThai: "DANG_THUC_HIEN",
      nguoiTao: admin.name,
    },
  });

  const kiemKeItems = [
    { thietBi: thietBi1, trangThaiThucTe: "TOT", daXacNhãn: true, ghiChu: "Dung vi tri kho" },
    { thietBi: thietBi2, trangThaiThucTe: "BAO_TRI", daXacNhãn: true, ghiChu: "Đang bảo trì" },
    { thietBi: thietBi3, trangThaiThucTe: "HONG", daXacNhãn: true, ghiChu: "Cho thay nguon" },
    { thietBi: thietBi4, trangThaiThucTe: null, daXacNhãn: false, ghiChu: null },
  ];

  for (const item of kiemKeItems) {
    await prisma.kiemKeItem.upsert({
      where: {
        dotKiemKeId_thietBiId: {
          dotKiemKeId: dotKiemKe.id,
          thietBiId: item.thietBi.id,
        },
      },
      update: {
        trangThaiThucTe: item.trangThaiThucTe,
        daXacNhãn: item.daXacNhãn,
        ghiChu: item.ghiChu,
        ngayXacNhãn: item.daXacNhãn ? new Date("2026-04-03T09:00:00.000Z") : null,
      },
      create: {
        dotKiemKeId: dotKiemKe.id,
        thietBiId: item.thietBi.id,
        trangThaiThucTe: item.trangThaiThucTe,
        daXacNhãn: item.daXacNhãn,
        ghiChu: item.ghiChu,
        ngayXacNhãn: item.daXacNhãn ? new Date("2026-04-03T09:00:00.000Z") : null,
      },
    });
  }

  await createOrUpdateMovement({
    thietBiId: thietBi1.id,
    tuPhong: phongKhoCNS.tenPhong,
    denPhong: phongLabMang.tenPhong,
    lyDo: "Dieu chuyen phuc vu giang day",
    nguoiThucHien: thuKho.name,
  });

  await createOrUpdateMovement({
    thietBiId: thietBi2.id,
    tuPhong: phongKhoCNS.tenPhong,
    denPhong: phongHocSmart.tenPhong,
    lyDo: "Ban giao cho phong hoc thong minh",
    nguoiThucHien: thuKho.name,
  });

  await createOrUpdateMovement({
    thietBiId: thietBi4.id,
    tuPhong: undefined,
    denPhong: phongLabIoT.tenPhong,
    lyDo: "Nhap moi vao lab IoT",
    nguoiThucHien: admin.name,
  });

  await createOrUpdateAuditLog({
    userId: admin.id,
    action: "SEED",
    entity: "System",
    detail: JSON.stringify({
      note: "Sample seed completed",
      users: 5,
      devices: 4,
      borrowTickets: 3,
      maintenances: 2,
    }),
  });

  await createOrUpdateAuditLog({
    userId: thuKho.id,
    action: "UPDATE",
    entity: "BaoTri",
    entityId: baoTri1.id,
    detail: JSON.stringify({ ketQua: "Da ve sinh va can chinh" }),
  });

  await createOrUpdateAuditLog({
    userId: thuKho.id,
    action: "CREATE",
    entity: "BaoTri",
    entityId: baoTri2.id,
    detail: JSON.stringify({ moTaVanDe: "Hong nguon Cisco Lab" }),
  });

  await createOrUpdateAuditLog({
    userId: truongKhoa.id,
    action: "REVIEW",
    entity: "DotKiemKe",
    entityId: dotKiemKe.id,
    detail: JSON.stringify({ trangThai: "Đang thực hiện", khoa: khoaCNS.maKhoa }),
  });

  console.log("Seed completed successfully");
  console.log("Tài khoản mẫu:");
  console.log("admin@hcmute.edu.vn / Admin@123");
  console.log("truongkhoa.cns@hcmute.edu.vn / TruongKhoa@123");
  console.log("thukho@hcmute.edu.vn / ThuKho@123");
  console.log("giangvien@hcmute.edu.vn / GiangVien@123");
  console.log("sinhvien@hcmute.edu.vn / SinhVien@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
