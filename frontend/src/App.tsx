import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { blueberryApi } from './lib/api';
import { DashboardPage } from './pages/DashboardPage';
import type {
  AuthenticatedUserResponse,
  CamaResponse,
  DashboardApiResponse,
  FrontendBootstrapResponse,
  LoteResponse
} from './types/api';

export default function App() {
  const [bootstrap, setBootstrap] = useState<FrontendBootstrapResponse | null>(null);
  const [user, setUser] = useState<AuthenticatedUserResponse | null>(null);
  const [dashboard, setDashboard] = useState<DashboardApiResponse | null>(null);
  const [lotes, setLotes] = useState<LoteResponse[]>([]);
  const [camas, setCamas] = useState<CamaResponse[]>([]);
  const [activeKey, setActiveKey] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const [bootstrapResponse, userResponse, dashboardResponse, lotesResponse, camasResponse] = await Promise.all([
          blueberryApi.bootstrap(),
          blueberryApi.session(),
          blueberryApi.dashboard(),
          blueberryApi.lotes(),
          blueberryApi.camas()
        ]);

        if (!mounted) {
          return;
        }

        setBootstrap(bootstrapResponse);
        setUser(userResponse);
        setDashboard(dashboardResponse);
        setLotes(lotesResponse.items);
        setCamas(camasResponse.items);
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
        <Topbar user={user} />
        {activeKey === 'dashboard' ? (
          <DashboardPage dashboard={dashboard} lotes={lotes} camas={camas} />
        ) : (
          <main className="content-grid">
            <section className="hero-panel hero-panel--compact">
              <div>
                <span className="hero-panel__tag">Módulo conectado</span>
                <h2>{modules.find((module) => module.key === activeKey)?.label || 'Módulo operativo'}</h2>
                <p>
                  Este módulo está preparado para operar con la misma información central del sistema.
                </p>
              </div>
            </section>
          </main>
        )}
      </section>
    </div>
  );
}
