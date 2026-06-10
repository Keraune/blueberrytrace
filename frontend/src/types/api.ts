export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ListResponse<T> {
  total: number;
  items: T[];
}

export interface ReferenceResponse {
  id: number;
  codigo: string;
  descripcion: string | null;
}

export interface UserReferenceResponse {
  id: number;
  username: string;
  nombreCompleto: string;
  email: string;
  rol: string | null;
  activo: boolean;
}

export interface AuthenticatedUserResponse {
  username: string;
  nombreCompleto: string;
  email: string;
  rol: string | null;
  authorities: string[];
}

export interface DashboardSummary {
  lotesRegistrados: number;
  lotesActivos: number;
  lotesInactivos: number;
  camasRegistradas: number;
  camasActivas: number;
  camasInactivas: number;
  capacidadReferencialTotal: number;
  siembrasRegistradas: number;
  plantasSembradas: number;
  uniformizacionesRegistradas: number;
  formalizacionesRegistradas: number;
  clasificacionesRegistradas: number;
  clasificacionesPendientes: number;
  clasificacionesValidadas: number;
  despachosRegistrados: number;
  plantasDespachadas: number;
  porcentajeLotesActivos: number;
  porcentajeCamasActivas: number;
  porcentajeClasificacionesValidadas: number;
  porcentajePlantasDespachadas: number;
  porcentajeUniformizacionesSobreSiembras: number;
  porcentajeFormalizacionesSobreSiembras: number;
  porcentajeClasificacionesSobreSiembras: number;
  porcentajeDespachosSobreSiembras: number;
}

export interface ModuleResponse {
  key: string;
  label: string;
  mvcPath: string;
  apiPath: string;
}

export interface PaletteResponse {
  darkGreen: string;
  primaryGreen: string;
  blueberryBlue: string;
  blueberryPurple: string;
  lime: string;
  orange: string;
  surface: string;
  background: string;
}

export interface FrontendBootstrapResponse {
  appName: string;
  apiVersion: string;
  strategy: string;
  supportedFrontends: string[];
  endpoints: Array<{
    method: string;
    path: string;
    description: string;
  }>;
  modules: ModuleResponse[];
  palette: PaletteResponse;
}

export interface DashboardApiResponse {
  summary: DashboardSummary;
  modules: ModuleResponse[];
}

export interface LoteResponse {
  id: number;
  codigo: string;
  descripcion: string | null;
  cultivo: string | null;
  variedad: string | null;
  fechaRegistro: string | null;
  observacion: string | null;
  estado: string | null;
  usuarioRegistro: UserReferenceResponse | null;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
}

export interface CamaResponse {
  id: number;
  codigo: string;
  descripcion: string | null;
  capacidadReferencial: number | null;
  estado: string | null;
  lote: ReferenceResponse | null;
  usuarioRegistro: UserReferenceResponse | null;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
}

export interface CsrfResponse {
  headerName: string;
  parameterName: string;
  token: string;
}
