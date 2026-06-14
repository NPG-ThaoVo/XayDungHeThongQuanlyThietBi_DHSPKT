import { headers } from "next/headers";

export async function getAppOrigin() {
  const headerList = await headers();
  const forwardedHost = headerList.get("x-forwarded-host");
  const host = forwardedHost ?? headerList.get("host");
  const forwardedProto = headerList.get("x-forwarded-proto");
  const protocol = forwardedProto ?? "https";

  if (host) {
    return `${protocol}://${host}`;
  }

  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/$/, "");
  }

  return "";
}
