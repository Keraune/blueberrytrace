import { FormEvent, useState } from 'react';
import { Loader2, LockKeyhole, Sprout } from 'lucide-react';
import { blueberryApi } from '../lib/api';
import type { AuthenticatedUserResponse } from '../types/api';

interface LoginPageProps {
  onAuthenticated: (user: AuthenticatedUserResponse) => Promise<void> | void;
}

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
    <main className="login-shell">
      <section className="login-panel login-panel--visual">
        <div className="login-brand">
          <div className="brand__mark">BT</div>
          <div>
            <strong>BlueberryTrace</strong>
            <span>Vivero Los Viñedos</span>
          </div>
        </div>
        <div className="login-copy">
          <span className="login-kicker"><Sprout size={16} /> Control productivo</span>
          <h1>Trazabilidad operativa para producción de arándanos</h1>
          <p>Consulta lotes, camas, siembras, procesos, clasificaciones y despachos desde el frontend independiente conectado a la API del backend.</p>
        </div>
        <div className="login-metrics">
          <div><strong>API</strong><span>Spring Boot</span></div>
          <div><strong>React</strong><span>Frontend separado</span></div>
          <div><strong>CSRF</strong><span>Sesión segura</span></div>
        </div>
      </section>

      <section className="login-panel login-panel--form">
        <div className="login-form-heading">
          <span><LockKeyhole size={18} /></span>
          <div>
            <h2>Acceso al sistema</h2>
            <p>Ingresa con tu usuario operativo.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Usuario
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
          </label>
          <label>
            Contraseña
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" autoComplete="current-password" required />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="action-button action-button--wide" type="submit" disabled={loading}>
            {loading ? <Loader2 className="spin" size={16} /> : <LockKeyhole size={16} />}
            Iniciar sesión
          </button>
        </form>
      </section>
    </main>
  );
}
