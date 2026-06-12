# Page Status After Update

This file tracks which pages are still incomplete and which ones have been completed.

## Completed

| Page | Path | Notes |
|---|---|---|
| Forgot password | `app/(auth)/forgot-password/page.tsx` | Replaced the TODO-only form with a working client-side reset request flow and status feedback. |
| Thiết bị | `app/(dashboard)/thiet-bi/page.tsx` | Added summary cards and a stronger dashboard header around the existing management table. |
| Chi tiết thiết bị | `app/(dashboard)/thiet-bi/[id]/page.tsx` | Added summary cards, QR panel, maintenance history, and movement history. |
| Bảo trì | `app/(dashboard)/bao-tri/page.tsx` | Added summary cards and a clearer overview above the management panel. |
| Kiểm kê | `app/(dashboard)/kiem-ke/page.tsx` | Added summary cards and a clearer overview above the management panel. |
| Phiếu nhập | `app/(dashboard)/phieu-nhap/page.tsx` | Replaced the placeholder with a full intake overview, summary cards, and recent receipt table. |
| Phân bổ thiết bị | `app/(dashboard)/phan-bo/page.tsx` | Added a live overview backed by current `ThietBi` and `LichSuDiChuyen` data. |
| Thanh lý | `app/(dashboard)/thanh-ly/page.tsx` | Added a live liquidation overview backed by `ThietBi` and `BaoTri` data. |
| Nhật ký hoạt động | `app/(dashboard)/nhat-ky-hoat-dong/page.tsx` | Added a live audit log page backed by `AuditLog` data. |
| Mượn - trả transition | `app/(dashboard)/muon-tra/page.tsx` | Replaced the redirect with a deprecation page that routes users to the new modules. |
| Thiết bị fallback | `app/(dashboard)/thiet-bi/error.tsx` | Kept as a usable error boundary for database failures. |

## Still Incomplete

| Page / Mởdule | Path | Notes |
|---|---|---|
| User management | No dedicated page yet | The current app still uses the old `User` model and does not yet expose a page for `NguoiDung`. |
| New auth flow | No dedicated page yet | If the project moves fully to the new schema, auth still needs a proper rewrite. |

## Next Priority

1. Finalize the auth strategy.
2. Add a dedicated user management page when the new user model is ready.
3. Continue the schema migration for any backend routes that still rely on the old Prisma models.

