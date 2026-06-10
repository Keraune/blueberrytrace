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

export interface SiembraResponse {
  id: number;
  lote: ReferenceResponse | null;
  cama: ReferenceResponse | null;
  fechaSiembra: string | null;
  cantidadRegistrada: number | null;
  observacion: string | null;
  estado: string | null;
  usuarioRegistro: UserReferenceResponse | null;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
}

export interface UniformizacionResponse {
  id: number;
  lote: ReferenceResponse | null;
  cama: ReferenceResponse | null;
  fechaUniformizacion: string | null;
  criterio: string | null;
  cantidadInicial: number | null;
  cantidadUniformizada: number | null;
  observacion: string | null;
  estado: string | null;
  usuarioRegistro: UserReferenceResponse | null;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
}

export interface FormalizacionResponse {
  id: number;
  lote: ReferenceResponse | null;
  cama: ReferenceResponse | null;
  fechaFormalizacion: string | null;
  detalle: string | null;
  cantidadBandejas: number | null;
  cantidadPlantas: number | null;
  observacion: string | null;
  estado: string | null;
  usuarioRegistro: UserReferenceResponse | null;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
}

export interface ProcesoOperativoResponse {
  uniformizaciones: ListResponse<UniformizacionResponse>;
  formalizaciones: ListResponse<FormalizacionResponse>;
}

export interface ClasificacionResponse {
  id: number;
  lote: ReferenceResponse | null;
  cama: ReferenceResponse | null;
  fechaClasificacion: string | null;
  estadoPlanta: string | null;
  tamano: string | null;
  condicion: string | null;
  cantidad: number | null;
  observacion: string | null;
  estado: string | null;
  usuarioRegistro: UserReferenceResponse | null;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
}

export interface DespachoResponse {
  id: number;
  lote: ReferenceResponse | null;
  fechaDespacho: string | null;
  modalidad: string | null;
  cantidadDespachada: number | null;
  destino: string | null;
  guiaRemision: string | null;
  validacionCalidad: string | null;
  observacion: string | null;
  estado: string | null;
  usuarioRegistro: UserReferenceResponse | null;
  fechaCreacion: string | null;
  fechaActualizacion: string | null;
}

export interface TrazabilidadResponse {
  id?: number;
  lote: ReferenceResponse | null;
  camas: number;
  siembras: number;
  plantasSembradas: number;
  uniformizaciones: number;
  formalizaciones: number;
  clasificaciones: number;
  despachos: number;
  plantasDespachadas: number;
  ultimoEvento: string | null;
}

export interface CatalogResponse {
  lotes: ReferenceResponse[];
  camas: ReferenceResponse[];
  estadosLote: string[];
  estadosCama: string[];
  estadosOperativos: string[];
  estadosClasificacion: string[];
  estadosDespacho: string[];
  modalidadesDespacho: string[];
  validacionesCalidad: string[];
}

export interface LoteFormPayload {
  codigo: string;
  descripcion: string;
  cultivo: string;
  variedad: string;
  fechaRegistro: string;
  observacion?: string;
  estado: string;
}

export interface CamaFormPayload {
  codigo: string;
  descripcion: string;
  capacidadReferencial: number;
  estado: string;
  loteId: number;
}

export interface CsrfResponse {
  headerName: string;
  parameterName: string;
  token: string;
}
