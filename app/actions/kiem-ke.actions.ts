"use server";

function createDeprecatedError() {
  return new Error(
    "Dòng actions kiem-ke cu da duoc de tinh. Hay tiep tuc migrate sang MucKiemKe va backend moi.",
  );
}

export async function taoDotKiemKe() {
  throw createDeprecatedError();
}

export async function xacNhãnKiemKe() {
  throw createDeprecatedError();
}
