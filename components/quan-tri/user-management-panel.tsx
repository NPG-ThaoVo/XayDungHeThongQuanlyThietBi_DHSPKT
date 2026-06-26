"use client";

import { useState, useTransition } from "react";
import { Plus, X, Edit2, KeyRound, ToggleLeft, ToggleRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createUser,
  updateUserRole,
  toggleUserStatus,
  resetUserPassword,
} from "@/app/actions/user.actions";

type Khoa = { id: string; tenKhoa: string; maKhoa: string };
type UserItem = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  maSoNV: string | null;
  phone: string | null;
  khoaId: string | null;
  khoa: { tenKhoa: string } | null;
  createdAt: string;
};

type Props = {
  initialUsers: UserItem[];
  khoaList: Khoa[];
};

const ROLES = ["ADMIN", "TRUONG_KHOA", "GIANG_VIEN", "THU_KHO", "SINH_VIEN"] as const;
const roleLabels: Record<string, string> = {
  ADMIN: "Quản trị viên",
  TRUONG_KHOA: "Trưởng khoa",
  GIANG_VIEN: "Giảng viên",
  THU_KHO: "Thủ kho",
  SINH_VIEN: "Sinh viên",
};

type CreateForm = {
  name: string;
  email: string;
  password: string;
  role: string;
  khoaId: string;
  maSoNV: string;
};

const emptyForm: CreateForm = { name: "", email: "", password: "", role: "SINH_VIEN", khoaId: "", maSoNV: "" };

export function UserManagementPanel({ initialUsers, khoaList }: Props) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [passwordTarget, setPasswordTarget] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function f(field: keyof CreateForm, val: string) {
    setForm((prev) => ({ ...prev, [field]: val }));
  }

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      try {
        await createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          khoaId: form.khoaId || undefined,
          maSoNV: form.maSoNV || undefined,
        });
        setSuccess("Tạo tài khoản thành công!");
        setShowCreateForm(false);
        setForm(emptyForm);
        // Optimistic: refresh page data
        window.location.reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi tạo tài khoản");
      }
    });
  }

  function handleRoleChange(userId: string, role: string) {
    startTransition(async () => {
      try {
        await updateUserRole(userId, role);
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi cập nhật vai trò");
      }
    });
  }

  function handleToggleStatus(userId: string) {
    startTransition(async () => {
      try {
        await toggleUserStatus(userId);
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi cập nhật trạng thái");
      }
    });
  }

  function handleResetPassword(userId: string) {
    if (!newPasswordInput || newPasswordInput.length < 8) {
      setError("Mật khẩu mới phải ít nhất 8 ký tự");
      return;
    }
    startTransition(async () => {
      try {
        await resetUserPassword(userId, newPasswordInput);
        setSuccess("Đã đặt lại mật khẩu thành công");
        setPasswordTarget(null);
        setNewPasswordInput("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi đặt lại mật khẩu");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          {error ? <p className="text-sm text-rose-600 font-medium">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600 font-medium">{success}</p> : null}
        </div>
        <Button onClick={() => { setShowCreateForm(true); setError(null); setSuccess(null); }}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo tài khoản mới
        </Button>
      </div>

      {showCreateForm && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Tạo tài khoản mới</h3>
            <button type="button" onClick={() => { setShowCreateForm(false); setForm(emptyForm); }}>
              <X className="h-5 w-5 text-slate-500" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Họ và tên *</label>
              <Input value={form.name} onChange={(e) => f("name", e.target.value)} placeholder="Nguyễn Văn A" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Email *</label>
              <Input type="email" value={form.email} onChange={(e) => f("email", e.target.value)} placeholder="email@dhspkt.edu.vn" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Mật khẩu *</label>
              <Input type="password" value={form.password} onChange={(e) => f("password", e.target.value)} placeholder="Tối thiểu 8 ký tự" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Mã số NV/SV</label>
              <Input value={form.maSoNV} onChange={(e) => f("maSoNV", e.target.value)} placeholder="22110001" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Vai trò *</label>
              <select value={form.role} onChange={(e) => f("role", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                {ROLES.map((r) => (
                  <option key={r} value={r}>{roleLabels[r]}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Khoa</label>
              <select value={form.khoaId} onChange={(e) => f("khoaId", e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
                <option value="">-- Không có --</option>
                {khoaList.map((k) => (
                  <option key={k.id} value={k.id}>{k.tenKhoa} ({k.maKhoa})</option>
                ))}
              </select>
            </div>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => { setShowCreateForm(false); setForm(emptyForm); }}>Hủy</Button>
            <Button onClick={handleCreate} disabled={isPending}>
              {isPending ? "Đang tạo..." : "Tạo tài khoản"}
            </Button>
          </div>
        </div>
      )}

      {passwordTarget && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-amber-800">Đặt lại mật khẩu</p>
            <button type="button" onClick={() => { setPasswordTarget(null); setNewPasswordInput(""); }}>
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <div className="flex gap-3">
            <Input type="password" value={newPasswordInput} onChange={(e) => setNewPasswordInput(e.target.value)} placeholder="Mật khẩu mới (tối thiểu 8 ký tự)" className="flex-1" />
            <Button onClick={() => handleResetPassword(passwordTarget)} disabled={isPending}>
              {isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        </div>
      )}

      {editingUser && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-teal-800">Chỉnh sửa: {editingUser.name}</p>
            <button type="button" onClick={() => setEditingUser(null)}>
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Vai trò</label>
              <select
                value={editingUser.role}
                onChange={(e) => {
                  const newRole = e.target.value;
                  setEditingUser((u) => u ? { ...u, role: newRole } : u);
                  handleRoleChange(editingUser.id, newRole);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{roleLabels[r]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-auto rounded-2xl border border-slate-100">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-500">
              <th className="px-4 py-3 font-medium">Tên</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Vai trò</th>
              <th className="px-4 py-3 font-medium">Khoa</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400 text-sm">
                  Chưa có tài khoản nào.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {user.name}
                    {user.maSoNV ? <span className="ml-2 text-xs text-slate-400">({user.maSoNV})</span> : null}
                  </td>
                  <td className="px-4 py-3 text-slate-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
                      {roleLabels[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{user.khoa?.tenKhoa ?? "--"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${user.isActive
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                        }`}
                    >
                      {user.isActive ? "Hoạt động" : "Vô hiệu"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        title="Chỉnh sửa"
                        onClick={() => setEditingUser(editingUser?.id === user.id ? null : user)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Đặt lại mật khẩu"
                        onClick={() => { setPasswordTarget(user.id); setNewPasswordInput(""); }}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title={user.isActive ? "Vô hiệu hoá" : "Kích hoạt"}
                        onClick={() => handleToggleStatus(user.id)}
                        disabled={isPending}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                      >
                        {user.isActive ? (
                          <ToggleRight className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
