import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { blueberryApi } from './lib/api';
import { CamasPage } from './pages/CamasPage';
import { ClasificacionPage } from './pages/ClasificacionPage';
import { DashboardPage } from './pages/DashboardPage';
import { DespachoPage } from './pages/DespachoPage';
import { LotesPage } from './pages/LotesPage';
import { ProcesosPage } from './pages/ProcesosPage';
import { ReportesPage } from './pages/ReportesPage';
import { SiembrasPage } from './pages/SiembrasPage';
import { UsuariosPage } from './pages/UsuariosPage';
import type {
  AuthenticatedUserResponse,
  CamaResponse,
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
  const [lotes, setLotes] = useState<LoteResponse[]>([]);
  const [camas, setCamas] = useState<CamaResponse[]>([]);
  const [siembras, setSiembras] = useState<SiembraResponse[]>([]);
  const [procesos, setProcesos] = useState<ProcesoOperativoResponse | null>(null);
  const [clasificaciones, setClasificaciones] = useState<ClasificacionResponse[]>([]);
  const [despachos, setDespachos] = useState<DespachoResponse[]>([]);
  const [trazabilidad, setTrazabilidad] = useState<TrazabilidadResponse[]>([]);
  const [usuarios, setUsuarios] = useState<UserReferenceResponse[]>([]);
  const [activeKey, setActiveKey] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const [
          bootstrapResponse,
          userResponse,
          dashboardResponse,
          lotesResponse,
          camasResponse,
          siembrasResponse,
          procesosResponse,
          clasificacionesResponse,
          despachosResponse,
          trazabilidadResponse,
          usuariosResponse
        ] = await Promise.all([
          blueberryApi.bootstrap(),
          blueberryApi.session(),
          blueberryApi.dashboard(),
          blueberryApi.lotes(),
          blueberryApi.camas(),
          blueberryApi.siembras(),
          blueberryApi.procesos(),
          blueberryApi.clasificaciones(),
          blueberryApi.despachos(),
          blueberryApi.trazabilidad(),
          blueberryApi.usuarios()
        ]);

        if (!mounted) {
          return;
        }

        setBootstrap(bootstrapResponse);
        setUser(userResponse);
        setDashboard(dashboardResponse);
        setLotes(lotesResponse.items);
        setCamas(camasResponse.items);
        setSiembras(siembrasResponse.items);
        setProcesos(procesosResponse);
        setClasificaciones(clasificacionesResponse.items);
        setDespachos(despachosResponse.items);
        setTrazabilidad(trazabilidadResponse.items);
        setUsuarios(usuariosResponse.items);
        setError(null);
      } catch (exception) {
        if (!mounted) {
          return;
        }
        setError(exception instanceof Error ? exception.message : 'No se pudo cargar la información del panel.');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const modules = useMemo(() => bootstrap?.modules || dashboard?.modules || [], [bootstrap, dashboard]);
  const activeModule = modules.find((module) => module.key === activeKey);

  if (loading) {
    return (
      <div className="boot-screen">
        <Loader2 className="spin" size={34} />
        <strong>Cargando BlueberryTrace</strong>
        <span>Conectando con el servicio operativo</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="boot-screen boot-screen--error">
        <AlertTriangle size={38} />
        <strong>No se pudo conectar con el servicio</strong>
        <span>{error}</span>
        <a href="http://localhost:8080/auth/login">Iniciar sesión</a>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar modules={modules} activeKey={activeKey} onSelect={setActiveKey} />
      <section className="main-shell">
        <Topbar user={user} activeModule={activeModule?.label || 'Control de trazabilidad'} />
        {activeKey === 'dashboard' && <DashboardPage dashboard={dashboard} lotes={lotes} camas={camas} />}
        {activeKey === 'lotes' && <LotesPage lotes={lotes} />}
        {activeKey === 'camas' && <CamasPage camas={camas} />}
        {activeKey === 'siembra' && <SiembrasPage siembras={siembras} />}
        {activeKey === 'procesos' && <ProcesosPage procesos={procesos} />}
        {activeKey === 'clasificacion' && <ClasificacionPage clasificaciones={clasificaciones} />}
        {activeKey === 'despacho' && <DespachoPage despachos={despachos} />}
        {activeKey === 'reportes' && <ReportesPage trazabilidad={trazabilidad} />}
        {activeKey === 'usuarios' && <UsuariosPage usuarios={usuarios} />}
      </section>
    </div>
  );
}
