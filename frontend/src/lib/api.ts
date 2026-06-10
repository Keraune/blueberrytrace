import type {
  ApiResponse,
  AuthenticatedUserResponse,
  CamaResponse,
  CsrfResponse,
  DashboardApiResponse,
  FrontendBootstrapResponse,
  ListResponse,
  LoteResponse
} from '../types/api';

const apiBase = (import.meta.env.VITE_BLUEBERRYTRACE_API_BASE || '/api/v1').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly payload?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function buildUrl(path: string, params?: Record<string, string | number | undefined | null>) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = apiBase.startsWith('http') ? apiBase : window.location.origin + apiBase;
  const url = new URL(`${base}${cleanPath}`);

  Object.entries(params || {})
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .forEach(([key, value]) => url.searchParams.set(key, String(value)));

  return url.toString();
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'BlueberryTraceReact',
      ...(init?.headers || {})
    },
    ...init
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'object' && payload && 'message' in payload
      ? String((payload as { message?: string }).message)
      : response.status === 401
        ? 'Tu sesión no está activa. Inicia sesión para continuar.'
        : `Error HTTP ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

async function getData<T>(path: string): Promise<T> {
  const payload = await request<ApiResponse<T>>(path);
  return payload.data;
}

export const blueberryApi = {
  csrf: () => getData<CsrfResponse>('/auth/csrf'),
  bootstrap: () => getData<FrontendBootstrapResponse>('/frontend/bootstrap'),
  session: () => getData<AuthenticatedUserResponse>('/session/me'),
  dashboard: () => getData<DashboardApiResponse>('/dashboard/summary'),
  lotes: () => getData<ListResponse<LoteResponse>>('/lotes'),
  camas: () => getData<ListResponse<CamaResponse>>('/camas')
};
