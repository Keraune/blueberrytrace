import { FormEvent, useState } from 'react';
import { ArrowRight, KeyRound, Leaf, Loader2, ShieldCheck, Tag, Truck } from 'lucide-react';
import { blueberryApi } from '../lib/api';
import type { AuthenticatedUserResponse } from '../types/api';

interface LoginPageProps {
  onAuthenticated: (user: AuthenticatedUserResponse) => Promise<void> | void;
}

const featureItems = [
  { label: 'Gestión completa de lotes, camas y bandejas', icon: Leaf },
  { label: 'Clasificación por calidad, tamaño y condición', icon: Tag },
  { label: 'Trazabilidad hasta la salida de plantas', icon: Truck },
  { label: 'Roles y control de acceso por perfil', icon: ShieldCheck }
];

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const user = await blueberryApi.login({ username, password });
      await onAuthenticated(user);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell login-shell--showcase">
      <section className="login-panel login-panel--visual">
        <div className="login-background-orb login-background-orb--top" />
        <div className="login-background-orb login-background-orb--bottom" />

        <div className="login-brand">
          <div className="brand__mark">BT</div>
          <div>
            <strong>BlueberryTrace</strong>
            <span>Vivero Los Viñedos</span>
          </div>
        </div>

        <div className="login-copy login-copy--hero">
          <h1>
            Trazabilidad de <span>excelencia</span> para frutales
          </h1>
          <p>
            Control integral de plantas de arándano desde el invernadero hasta el despacho,
            con seguimiento por lote, cama, variedad y responsable.
          </p>
        </div>

        <div className="login-feature-list">
          {featureItems.map(({ label, icon: Icon }) => (
            <div className="login-feature-item" key={label}>
              <span><Icon size={16} /></span>
              <p>{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="login-panel login-panel--form">
        <div className="login-form-card">
          <div className="login-form-heading login-form-heading--simple">
            <h2>Iniciar sesión</h2>
            <p>Ingresa con tu cuenta corporativa para continuar.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Usuario
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                placeholder="usuario corporativo"
                required
              />
            </label>
            <label>
              Contraseña
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                required
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <button className="action-button action-button--wide login-submit-button" type="submit" disabled={loading}>
              {loading ? <Loader2 className="spin" size={16} /> : null}
              <span>Ingresar al sistema</span>
              {!loading ? <ArrowRight size={16} /> : null}
            </button>
          </form>

          <div className="login-access-card login-access-card--info">
            <span><KeyRound size={15} /> Acceso protegido</span>
            <strong>Usa las credenciales asignadas por administración.</strong>
            <small>Solicita actualización de acceso si tu cuenta no está habilitada.</small>
          </div>

          <footer className="login-version">© 2026 BlueberryTrace · Área de frutales</footer>
        </div>
      </section>
    </main>
  );
}
