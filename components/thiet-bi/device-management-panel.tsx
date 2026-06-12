"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { DeviceTable } from "@/components/thiet-bi/device-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { thietBiSchema } from "@/lib/validations/thiet-bi";

type Option = {
  id: string;
  label: string;
};

type FormValues = {
  maThietBi: string;
  tenThietBi: string;
  moTa: string;
  thongSoKyThuat: string;
  serialNumber: string;
  namNhap: number;
  giaTriBanDau: number;
  baoHanhDen: string;
  danhMucId: string;
  nhaCungCapId: string;
  khoaId: string;
  phongId: string;
};

type DeviceItem = {
  id: string;
  maThietBi: string;
  tenThietBi: string;
  moTa: string | null;
  thongSoKyThuat: string | null;
  serialNumber: string | null;
  namNhap: number;
  giaTriBanDau: number;
  baoHanhDen: string | null;
  trangThai: string;
  danhMucId: string;
  nhaCungCapId: string | null;
  khoaId: string | null;
  phongId: string | null;
  danhMuc: { tenDM: string };
  phong: { tenPhong: string } | null;
};

const emptyForm: FormValues = {
  maThietBi: "",
  tenThietBi: "",
  moTa: "",
  thongSoKyThuat: "",
  serialNumber: "",
  namNhap: new Date().getFullYear(),
  giaTriBanDau: 0,
  baoHanhDen: "",
  danhMucId: "",
  nhaCungCapId: "",
  khoaId: "",
  phongId: "",
};

function toInputDate(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function toFormValues(device: DeviceItem): FormValues {
  return {
    maThietBi: device.maThietBi,
    tenThietBi: device.tenThietBi,
    moTa: device.moTa ?? "",
    thongSoKyThuat: device.thongSoKyThuat ?? "",
    serialNumber: device.serialNumber ?? "",
    namNhap: device.namNhap,
    giaTriBanDau: device.giaTriBanDau,
    baoHanhDen: toInputDate(device.baoHanhDen),
    danhMucId: device.danhMucId,
    nhaCungCapId: device.nhaCungCapId ?? "",
    khoaId: device.khoaId ?? "",
    phongId: device.phongId ?? "",
  };
}

export function DeviceManagementPanel({
  devices,
  danhMucs,
  phongs,
  khoas,
  nhaCungCaps,
}: {
  devices: DeviceItem[];
  danhMucs: Option[];
  phongs: Option[];
  khoas: Option[];
  nhaCungCaps: Option[];
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<FormValues>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const selectedDevice = useMemo(
    () => devices.find((device) => device.id === selectedId) ?? null,
    [devices, selectedId],
  );

  const heading = selectedDevice ? "Cập nhật thiet bi" : "Them thiet bi moi";
  const submitLabel = selectedDevice ? "Luu thay doi" : "Them thiet bi";

  function handleEdit(id: string) {
    const device = devices.find((item) => item.id === id);

    if (!device) {
      return;
    }

    setSelectedId(id);
    setFormValues(toFormValues(device));
    setError(null);
    setSuccess(null);
  }

  function handleCreateNew() {
    setSelectedId(null);
    setFormValues(emptyForm);
    setError(null);
    setSuccess(null);
  }

  function updateField<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setFormValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const parsed = thietBiSchema.parse({
        ...formValues,
        serialNumber: formValues.serialNumber || undefined,
        moTa: formValues.moTa || undefined,
        thongSoKyThuat: formValues.thongSoKyThuat || undefined,
        baoHanhDen: formValues.baoHanhDen
          ? new Date(formValues.baoHanhDen).toISOString()
          : "",
        nhaCungCapId: formValues.nhaCungCapId || undefined,
        khoaId: formValues.khoaId || undefined,
        phongId: formValues.phongId || undefined,
      });

      const response = await fetch(
        selectedDevice ? `/api/thiet-bi/${selectedDevice.id}` : "/api/thiet-bi",
        {
          method: selectedDevice ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsed),
        },
      );

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Không thể luu thiet bi");
      }

      setSuccess(selectedDevice ? "Đã cập nhật thiết bị." : "Đã thêm thiết bị mới.");
      if (!selectedDevice) {
        setFormValues(emptyForm);
      }
      setSelectedId(null);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Lỗi không xác định");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="grid gap-6 ">
      <div className="space-y-4">
        <DeviceTable
          data={devices}
          onView={(id) => router.push(`/dashboard/thiet-bi/${id}`)}
          onEdit={handleEdit}
        />
      </div>
      <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">{heading}</h3>
            <p className="mt-2 text-sm text-slate-500">
              Tạo mới hoac chinh sua thiet bi truc tiep tu module quan ly.
            </p>
          </div>
          {selectedDevice ? (
            <Button variant="secondary" onClick={handleCreateNew}>
              Tạo mới
            </Button>
          ) : null}
        </div>

        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Mã thiết bị</label>
            <Input
              value={formValues.maThietBi}
              onChange={(event) => updateField("maThietBi", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tên thiết bị</label>
            <Input
              value={formValues.tenThietBi}
              onChange={(event) => updateField("tenThietBi", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Số serial</label>
            <Input
              value={formValues.serialNumber}
              onChange={(event) => updateField("serialNumber", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Bảo hành đến</label>
            <Input
              type="date"
              value={formValues.baoHanhDen}
              onChange={(event) => updateField("baoHanhDen", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Năm nhập</label>
            <Input
              type="number"
              value={formValues.namNhap}
              onChange={(event) => updateField("namNhap", Number(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Giá trị ban dau</label>
            <Input
              type="number"
              value={formValues.giaTriBanDau}
              onChange={(event) => updateField("giaTriBanDau", Number(event.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Danh mục</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.danhMucId}
              onChange={(event) => updateField("danhMucId", event.target.value)}
            >
              <option value="">Chọn danh muc</option>
              {danhMucs.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phòng</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.phongId}
              onChange={(event) => updateField("phongId", event.target.value)}
            >
              <option value="">Chọn phong</option>
              {phongs.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Khoa</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.khoaId}
              onChange={(event) => updateField("khoaId", event.target.value)}
            >
              <option value="">Chọn khoa</option>
              {khoas.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Nhà cung cấp</label>
            <select
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.nhaCungCapId}
              onChange={(event) => updateField("nhaCungCapId", event.target.value)}
            >
              <option value="">Chọn nha cung cap</option>
              {nhaCungCaps.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Mở ta</label>
            <textarea
              className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.moTa}
              onChange={(event) => updateField("moTa", event.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-slate-700">Thông số kỹ thuật</label>
            <textarea
              className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition-all duration-200 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 focus:shadow-sm"
              value={formValues.thongSoKyThuat}
              onChange={(event) => updateField("thongSoKyThuat", event.target.value)}
            />
          </div>
          {error ? <p className="md:col-span-2 text-sm text-rose-600">{error}</p> : null}
          {success ? <p className="md:col-span-2 text-sm text-emerald-600">{success}</p> : null}
          <div className="md:col-span-2">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Đang lưu..." : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
