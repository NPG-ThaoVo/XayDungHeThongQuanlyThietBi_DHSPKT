function createDeprecatedError() {
  return new Error(
    "Quy trình muon-tra da duoc de tinh trong schema moi. Hay su dung phieu-nhap, phan-bo va thanh-ly.",
  );
}

export async function getBorrowDashboardData() {
  throw createDeprecatedError();
}

export async function listBorrowRequests() {
  throw createDeprecatedError();
}

export async function createBorrowRequest() {
  throw createDeprecatedError();
}

export async function approveBorrowRequest() {
  throw createDeprecatedError();
}

export async function returnBorrowDevice() {
  throw createDeprecatedError();
}
