import { FormEvent, useState } from 'react';
import { ArrowRight, Eye, HelpCircle, Loader2, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react';
import { blueberryApi } from '../lib/api';
import vlvLogo from '../assets/vlv-logo.png';
import type { AuthenticatedUserResponse } from '../types/api';

interface LoginPageProps {
  onAuthenticated: (user: AuthenticatedUserResponse) => Promise<void> | void;
}

const loginSteps = [
  { label: 'Cultivo', value: '01' },
  { label: 'Clasificación', value: '02' },
  { label: 'Despacho', value: '03' }
];

export function LoginPage({ onAuthenticated }: LoginPageProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <main className="vlv-login-shell">
      <section className="vlv-login-hero" aria-label="Presentación BlueberryTrace">
        <div className="vlv-login-hero__glow" aria-hidden="true" />
        <div className="vlv-login-hero__lines" aria-hidden="true" />
        <div className="vlv-login-hero__orbits" aria-hidden="true">
          <span className="trace-node trace-node--leaf">☘</span>
          <span className="trace-node trace-node--pin">⌖</span>
          <span className="trace-node trace-node--check">✓</span>
        </div>

        <div className="vlv-login-brand">
          <img src={vlvLogo} alt="Logo Vivero Los Viñedos" />
          <strong><span>Blueberry</span>Trace</strong>
        </div>

        <div className="vlv-login-copy">
          <h1>Control y trazabilidad de plantas de arándano</h1>
          <p>
            Gestione cada etapa del cultivo con información confiable, en tiempo real
            y desde un solo lugar.
          </p>
        </div>

        <div className="vlv-login-flow" aria-label="Flujo operativo principal">
          {loginSteps.map((item) => (
            <article key={item.label}>
              <span>{item.value}</span>
              <strong>{item.label}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="vlv-login-form-panel" aria-label="Inicio de sesión">
        <form className="vlv-login-card" onSubmit={handleSubmit}>
          <div className="vlv-login-card__heading">
            <span>BlueberryTrace</span>
            <h2>Bienvenido</h2>
            <p>Ingrese a su cuenta para continuar.</p>
          </div>

          <label className="vlv-field">
            <span>Usuario o correo</span>
            <div className="vlv-field__control">
              <UserRound size={18} />
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                autoComplete="username"
                placeholder="Usuario o correo"
                required
              />
            </div>
          </label>

          <label className="vlv-field">
            <span>Contraseña</span>
            <div className="vlv-field__control">
              <LockKeyhole size={18} />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Contraseña"
                required
              />
              <button
                type="button"
                className="vlv-field__icon-button"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setShowPassword((current) => !current)}
              >
                <Eye size={18} />
              </button>
            </div>
          </label>

          {error && <p className="vlv-login-error">{error}</p>}

          <button className="vlv-login-submit" type="submit" disabled={loading}>
            <span>{loading ? 'Validando acceso' : 'Iniciar sesión'}</span>
            {loading ? <Loader2 className="spin" size={18} /> : <ArrowRight size={20} />}
          </button>

          <button type="button" className="vlv-login-help">
            <HelpCircle size={17} />
            ¿Necesita ayuda para iniciar sesión?
          </button>

          <div className="vlv-login-secure-note">
            <ShieldCheck size={24} />
            <div>
              <strong>Acceso seguro y confidencial</strong>
              <small>BlueberryTrace es una aplicación interna.</small>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
}
