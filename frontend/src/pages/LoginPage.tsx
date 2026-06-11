import { FormEvent, useState } from 'react';
import { ArrowRight, Asterisk, Eye, Leaf, Loader2, LockKeyhole, Mail, ShieldCheck, Sprout } from 'lucide-react';
import { blueberryApi } from '../lib/api';
import type { AuthenticatedUserResponse } from '../types/api';

interface LoginPageProps {
  onAuthenticated: (user: AuthenticatedUserResponse) => Promise<void> | void;
}

const quickProof = [
  { label: 'Lotes', value: 'Control' },
  { label: 'Trazabilidad', value: 'Operativa' },
  { label: 'Despachos', value: 'Calidad' }
];

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const user = await blueberryApi.login({ identifier, password });
      await onAuthenticated(user);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-shell login-shell--saleskip">
      <section className="login-panel login-panel--visual login-panel--blueprint">
        <div className="login-grid-lines" aria-hidden="true" />
        <div className="login-radial-lines" aria-hidden="true" />
        <div className="login-noise" aria-hidden="true" />

        <div className="login-mark-large" aria-hidden="true">
          <Asterisk size={98} strokeWidth={3.6} />
        </div>

        <div className="login-copy login-copy--big">
          <span className="login-kicker"><Sprout size={17} /> Vivero Los Viñedos</span>
          <h1>
            Hola<br />BlueberryTrace!
          </h1>
          <p>
            Controla lotes, camas, siembras, clasificación, despacho y trazabilidad
            de plantas de arándano desde una plataforma interna.
          </p>
        </div>

        <div className="login-proof-row" aria-label="Módulos principales">
          {quickProof.map((item) => (
            <article key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>

        <footer className="login-left-footer">© 2026 BlueberryTrace. Área de frutales.</footer>
      </section>

      <section className="login-panel login-panel--form login-panel--minimal">
        <div className="login-form-card login-form-card--flat">
          <div className="login-product-brand">
            <div className="login-product-icon"><Leaf size={18} /></div>
            <strong>BlueberryTrace</strong>
          </div>

          <div className="login-form-heading login-form-heading--clean">
            <h2>Bienvenido de nuevo</h2>
            <p>Ingresa con tu usuario o correo corporativo para continuar.</p>
          </div>

          <form className="login-form login-form--underline" onSubmit={handleSubmit}>
            <label>
              <span><Mail size={15} /> Usuario o correo</span>
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="username"
                placeholder="admin o admin@vlv.com"
                required
              />
            </label>
            <label>
              <span><LockKeyhole size={15} /> Contraseña</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="Contraseña"
                required
              />
            </label>

            {error && <p className="form-error form-error--login">{error}</p>}

            <button className="login-primary-button" type="submit" disabled={loading}>
              {loading ? <Loader2 className="spin" size={16} /> : <ShieldCheck size={16} />}
              <span>Iniciar sesión</span>
              {!loading ? <ArrowRight size={16} /> : null}
            </button>
          </form>

          <div className="login-helper-row">
            <span><Eye size={15} /> Acceso protegido</span>
            <small>Usa las credenciales asignadas por administración.</small>
          </div>
        </div>
      </section>
    </main>
  );
}
