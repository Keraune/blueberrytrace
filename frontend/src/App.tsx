import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader2, RefreshCcw } from 'lucide-react';
import { CommandPalette, type CommandSearchItem } from './components/CommandPalette';
import { ProfileSettingsModal } from './components/ProfileSettingsModal';
import { Sidebar } from './components/Sidebar';
import { ToastStack, type ToastItem, type ToastTone } from './components/ToastStack';
import { Topbar, type TopbarNotification } from './components/Topbar';
import { useAppRoute } from './hooks/useAppRoute';
import { BLUEBERRY_TOAST_EVENT, type BlueberryToastDetail } from './lib/uiEvents';
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


function sortByMostRecent<T>(items: T[], dateOf: (item: T) => string | null | undefined) {
  return [...items].sort((left, right) => {
    const leftDate = dateOf(left);
    const rightDate = dateOf(right);
    return new Date(rightDate || 0).getTime() - new Date(leftDate || 0).getTime();
  });
}

function buildNotifications(
  lotes: LoteResponse[],
  camas: CamaResponse[],
  clasificaciones: ClasificacionResponse[],
  despachos: DespachoResponse[]
): TopbarNotification[] {
  const notifications: TopbarNotification[] = [];

  const pendingClassifications = clasificaciones.filter((item) => /PENDIENTE|OBSERVADA/i.test(item.estado || ''));
  if (pendingClassifications.length > 0) {
    const first = sortByMostRecent(pendingClassifications, (item) => item.fechaActualizacion || item.fechaClasificacion)[0];
    notifications.push({
      id: `clasificaciones-${pendingClassifications.length}`,
      tone: 'warning',
      title: `${pendingClassifications.length} clasificaciones requieren revisión`,
      description: first?.lote?.codigo ? `Último registro asociado al lote ${first.lote.codigo}.` : 'Hay registros pendientes de validación de calidad.',
      createdAt: first?.fechaActualizacion || first?.fechaClasificacion,
      moduleKey: 'clasificacion'
    });
  }

  const observedDispatches = despachos.filter((item) => /OBSERVADO|ANULADO/i.test(item.estado || item.validacionCalidad || ''));
  if (observedDispatches.length > 0) {
    const first = sortByMostRecent(observedDispatches, (item) => item.fechaActualizacion || item.fechaDespacho)[0];
    notifications.push({
      id: `despachos-${observedDispatches.length}`,
      tone: 'danger',
      title: `${observedDispatches.length} despachos con observación`,
      description: first?.destino ? `Último destino observado: ${first.destino}.` : 'Revisa el módulo de despacho.',
      createdAt: first?.fechaActualizacion || first?.fechaDespacho,
      moduleKey: 'despacho'
    });
  }

  const inactiveBeds = camas.filter((item) => (item.estado || '').toUpperCase() !== 'ACTIVA');
  if (inactiveBeds.length > 0) {
    notifications.push({
      id: `camas-${inactiveBeds.length}`,
      tone: 'info',
      title: `${inactiveBeds.length} camas no activas`,
      description: 'Revisa disponibilidad y mantenimiento de camas productivas.',
      createdAt: sortByMostRecent(inactiveBeds, (item) => item.fechaActualizacion || item.fechaCreacion)[0]?.fechaActualizacion,
      moduleKey: 'camas'
    });
  }

  const latestLot = sortByMostRecent(lotes, (item) => item.fechaActualizacion || item.fechaCreacion || item.fechaRegistro)[0];
  if (latestLot) {
    notifications.push({
      id: `lote-${latestLot.id}`,
      tone: 'success',
      title: `Lote ${latestLot.codigo} disponible`,
      description: latestLot.estado ? `Estado actual: ${latestLot.estado}.` : 'Registro cargado desde la base de datos.',
      createdAt: latestLot.fechaActualizacion || latestLot.fechaCreacion || latestLot.fechaRegistro,
      moduleKey: 'lotes'
    });
  }

  return notifications.slice(0, 6);
}

function buildSearchItems(
  lotes: LoteResponse[],
  camas: CamaResponse[],
  siembras: SiembraResponse[],
  procesos: ProcesoOperativoResponse | null,
  clasificaciones: ClasificacionResponse[],
  despachos: DespachoResponse[],
  usuarios: UserReferenceResponse[]
): CommandSearchItem[] {
  return [
    ...lotes.map((item) => ({
      id: `lote-${item.id}`,
      label: `Lote ${item.codigo}`,
      description: [item.descripcion, item.variedad, item.estado].filter(Boolean).join(' · '),
      moduleKey: 'lotes',
      type: 'Lote'
    })),
    ...camas.map((item) => ({
      id: `cama-${item.id}`,
      label: `Cama ${item.codigo}`,
      description: [item.lote?.codigo, item.descripcion, item.estado].filter(Boolean).join(' · '),
      moduleKey: 'camas',
      type: 'Cama'
    })),
    ...siembras.map((item) => ({
      id: `siembra-${item.id}`,
      label: `Siembra #${item.id}`,
      description: [item.lote?.codigo, item.cama?.codigo, item.estado].filter(Boolean).join(' · '),
      moduleKey: 'siembra',
      type: 'Siembra'
    })),
    ...(procesos?.uniformizaciones.items || []).map((item) => ({
      id: `uniformizacion-${item.id}`,
      label: `Uniformización #${item.id}`,
      description: [item.lote?.codigo, item.cama?.codigo, item.estado].filter(Boolean).join(' · '),
      moduleKey: 'procesos',
      type: 'Proceso'
    })),
    ...(procesos?.formalizaciones.items || []).map((item) => ({
      id: `formalizacion-${item.id}`,
      label: `Formalización #${item.id}`,
      description: [item.lote?.codigo, item.cama?.codigo, item.estado].filter(Boolean).join(' · '),
      moduleKey: 'procesos',
      type: 'Proceso'
    })),
    ...clasificaciones.map((item) => ({
      id: `clasificacion-${item.id}`,
      label: `Clasificación #${item.id}`,
      description: [item.lote?.codigo, item.estadoPlanta, item.estado].filter(Boolean).join(' · '),
      moduleKey: 'clasificacion',
      type: 'Calidad'
    })),
    ...despachos.map((item) => ({
      id: `despacho-${item.id}`,
      label: `Despacho #${item.id}`,
      description: [item.lote?.codigo, item.destino, item.estado].filter(Boolean).join(' · '),
      moduleKey: 'despacho',
      type: 'Despacho'
    })),
    ...usuarios.map((item) => ({
      id: `usuario-${item.id}`,
      label: item.nombreCompleto || item.username,
      description: [item.email, item.rol, item.activo ? 'Activo' : 'Inactivo'].filter(Boolean).join(' · '),
      moduleKey: 'usuarios',
      type: 'Usuario'
    }))
  ];
}

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
  const [commandOpen, setCommandOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { activeKey, navigate } = useAppRoute();

  function pushToast(tone: ToastTone, title: string, description?: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current.slice(-3), { id, tone, title, description }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 4200);
  }

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

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen(true);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    function onToast(event: Event) {
      const detail = (event as CustomEvent<BlueberryToastDetail>).detail;
      if (detail) {
        pushToast(detail.tone, detail.title, detail.description);
      }
    }

    window.addEventListener(BLUEBERRY_TOAST_EVENT, onToast);
    return () => window.removeEventListener(BLUEBERRY_TOAST_EVENT, onToast);
  }, []);

  async function refresh() {
    try {
      setRefreshing(true);
      await load();
      pushToast('success', 'Datos sincronizados', 'La información operativa fue actualizada correctamente.');
    } catch (exception) {
      if (exception instanceof ApiError && exception.status === 401) {
        setAuthRequired(true);
        setUser(null);
        setError(null);
        pushToast('warning', 'Sesión expirada', 'Inicia sesión nuevamente para continuar.');
      } else {
        const message = exception instanceof Error ? exception.message : 'No se pudo actualizar la información.';
        setError(message);
        pushToast('error', 'No se pudo sincronizar', message);
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
      pushToast('success', 'Sesión iniciada', `Bienvenido, ${authenticatedUser.nombreCompleto || authenticatedUser.username}.`);
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
      pushToast('info', 'Sesión cerrada', 'Puedes iniciar sesión nuevamente cuando lo necesites.');
    }
  }

  const modules = useMemo(() => bootstrap?.modules || dashboard?.modules || [], [bootstrap, dashboard]);
  const activeModule = modules.find((module) => module.key === activeKey);
  const loteReferences = catalogs?.lotes || lotes.map((lote) => ({ id: lote.id, codigo: lote.codigo, descripcion: lote.descripcion }));
  const notifications = useMemo(() => buildNotifications(lotes, camas, clasificaciones, despachos), [lotes, camas, clasificaciones, despachos]);
  const searchItems = useMemo(() => buildSearchItems(lotes, camas, siembras, procesos, clasificaciones, despachos, usuarios), [
    lotes,
    camas,
    siembras,
    procesos,
    clasificaciones,
    despachos,
    usuarios
  ]);

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
      <Sidebar modules={modules} activeKey={activeKey} user={user} onSelect={navigate} onLogout={handleLogout} />
      <section className="main-shell">
        <Topbar
          user={user}
          activeModule={activeModule?.label || 'Control de trazabilidad'}
          notifications={notifications}
          onOpenSearch={() => setCommandOpen(true)}
          onRefresh={refresh}
          onNavigate={navigate}
          onOpenProfile={() => setProfileOpen(true)}
          onLogout={handleLogout}
          refreshing={refreshing}
        />
        <div key={activeKey} className="route-transition">
          {activeKey === 'dashboard' && (
            <DashboardPage
              dashboard={dashboard}
              lotes={lotes}
              camas={camas}
              siembras={siembras}
              procesos={procesos}
              clasificaciones={clasificaciones}
              despachos={despachos}
              trazabilidad={trazabilidad}
            />
          )}
          {activeKey === 'lotes' && <LotesPage lotes={lotes} camas={camas} siembras={siembras} onLotesChange={setLotes} />}
          {activeKey === 'camas' && <CamasPage camas={camas} lotes={loteReferences} onCamasChange={setCamas} />}
          {activeKey === 'siembra' && <SiembrasPage siembras={siembras} lotes={loteReferences} camas={camas} onSiembrasChange={setSiembras} />}
          {activeKey === 'procesos' && <ProcesosPage procesos={procesos} lotes={loteReferences} camas={camas} siembras={siembras} onProcesosChange={setProcesos} />}
          {activeKey === 'clasificacion' && <ClasificacionPage clasificaciones={clasificaciones} lotes={loteReferences} camas={camas} onClasificacionesChange={setClasificaciones} />}
          {activeKey === 'despacho' && <DespachoPage despachos={despachos} lotes={loteReferences} modalidades={catalogs?.modalidadesDespacho || ['JABAS', 'BINS_MADERA']} validaciones={catalogs?.validacionesCalidad || ['APROBADO', 'OBSERVADO']} onDespachosChange={setDespachos} />}
          {activeKey === 'reportes' && <ReportesPage trazabilidad={trazabilidad} />}
          {activeKey === 'usuarios' && <UsuariosPage usuarios={usuarios} roles={catalogs?.roles || []} onUsuariosChange={setUsuarios} />}
        </div>
      </section>
      <CommandPalette
        open={commandOpen}
        modules={modules}
        activeKey={activeKey}
        searchItems={searchItems}
        onClose={() => setCommandOpen(false)}
        onSelect={navigate}
        onRefresh={refresh}
      />
      <ProfileSettingsModal
        open={profileOpen}
        user={user}
        onClose={() => setProfileOpen(false)}
        onUpdated={(updatedUser) => {
          setUser(updatedUser);
          pushToast('success', 'Perfil actualizado', 'Tus datos corporativos fueron guardados correctamente.');
        }}
        onPasswordChanged={() => pushToast('success', 'Contraseña actualizada', 'Tu contraseña fue modificada correctamente.')}
      />
      <ToastStack toasts={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
    </div>
  );
}
