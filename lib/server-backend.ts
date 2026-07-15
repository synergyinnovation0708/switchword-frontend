import "server-only";

import { headers } from "next/headers";
import { buildInit, parseApiResponse } from "./backend";

function normalizeApiBaseUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    url.pathname = url.pathname.replace(/\/+$/, "");

    if (!url.pathname.endsWith("/api/v1")) {
      url.pathname = `${url.pathname}/api/v1`;
    }

    return url.toString().replace(/\/+$/, "");
  } catch {
    return rawUrl.replace(/\/+$/, "") + "/api/v1";
  }
}

function buildApiUrl(baseUrl: string, path: string) {
  const normalizedBase = `${baseUrl.replace(/\/+$/, "")}/`;
  const normalizedPath = path.replace(/^\/+/, "");
  return `${normalizedBase}${normalizedPath}`;
}

const serverApiBaseUrl = normalizeApiBaseUrl(
  process.env.BACKEND_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1",
);

type BackendRequestOptions = RequestInit & {
  bodyJson?: unknown;
};

export async function serverApiRequest<T>(path: string, options?: BackendRequestOptions) {
  const incomingHeaders = await headers();
  const cookieHeader = incomingHeaders.get("cookie");
  const requestHeaders = new Headers(options?.headers);

  if (cookieHeader) {
    requestHeaders.set("cookie", cookieHeader);
  }

  const response = await fetch(buildApiUrl(serverApiBaseUrl, path), {
    ...buildInit(options),
    headers: requestHeaders,
  });

  return parseApiResponse<T>(response);
}
