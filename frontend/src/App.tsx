import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader2, RefreshCcw } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { useAppRoute } from './hooks/useAppRoute';
import { ApiError, blueberryApi } from './lib/api';
import { CamasPage } from './pages/CamasPage';
import { ClasificacionPage } from './pages/ClasificacionPage';
import { DashboardPage } from './pages/DashboardPage';
import { DespachoPage } from './pages/DespachoPage';
import { LoginPage } from './pages/LoginPage';
import { LotesPage } from './pages/LotesPage';
import { ProcesosPage } from './pages/ProcesosPage';
import { ReportesPage } from './pages/ReportesPage';
import { SiembrasPage } from './pages/SiembrasPage';
import { UsuariosPage } from './pages/UsuariosPage';
import type {
  AuthenticatedUserResponse,
  CamaResponse,
  CatalogResponse,
  ClasificacionResponse,
  DashboardApiResponse,
  DespachoResponse,
  FrontendBootstrapResponse,
  LoteResponse,
  ProcesoOperativoResponse,
  SiembraResponse,
  TrazabilidadResponse,
  UserReferenceResponse
} from './types/api';

export default function App() {
  const [bootstrap, setBootstrap] = useState<FrontendBootstrapResponse | null>(null);
  const [user, setUser] = useState<AuthenticatedUserResponse | null>(null);
  const [dashboard, setDashboard] = useState<DashboardApiResponse | null>(null);
  const [catalogs, setCatalogs] = useState<CatalogResponse | null>(null);
  const [lotes, setLotes] = useState<LoteResponse[]>([]);
  const [camas, setCamas] = useState<CamaResponse[]>([]);
  const [siembras, setSiembras] = useState<SiembraResponse[]>([]);
  const [procesos, setProcesos] = useState<ProcesoOperativoResponse | null>(null);
  const [clasificaciones, setClasificaciones] = useState<ClasificacionResponse[]>([]);
  const [despachos, setDespachos] = useState<DespachoResponse[]>([]);
  const [trazabilidad, setTrazabilidad] = useState<TrazabilidadResponse[]>([]);
  const [usuarios, setUsuarios] = useState<UserReferenceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { activeKey, navigate } = useAppRoute();

  async function load(signal?: AbortSignal) {
    const [bootstrapResponse, userResponse] = await Promise.all([
      blueberryApi.bootstrap(),
      blueberryApi.session()
    ]);

    const [
      dashboardResponse,
      catalogsResponse,
      lotesResponse,
      camasResponse,
      siembrasResponse,
      procesosResponse,
      clasificacionesResponse,
      despachosResponse,
      trazabilidadResponse,
      usuariosResponse
    ] = await Promise.all([
      blueberryApi.dashboard(),
      blueberryApi.catalogs(),
      blueberryApi.lotes(),
      blueberryApi.camas(),
      blueberryApi.siembras(),
      blueberryApi.procesos(),
      blueberryApi.clasificaciones(),
      blueberryApi.despachos(),
      blueberryApi.trazabilidad(),
      blueberryApi.usuarios()
    ]);

    if (signal?.aborted) {
      return;
    }

    setBootstrap(bootstrapResponse);
    setUser(userResponse);
    setDashboard(dashboardResponse);
    setCatalogs(catalogsResponse);
    setLotes(lotesResponse.items);
    setCamas(camasResponse.items);
    setSiembras(siembrasResponse.items);
    setProcesos(procesosResponse);
    setClasificaciones(clasificacionesResponse.items);
    setDespachos(despachosResponse.items);
    setTrazabilidad(trazabilidadResponse.items);
    setUsuarios(usuariosResponse.items);
    setAuthRequired(false);
    setError(null);
  }

  useEffect(() => {
    const controller = new AbortController();

    async function boot() {
      try {
        setLoading(true);
        await load(controller.signal);
      } catch (exception) {
        if (!controller.signal.aborted) {
          if (exception instanceof ApiError && exception.status === 401) {
            setAuthRequired(true);
            setError(null);
          } else {
            setError(exception instanceof Error ? exception.message : 'No se pudo cargar la información del panel.');
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    boot();
    return () => controller.abort();
  }, []);

  async function refresh() {
    try {
      setRefreshing(true);
      await load();
    } catch (exception) {
      if (exception instanceof ApiError && exception.status === 401) {
        setAuthRequired(true);
        setUser(null);
        setError(null);
      } else {
        setError(exception instanceof Error ? exception.message : 'No se pudo actualizar la información.');
      }
    } finally {
      setRefreshing(false);
    }
  }

  async function handleAuthenticated(authenticatedUser: AuthenticatedUserResponse) {
    setUser(authenticatedUser);
    setAuthRequired(false);
    if (window.location.pathname === '/login') {
      window.history.pushState({}, '', '/dashboard');
    }
    setLoading(true);
    try {
      await load();
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await blueberryApi.logout();
    } finally {
      setUser(null);
      setAuthRequired(true);
      setDashboard(null);
      setCatalogs(null);
      window.history.pushState({}, '', '/login');
    }
  }

  const modules = useMemo(() => bootstrap?.modules || dashboard?.modules || [], [bootstrap, dashboard]);
  const activeModule = modules.find((module) => module.key === activeKey);
  const loteReferences = catalogs?.lotes || lotes.map((lote) => ({ id: lote.id, codigo: lote.codigo, descripcion: lote.descripcion }));

  if (loading) {
    return (
      <div className="boot-screen">
        <Loader2 className="spin" size={34} />
        <strong>Cargando BlueberryTrace</strong>
        <span>Conectando con el servicio operativo</span>
      </div>
    );
  }

  if (authRequired) {
    return <LoginPage onAuthenticated={handleAuthenticated} />;
  }

  if (error) {
    return (
      <div className="boot-screen boot-screen--error">
        <AlertTriangle size={38} />
        <strong>No se pudo conectar con el servicio</strong>
        <span>{error}</span>
        <div className="boot-actions">
          <button type="button" className="action-button" onClick={refresh}><RefreshCcw size={16} /> Reintentar</button>
          <button type="button" className="ghost-button" onClick={() => setAuthRequired(true)}>Iniciar sesión</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar modules={modules} activeKey={activeKey} onSelect={navigate} />
      <section className="main-shell">
        <Topbar user={user} activeModule={activeModule?.label || 'Control de trazabilidad'} onLogout={handleLogout} />
        <div className="refresh-row">
          <button type="button" className="ghost-button" onClick={refresh} disabled={refreshing}>
            <RefreshCcw className={refreshing ? 'spin' : undefined} size={15} /> Sincronizar datos
          </button>
        </div>
        {activeKey === 'dashboard' && <DashboardPage dashboard={dashboard} lotes={lotes} camas={camas} />}
        {activeKey === 'lotes' && <LotesPage lotes={lotes} onLotesChange={setLotes} />}
        {activeKey === 'camas' && <CamasPage camas={camas} lotes={loteReferences} onCamasChange={setCamas} />}
        {activeKey === 'siembra' && <SiembrasPage siembras={siembras} lotes={loteReferences} camas={camas} onSiembrasChange={setSiembras} />}
        {activeKey === 'procesos' && <ProcesosPage procesos={procesos} lotes={loteReferences} camas={camas} onProcesosChange={setProcesos} />}
        {activeKey === 'clasificacion' && <ClasificacionPage clasificaciones={clasificaciones} lotes={loteReferences} camas={camas} onClasificacionesChange={setClasificaciones} />}
        {activeKey === 'despacho' && <DespachoPage despachos={despachos} lotes={loteReferences} modalidades={catalogs?.modalidadesDespacho || ['JABAS', 'BINS_MADERA']} validaciones={catalogs?.validacionesCalidad || ['APROBADO', 'OBSERVADO']} onDespachosChange={setDespachos} />}
        {activeKey === 'reportes' && <ReportesPage trazabilidad={trazabilidad} />}
        {activeKey === 'usuarios' && <UsuariosPage usuarios={usuarios} />}
      </section>
    </div>
  );
}
