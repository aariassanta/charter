// lib/api.ts — Cliente API para charter-worker

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL ?? "http://localhost:8765";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("charter_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${WORKER_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("charter_token");
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail ?? `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Tipos ─────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Extraction {
  id: number;
  filename: string;
  status: "pending" | "processing" | "done" | "error";
  confidence?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
  // documents solo existe cuando status === "done"
  documents?: {
    charter?: string;
    dossier?: string;
    kickoff?: string;
  };
}

export interface LoginRequest { email: string; password: string }
export interface LoginResponse { access_token: string; token_type: "bearer" }

// ─── Auth ──────────────────────────────────────────────────────────────────

export const api = {
  login: (data: LoginRequest) =>
    request<LoginResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => request<User>("/api/me"),

  // ─── Extractions ───────────────────────────────────────────────────────

  listExtractions: () => request<{ extractions: Extraction[] }>("/api/extractions"),

  getExtraction: (id: number) => request<Extraction>(`/api/extractions/${id}`),

  createExtraction: (formData: FormData) =>
    fetch(`${WORKER_URL}/api/extractions/create`, {
      method: "POST",
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }),

  improveExtraction: (id: number, instructions: string) =>
    request<Extraction>(`/api/extractions/${id}/improve`, {
      method: "POST",
      body: JSON.stringify({ instructions }),
    }),

  // ─── Documentos ─────────────────────────────────────────────────────────

  getDocuments: (id: number) =>
    request<{
      charter?: string;
      dossier?: string;
      kickoff?: string;
    }>(`/api/extractions/${id}/documents`),

  downloadDocument: (id: number, docType: "charter" | "dossier" | "kickoff", format: "md" | "pdf" | "json") => {
    const token = getToken();
    const url = `${WORKER_URL}/api/extractions/${id}/documents?type=${docType}&format=${format}`;
    return fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  },
};
