import { useMemo, useState } from 'react';
import { Loader2, Save, ShieldCheck } from 'lucide-react';
import type { UserFormPayload } from '../types/api';

const defaultPayload: UserFormPayload = {
  username: '',
  nombreCompleto: '',
  email: '',
  rol: '',
  password: '',
  activo: true
};

interface UserFormProps {
  roles: string[];
  initialData?: UserFormPayload;
  editing?: boolean;
  submitLabel?: string;
  onSubmit: (payload: UserFormPayload) => Promise<void>;
  onCancel: () => void;
}

function normalizeCorporateEmail(value: string) {
  const clean = value.trim().toLowerCase();
  if (!clean || clean.includes('@')) {
    return clean;
  }
  return `${clean}@vlv.com`;
}

export function UserForm({ roles, initialData, editing = false, submitLabel = 'Guardar usuario', onSubmit, onCancel }: UserFormProps) {
  const firstRole = roles[0] || 'OPERARIO';
  const [payload, setPayload] = useState<UserFormPayload>({ ...(initialData || defaultPayload), rol: initialData?.rol || firstRole });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailHint = useMemo(() => {
    const username = payload.username.trim().toLowerCase();
    if (!username || payload.email.includes('@')) {
      return 'Usa un correo corporativo del dominio @vlv.com';
    }
    return `Sugerido: ${username}@vlv.com`;
  }, [payload.email, payload.username]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setError(null);
      await onSubmit({
        ...payload,
        username: payload.username.trim().toLowerCase(),
        nombreCompleto: payload.nombreCompleto.trim(),
        email: normalizeCorporateEmail(payload.email),
        password: payload.password?.trim() || undefined
      });
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'No se pudo guardar el usuario.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form-grid user-form" onSubmit={submit}>
      {error ? <div className="form-alert">{error}</div> : null}

      <section className="form-context-card form-grid__full">
        <span><ShieldCheck size={18} /></span>
        <div>
          <strong>Cuenta corporativa VLV</strong>
          <small>El acceso queda vinculado a un rol operativo y a un correo empresarial @vlv.com.</small>
        </div>
      </section>

      <label>
        Usuario
        <input
          value={payload.username}
          onChange={(event) => setPayload({ ...payload, username: event.target.value })}
          required
          minLength={3}
          maxLength={50}
          placeholder="supervisor"
          autoComplete="username"
        />
      </label>

      <label>
        Nombre completo
        <input
          value={payload.nombreCompleto}
          onChange={(event) => setPayload({ ...payload, nombreCompleto: event.target.value })}
          required
          maxLength={150}
          placeholder="Supervisor de Producción"
          autoComplete="name"
        />
      </label>

      <label>
        Correo empresarial
        <input
          type="email"
          value={payload.email}
          onBlur={() => setPayload((current) => ({ ...current, email: normalizeCorporateEmail(current.email) }))}
          onChange={(event) => setPayload({ ...payload, email: event.target.value })}
          required
          maxLength={120}
          placeholder="supervisor@vlv.com"
          autoComplete="email"
        />
        <small className="field-hint">{emailHint}</small>
      </label>

      <label>
        Rol
        <select value={payload.rol} onChange={(event) => setPayload({ ...payload, rol: event.target.value })} required>
          {roles.length === 0 ? <option value="OPERARIO">OPERARIO</option> : null}
          {roles.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
      </label>

      <label>
        {editing ? 'Nueva contraseña' : 'Contraseña inicial'}
        <input
          type="password"
          value={payload.password || ''}
          onChange={(event) => setPayload({ ...payload, password: event.target.value })}
          required={!editing}
          minLength={editing && !payload.password ? undefined : 8}
          maxLength={120}
          placeholder={editing ? 'Dejar vacío para no cambiar' : 'Mínimo 8 caracteres'}
          autoComplete={editing ? 'new-password' : 'new-password'}
        />
      </label>

      <label className="toggle-field">
        <input
          type="checkbox"
          checked={payload.activo}
          onChange={(event) => setPayload({ ...payload, activo: event.target.checked })}
        />
        <span>
          Usuario activo
          <small>Permite iniciar sesión y operar según su rol.</small>
        </span>
      </label>

      <footer className="form-actions form-actions--sticky form-grid__full">
        <button type="button" className="ghost-button" onClick={onCancel} disabled={saving}>Cancelar</button>
        <button type="submit" className="action-button" disabled={saving}>
          {saving ? <Loader2 className="spin" size={16} /> : <Save size={16} />} {saving ? 'Guardando...' : submitLabel}
        </button>
      </footer>
    </form>
  );
}
