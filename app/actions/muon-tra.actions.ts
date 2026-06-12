"use server";

import { revalidatePath } from "next/cache";

const BORROW_PAGE_PATH = "/dashboard/muon-tra";

function createDeprecatedError() {
  return new Error(
    "Quy trình muon-tra da duoc de tinh trong schema moi. Hay su dung phieu-nhap, phan-bo va thanh-ly.",
  );
}

export async function taoPhiếuMuon() {
  revalidatePath(BORROW_PAGE_PATH);
  throw createDeprecatedError();
}

export async function duyetPhiếuMuon() {
  revalidatePath(BORROW_PAGE_PATH);
  throw createDeprecatedError();
}

export async function traThietBi() {
  revalidatePath(BORROW_PAGE_PATH);
  throw createDeprecatedError();
}
