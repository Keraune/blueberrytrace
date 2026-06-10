import { FormEvent, useState } from 'react';
import { ArrowRight, CheckCircle2, Leaf, Loader2, ShieldCheck, Tag, Truck } from 'lucide-react';
import { blueberryApi } from '../lib/api';
import type { AuthenticatedUserResponse } from '../types/api';

interface LoginPageProps {
  onAuthenticated: (user: AuthenticatedUserResponse) => Promise<void> | void;
}

const demoCredentials = {
  username: 'admin',
  password: 'admin123'
};

const featureItems = [
  { label: 'Gestión completa de lotes, camas y bandejas', icon: Leaf },
  { label: 'Clasificación avanzada por calidad y tamaño', icon: Tag },
  { label: 'Trazabilidad hasta el despacho y exportación', icon: Truck },
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

  function fillDemoCredentials() {
    setUsername(demoCredentials.username);
    setPassword(demoCredentials.password);
    setError(null);
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
            <span>Agro Intelligence</span>
          </div>
        </div>

        <div className="login-copy login-copy--hero">
          <h1>
            Trazabilidad de <span>Excelencia</span> para la Exportación
          </h1>
          <p>
            Control integral de arándanos desde el invernadero hasta el despacho internacional,
            con trazabilidad total por lote y variedad.
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
            <h2>Iniciar Sesión</h2>
            <p>Ingresa tus credenciales para continuar.</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Usuario
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                placeholder="admin"
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
              <span>Ingresar al Sistema</span>
              {!loading ? <ArrowRight size={16} /> : null}
            </button>
          </form>

          <button type="button" className="login-demo-card" onClick={fillDemoCredentials}>
            <span><CheckCircle2 size={15} /> Credenciales de demo</span>
            <strong>Usuario: {demoCredentials.username}</strong>
            <strong>Contraseña: {demoCredentials.password}</strong>
          </button>

          <footer className="login-version">© 2026 BlueberryTrace · v0.1.0</footer>
        </div>
      </section>
    </main>
  );
}
