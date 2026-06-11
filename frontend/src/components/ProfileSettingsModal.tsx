import { FormEvent, useEffect, useMemo, useState } from 'react';
import { KeyRound, Loader2, Mail, Phone, Save, ShieldCheck, UserRound } from 'lucide-react';
import { blueberryApi } from '../lib/api';
import { initials } from '../lib/format';
import type { AuthenticatedUserResponse, PasswordChangePayload, ProfileUpdatePayload } from '../types/api';
import { Modal } from './Modal';

interface ProfileSettingsModalProps {
  open: boolean;
  user: AuthenticatedUserResponse | null;
  onClose: () => void;
  onUpdated: (user: AuthenticatedUserResponse) => void;
  onPasswordChanged?: () => void;
}

const avatarColors = [
  { key: 'emerald', label: 'Verde corporativo' },
  { key: 'blue', label: 'Azul operativo' },
  { key: 'purple', label: 'Arándano' },
  { key: 'orange', label: 'Despacho' },
  { key: 'slate', label: 'Administrativo' }
];

function normalizeCorporateEmail(value: string) {
  const clean = value.trim().toLowerCase();
  if (!clean || clean.includes('@')) {
    return clean;
  }
  return `${clean}@vlv.com`;
}

export function ProfileSettingsModal({ open, user, onClose, onUpdated, onPasswordChanged }: ProfileSettingsModalProps) {
  const [profile, setProfile] = useState<ProfileUpdatePayload>({
    nombreCompleto: '',
    email: '',
    cargo: '',
    telefono: '',
    avatarColor: 'emerald'
  });
  const [passwordPayload, setPasswordPayload] = useState<PasswordChangePayload>({ currentPassword: '', newPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !open) {
      return;
    }
    setProfile({
      nombreCompleto: user.nombreCompleto || '',
      email: user.email || '',
      cargo: user.cargo || '',
      telefono: user.telefono || '',
      avatarColor: user.avatarColor || 'emerald'
    });
    setPasswordPayload({ currentPassword: '', newPassword: '' });
    setProfileError(null);
    setPasswordError(null);
  }, [user, open]);

  const roleLabel = useMemo(() => user?.rol || user?.authorities?.[0] || 'Operario', [user]);

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSavingProfile(true);
      setProfileError(null);
      const updated = await blueberryApi.updateProfile({
        ...profile,
        nombreCompleto: profile.nombreCompleto.trim(),
        email: normalizeCorporateEmail(profile.email),
        cargo: profile.cargo?.trim() || undefined,
        telefono: profile.telefono?.trim() || undefined,
        avatarColor: profile.avatarColor || 'emerald'
      });
      onUpdated(updated);
    } catch (exception) {
      setProfileError(exception instanceof Error ? exception.message : 'No se pudo actualizar el perfil.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSavingPassword(true);
      setPasswordError(null);
      await blueberryApi.changePassword({
        currentPassword: passwordPayload.currentPassword,
        newPassword: passwordPayload.newPassword.trim()
      });
      setPasswordPayload({ currentPassword: '', newPassword: '' });
      onPasswordChanged?.();
    } catch (exception) {
      setPasswordError(exception instanceof Error ? exception.message : 'No se pudo actualizar la contraseña.');
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <Modal
      open={open}
      title="Perfil del trabajador"
      description="Gestiona tus datos corporativos, color de avatar y credenciales de acceso."
      size="xl"
      onClose={onClose}
    >
      <div className="profile-settings-layout">
        <aside className="profile-identity-card">
          <span className={`profile-avatar profile-avatar--${profile.avatarColor || 'emerald'}`}>{initials(profile.nombreCompleto || user?.nombreCompleto)}</span>
          <strong>{profile.nombreCompleto || user?.nombreCompleto || 'Trabajador VLV'}</strong>
          <small>{profile.cargo || roleLabel}</small>
          <div className="profile-identity-card__meta">
            <p><Mail size={15} /> {profile.email || 'correo@vlv.com'}</p>
            <p><Phone size={15} /> {profile.telefono || 'teléfono no registrado'}</p>
            <p><ShieldCheck size={15} /> {roleLabel}</p>
          </div>
        </aside>

        <div className="profile-settings-panels">
          <form className="profile-settings-panel" onSubmit={submitProfile}>
            <header>
              <span><UserRound size={18} /></span>
              <div>
                <strong>Datos personales</strong>
                <small>Información visible para supervisión y auditoría operativa.</small>
              </div>
            </header>

            {profileError ? <div className="form-alert">{profileError}</div> : null}

            <div className="form-grid form-grid--two">
              <label>
                Nombre completo
                <input value={profile.nombreCompleto} onChange={(event) => setProfile({ ...profile, nombreCompleto: event.target.value })} required maxLength={150} />
              </label>
              <label>
                Correo empresarial
                <input type="email" value={profile.email} onBlur={() => setProfile((current) => ({ ...current, email: normalizeCorporateEmail(current.email) }))} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required maxLength={120} />
              </label>
              <label>
                Cargo
                <input value={profile.cargo || ''} onChange={(event) => setProfile({ ...profile, cargo: event.target.value })} maxLength={90} placeholder="Supervisor de Producción" />
              </label>
              <label>
                Teléfono
                <input value={profile.telefono || ''} onChange={(event) => setProfile({ ...profile, telefono: event.target.value })} maxLength={30} placeholder="+51 956 000 100" />
              </label>
            </div>

            <div className="avatar-color-list" aria-label="Color del avatar">
              {avatarColors.map((color) => (
                <button
                  key={color.key}
                  type="button"
                  className={profile.avatarColor === color.key ? `avatar-color avatar-color--${color.key} avatar-color--active` : `avatar-color avatar-color--${color.key}`}
                  onClick={() => setProfile({ ...profile, avatarColor: color.key })}
                >
                  <span />
                  {color.label}
                </button>
              ))}
            </div>

            <footer className="profile-settings-actions">
              <button type="submit" className="action-button" disabled={savingProfile}>
                {savingProfile ? <Loader2 className="spin" size={16} /> : <Save size={16} />} Guardar perfil
              </button>
            </footer>
          </form>

          <form className="profile-settings-panel" onSubmit={submitPassword}>
            <header>
              <span><KeyRound size={18} /></span>
              <div>
                <strong>Seguridad de acceso</strong>
                <small>Actualiza tu contraseña sin modificar los datos operativos.</small>
              </div>
            </header>

            {passwordError ? <div className="form-alert">{passwordError}</div> : null}

            <div className="form-grid form-grid--two">
              <label>
                Contraseña actual
                <input type="password" value={passwordPayload.currentPassword} onChange={(event) => setPasswordPayload({ ...passwordPayload, currentPassword: event.target.value })} required autoComplete="current-password" />
              </label>
              <label>
                Nueva contraseña
                <input type="password" value={passwordPayload.newPassword} onChange={(event) => setPasswordPayload({ ...passwordPayload, newPassword: event.target.value })} required minLength={8} maxLength={120} autoComplete="new-password" />
              </label>
            </div>

            <footer className="profile-settings-actions">
              <button type="submit" className="ghost-button" disabled={savingPassword}>
                {savingPassword ? <Loader2 className="spin" size={16} /> : <KeyRound size={16} />} Cambiar contraseña
              </button>
            </footer>
          </form>
        </div>
      </div>
    </Modal>
  );
}
