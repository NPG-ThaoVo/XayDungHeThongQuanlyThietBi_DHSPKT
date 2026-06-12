export const dashboardStats = [
  { label: "Tong thiet bi", value: "1,248", note: "+42 trong thang" },
  { label: "Đang mượn", value: "87", note: "12 phiếu chờ duyệt" },
  { label: "Bảo trì", value: "23", note: "5 can xu ly gap" },
  { label: "Qua han", value: "9", note: "Can nhac han ngay" },
];

export const devices = [
  {
    id: "tb-1",
    maThietBi: "TB-0001",
    tenThietBi: "Laptop Dell Latitude 5440",
    danhMuc: { tenDM: "Laptop" },
    trangThai: "TOT",
    phong: { tenPhong: "Kho Thiet Bi" },
    khoa: { tenKhoa: "Khoa Cong nghe so" },
    serialNumber: "DL5440-001",
    namNhap: 2025,
    giaTriBanDau: 25000000,
    moTa: "Phuc vu giang day va muon ngan han",
  },
  {
    id: "tb-2",
    maThietBi: "TB-0002",
    tenThietBi: "May chieu Epson EB-X51",
    danhMuc: { tenDM: "May chieu" },
    trangThai: "BAO_TRI",
    phong: { tenPhong: "Phong A2-204" },
    khoa: { tenKhoa: "Khoa Cong nghe so" },
    serialNumber: "EPSON-9988",
    namNhap: 2024,
    giaTriBanDau: 13900000,
    moTa: "Canh bao den bao tri dinh ky",
  },
  {
    id: "tb-3",
    maThietBi: "TB-0003",
    tenThietBi: "Bo kit Cisco Lab",
    danhMuc: { tenDM: "Networking" },
    trangThai: "HONG",
    phong: { tenPhong: "TN-101" },
    khoa: { tenKhoa: "Khoa Cong nghe so" },
    serialNumber: "CISCO-LAB-01",
    namNhap: 2023,
    giaTriBanDau: 32000000,
    moTa: "Can thay module nguon",
  },
];

export const borrowRequests = [
  {
    id: "pm-1",
    maPhiếu: "PM-001",
    nguoiMuon: "Nguyen Van A",
    thietBi: "Laptop Dell Latitude 5440",
    ngayMuon: "2026-04-09",
    ngayTraDuKien: "2026-04-12",
    trangThai: "CHO_DUYET",
  },
  {
    id: "pm-2",
    maPhiếu: "PM-002",
    nguoiMuon: "Tran Thi B",
    thietBi: "May chieu Epson EB-X51",
    ngayMuon: "2026-04-08",
    ngayTraDuKien: "2026-04-10",
    trangThai: "DANG_MUON",
  },
];

export const inventoryRounds = [
  {
    id: "kk-1",
    tenDot: "Kiểm kê Quy II/2026",
    trangThai: "DANG_THUC_HIEN",
    daXacNhãn: 812,
    tong: 1248,
  },
];

export const reports = [
  { title: "Theo khoa", value: "12 khoa dang su dung thiet bi" },
  { title: "Theo trang thai", value: "93.4% thiet bi hoat dong tot" },
  { title: "Chi phi bao tri", value: "48.500.000 VND / quy" },
];
