import type {
  ApiResponse,
  AuthenticatedUserResponse,
  CamaFormPayload,
  CamaResponse,
  CatalogResponse,
  ClasificacionFormPayload,
  ClasificacionResponse,
  CsrfResponse,
  DashboardApiResponse,
  DespachoFormPayload,
  DespachoResponse,
  FormalizacionFormPayload,
  FrontendBootstrapResponse,
  ListResponse,
  LoginPayload,
  LoteFormPayload,
  PasswordChangePayload,
  ProfileUpdatePayload,
  LoteResponse,
  ProcesoOperativoResponse,
  SiembraFormPayload,
  SiembraResponse,
  TrazabilidadResponse,
  UniformizacionFormPayload,
  UserFormPayload,
  UserReferenceResponse
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
    ...init,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'BlueberryTraceReact',
      ...(init?.headers || {})
    }
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

async function mutateData<T>(path: string, method: string, body?: unknown): Promise<T> {
  const csrfPayload = await request<ApiResponse<CsrfResponse>>('/auth/csrf');
  const csrf = csrfPayload.data;
  const payload = await request<ApiResponse<T>>(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      [csrf.headerName]: csrf.token
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  return payload.data;
}

export const blueberryApi = {
  csrf: () => getData<CsrfResponse>('/auth/csrf'),
  login: (payload: LoginPayload) => mutateData<AuthenticatedUserResponse>('/auth/login', 'POST', payload),
  logout: () => mutateData<void>('/auth/logout', 'POST'),
  bootstrap: () => getData<FrontendBootstrapResponse>('/frontend/bootstrap'),
  session: () => getData<AuthenticatedUserResponse>('/session/me'),
  updateProfile: (payload: ProfileUpdatePayload) => mutateData<AuthenticatedUserResponse>('/session/me', 'PUT', payload),
  changePassword: (payload: PasswordChangePayload) => mutateData<void>('/session/me/password', 'PATCH', payload),
  dashboard: () => getData<DashboardApiResponse>('/dashboard/summary'),
  catalogs: () => getData<CatalogResponse>('/catalogs/operations'),
  lotes: () => getData<ListResponse<LoteResponse>>('/lotes'),
  createLote: (payload: LoteFormPayload) => mutateData<ListResponse<LoteResponse>>('/lotes', 'POST', payload),
  updateLote: (id: number, payload: LoteFormPayload) => mutateData<ListResponse<LoteResponse>>(`/lotes/${id}`, 'PUT', payload),
  toggleLoteStatus: (id: number) => mutateData<ListResponse<LoteResponse>>(`/lotes/${id}/estado`, 'PATCH'),
  deleteLote: (id: number) => mutateData<ListResponse<LoteResponse>>(`/lotes/${id}`, 'DELETE'),
  camas: () => getData<ListResponse<CamaResponse>>('/camas'),
  createCama: (payload: CamaFormPayload) => mutateData<ListResponse<CamaResponse>>('/camas', 'POST', payload),
  updateCama: (id: number, payload: CamaFormPayload) => mutateData<ListResponse<CamaResponse>>(`/camas/${id}`, 'PUT', payload),
  toggleCamaStatus: (id: number) => mutateData<ListResponse<CamaResponse>>(`/camas/${id}/estado`, 'PATCH'),
  siembras: () => getData<ListResponse<SiembraResponse>>('/siembras'),
  createSiembra: (payload: SiembraFormPayload) => mutateData<ListResponse<SiembraResponse>>('/siembras', 'POST', payload),
  updateSiembra: (id: number, payload: SiembraFormPayload) => mutateData<ListResponse<SiembraResponse>>(`/siembras/${id}`, 'PUT', payload),
  toggleSiembraStatus: (id: number) => mutateData<ListResponse<SiembraResponse>>(`/siembras/${id}/estado`, 'PATCH'),
  procesos: () => getData<ProcesoOperativoResponse>('/procesos'),
  createUniformizacion: (payload: UniformizacionFormPayload) => mutateData<ProcesoOperativoResponse>('/procesos/uniformizaciones', 'POST', payload),
  updateUniformizacion: (id: number, payload: UniformizacionFormPayload) => mutateData<ProcesoOperativoResponse>(`/procesos/uniformizaciones/${id}`, 'PUT', payload),
  toggleUniformizacionStatus: (id: number) => mutateData<ProcesoOperativoResponse>(`/procesos/uniformizaciones/${id}/estado`, 'PATCH'),
  createFormalizacion: (payload: FormalizacionFormPayload) => mutateData<ProcesoOperativoResponse>('/procesos/formalizaciones', 'POST', payload),
  updateFormalizacion: (id: number, payload: FormalizacionFormPayload) => mutateData<ProcesoOperativoResponse>(`/procesos/formalizaciones/${id}`, 'PUT', payload),
  toggleFormalizacionStatus: (id: number) => mutateData<ProcesoOperativoResponse>(`/procesos/formalizaciones/${id}/estado`, 'PATCH'),
  clasificaciones: () => getData<ListResponse<ClasificacionResponse>>('/clasificaciones'),
  createClasificacion: (payload: ClasificacionFormPayload) => mutateData<ListResponse<ClasificacionResponse>>('/clasificaciones', 'POST', payload),
  updateClasificacion: (id: number, payload: ClasificacionFormPayload) => mutateData<ListResponse<ClasificacionResponse>>(`/clasificaciones/${id}`, 'PUT', payload),
  changeClasificacionStatus: (id: number, estado: string) => mutateData<ListResponse<ClasificacionResponse>>(`/clasificaciones/${id}/estado?estado=${encodeURIComponent(estado)}`, 'PATCH'),
  despachos: () => getData<ListResponse<DespachoResponse>>('/despachos'),
  createDespacho: (payload: DespachoFormPayload) => mutateData<ListResponse<DespachoResponse>>('/despachos', 'POST', payload),
  updateDespacho: (id: number, payload: DespachoFormPayload) => mutateData<ListResponse<DespachoResponse>>(`/despachos/${id}`, 'PUT', payload),
  changeDespachoStatus: (id: number, estado: string) => mutateData<ListResponse<DespachoResponse>>(`/despachos/${id}/estado?estado=${encodeURIComponent(estado)}`, 'PATCH'),
  trazabilidad: () => getData<ListResponse<TrazabilidadResponse>>('/reportes/trazabilidad'),
  usuarios: () => getData<ListResponse<UserReferenceResponse>>('/usuarios'),
  roles: () => getData<string[]>('/roles'),
  createUsuario: (payload: UserFormPayload) => mutateData<ListResponse<UserReferenceResponse>>('/usuarios', 'POST', payload),
  updateUsuario: (id: number, payload: UserFormPayload) => mutateData<ListResponse<UserReferenceResponse>>(`/usuarios/${id}`, 'PUT', payload),
  toggleUsuarioStatus: (id: number) => mutateData<ListResponse<UserReferenceResponse>>(`/usuarios/${id}/estado`, 'PATCH')
};
