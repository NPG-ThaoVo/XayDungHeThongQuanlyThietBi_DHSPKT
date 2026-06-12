"use client";

import { useEffect, useState } from "react";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Eye, Pencil, QrCode, X } from "lucide-react";
import Image from "next/image";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

type DeviceRow = {
  id: string;
  maThietBi: string;
  tenThietBi: string;
  danhMuc: { tenDM: string };
  trangThai: string;
  phong?: { tenPhong?: string } | null;
};

export function DeviceTable({
  data,
  onView,
  onEdit,
}: {
  data: DeviceRow[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const canCopyLink = typeof navigator !== "undefined" && !!navigator.clipboard;

  const [qrTarget, setQrTarget] = useState<DeviceRow | null>(null);
  const [qrLink, setQrLink] = useState<string>("");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!qrTarget) {
      return;
    }

    const controller = new AbortController();

    setIsGeneratingQr(true);
    setQrError(null);
    setQrLink("");
    setQrDataUrl(null);
    setCopied(false);

    fetch(`/api/thiet-bi/${qrTarget.id}/qr`, { signal: controller.signal })
      .then(async (response) => {
        const payload = (await response.json()) as {
          link?: string;
          qrCodeUrl?: string;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error ?? "Không thể lay QR code");
        }

        setQrLink(payload.link ?? "");
        setQrDataUrl(payload.qrCodeUrl ?? null);
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }

        setQrError(error instanceof Error ? error.message : "Không thể lay QR code");
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsGeneratingQr(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [qrTarget]);

  useEffect(() => {
    if (!qrTarget) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setQrTarget(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [qrTarget]);

  async function handleCopyQrLink() {
    if (!qrLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(qrLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  function handleDownloadQr() {
    if (!qrDataUrl || !qrTarget) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = qrDataUrl;
    anchor.download = `qr-${qrTarget.maThietBi}.png`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function handleOpenQrLink() {
    if (!qrLink) {
      return;
    }

    window.open(qrLink, "_blank", "noopener,noreferrer");
  }

  const columns: ColumnDef<DeviceRow>[] = [
    { accessorKey: "maThietBi", header: "Mã thiết bị" },
    { accessorKey: "tenThietBi", header: "Tên thiết bị" },
    {
      accessorFn: (row) => row.danhMuc.tenDM,
      id: "danhMuc",
      header: "Danh mục",
    },
    {
      accessorKey: "trangThai",
      header: "Trạng thái",
      cell: ({ row }) => <StatusBadge status={row.original.trangThai} />,
    },
    {
      accessorFn: (row) => row.phong?.tenPhong ?? "--",
      id: "phong",
      header: "Vị trí",
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => onView(row.original.id)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(row.original.id)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setQrTarget(row.original)}>
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left font-medium text-slate-500">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100 transition-colors hover:bg-slate-50/80">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-slate-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {qrTarget ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={() => setQrTarget(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md scale-100 rounded-2xl bg-white p-6 shadow-2xl transition-transform duration-200"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">QR THIET BI</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{qrTarget.tenThietBi}</h3>
                <p className="mt-1 text-sm text-slate-500">{qrTarget.maThietBi}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setQrTarget(null)} aria-label="Dòng">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5 flex items-center justify-center rounded-[26px] bg-slate-50 p-5">
              {isGeneratingQr ? (
                <p className="text-sm text-slate-500">Đang tạo mã QR...</p>
              ) : qrDataUrl ? (
                <Image
                  src={qrDataUrl}
                  alt={`QR Code ${qrTarget.maThietBi}`}
                  width={208}
                  height={208}
                  unoptimized
                  className="h-52 w-52 rounded-2xl bg-white p-2 shadow-sm"
                />
              ) : (
                <p className="text-sm text-rose-600">{qrError ?? "Không có dữ liệu QR"}</p>
              )}
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
                <p className="break-all">{qrLink}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyQrLink}
                  disabled={!qrLink || !canCopyLink}
                >
                  Sao chép liên kết
                </Button>
                <Button variant="secondary" size="sm" onClick={handleOpenQrLink} disabled={!qrLink}>
                  Mo
                </Button>
                <Button variant="secondary" size="sm" onClick={handleDownloadQr} disabled={!qrDataUrl}>
                  Tải QR
                </Button>
              </div>
              {copied ? <p className="text-xs text-emerald-600">Đã sao chép liên kết.</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
