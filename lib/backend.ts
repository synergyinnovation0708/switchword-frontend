import type { ApiEnvelope } from "./types";

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

const publicApiBaseUrl = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1",
);

type BackendRequestOptions = RequestInit & {
  bodyJson?: unknown;
};

export class BackendError extends Error {
  code: string;
  status: number;
  fields?: Record<string, string>;

  constructor(
    message: string,
    {
      code,
      status,
      fields,
    }: {
      code: string;
      status: number;
      fields?: Record<string, string>;
    },
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.fields = fields;
  }
}

async function parseApiResponse<T>(response: Response) {
  const rawBody = await response.text();

  if (!rawBody) {
    throw new BackendError("The server returned an empty response.", {
      code: "EMPTY_RESPONSE",
      status: response.status,
    });
  }

  let payload: ApiEnvelope<T> | { data?: T; error?: { code?: string; message?: string; fields?: Record<string, string> } };

  try {
    payload = JSON.parse(rawBody) as ApiEnvelope<T>;
  } catch {
    throw new BackendError("The server returned an invalid response.", {
      code: "INVALID_RESPONSE",
      status: response.status,
    });
  }

  if (!payload || typeof payload !== "object") {
    throw new BackendError("The server returned an unexpected response.", {
      code: "INVALID_RESPONSE",
      status: response.status,
    });
  }

  if ("error" in payload) {
    throw new BackendError(payload.error?.message ?? "The request failed.", {
      code: payload.error?.code ?? "REQUEST_FAILED",
      status: response.status,
      fields: payload.error?.fields,
    });
  }

  if (!("data" in payload)) {
    throw new BackendError("The server returned an unexpected response.", {
      code: "INVALID_RESPONSE",
      status: response.status,
    });
  }

  const data = (payload as { data: T }).data;

  if (data === undefined) {
    throw new BackendError("The server returned an unexpected response.", {
      code: "INVALID_RESPONSE",
      status: response.status,
    });
  }

  return data;
}

function buildInit(options: BackendRequestOptions = {}): RequestInit {
  const headers = new Headers(options.headers);

  if (options.bodyJson !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  return {
    ...options,
    headers,
    body: options.bodyJson !== undefined ? JSON.stringify(options.bodyJson) : options.body,
    credentials: "include",
    cache: "no-store",
  };
}

export async function browserApiRequest<T>(path: string, options?: BackendRequestOptions) {
  const response = await fetch(buildApiUrl(publicApiBaseUrl, path), buildInit(options));
  return parseApiResponse<T>(response);
}

export { buildInit, parseApiResponse };
