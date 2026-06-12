"use server";

function createDeprecatedError() {
  return new Error(
    "Quản lý nguoi dung chua duoc chuyen sang schema moi. Hay hoan tat auth/nguoi-dung truoc khi mo lai chuc nang nay.",
  );
}

export async function createUser() {
  throw createDeprecatedError();
}

export async function updateUserRole() {
  throw createDeprecatedError();
}

export async function toggleUserStatus() {
  throw createDeprecatedError();
}
