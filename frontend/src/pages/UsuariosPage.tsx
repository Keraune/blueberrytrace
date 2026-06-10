import { useMemo, useState } from 'react';
import { Eye, KeyRound, Pencil, Plus, ShieldCheck, UserX } from 'lucide-react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DetailDrawer } from '../components/DetailDrawer';
import { InfoGrid } from '../components/InfoGrid';
import { Modal } from '../components/Modal';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { UserForm } from '../components/UserForm';
import { blueberryApi } from '../lib/api';
import { dateShort, initials } from '../lib/format';
import { emitToast } from '../lib/uiEvents';
import type { UserFormPayload, UserReferenceResponse } from '../types/api';

interface UsuariosPageProps {
  usuarios: UserReferenceResponse[];
  roles: string[];
  onUsuariosChange: (items: UserReferenceResponse[]) => void;
}

function toUserPayload(usuario: UserReferenceResponse): UserFormPayload {
  return {
    username: usuario.username,
    nombreCompleto: usuario.nombreCompleto,
    email: usuario.email,
    rol: usuario.rol || 'OPERARIO',
    password: '',
    activo: usuario.activo
  };
}

export function UsuariosPage({ usuarios, roles, onUsuariosChange }: UsuariosPageProps) {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('TODOS');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [selectedUser, setSelectedUser] = useState<UserReferenceResponse | null>(null);
  const [creating, setCreating] = useState(false);
  const [editingUser, setEditingUser] = useState<UserReferenceResponse | null>(null);
  const [confirmUser, setConfirmUser] = useState<UserReferenceResponse | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const availableRoles = useMemo(() => {
    const fromUsers = usuarios.map((usuario) => usuario.rol).filter(Boolean) as string[];
    return Array.from(new Set([...(roles || []), ...fromUsers])).sort();
  }, [roles, usuarios]);

  const activos = usuarios.filter((usuario) => usuario.activo).length;
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return usuarios.filter((usuario) => {
      const matchesQuery = !term || [usuario.nombreCompleto, usuario.email, usuario.username, usuario.rol]
        .some((value) => String(value || '').toLowerCase().includes(term));
      const matchesRole = roleFilter === 'TODOS' || usuario.rol === roleFilter;
      const matchesStatus = statusFilter === 'TODOS' || (statusFilter === 'ACTIVO' ? usuario.activo : !usuario.activo);
      return matchesQuery && matchesRole && matchesStatus;
    });
  }, [usuarios, query, roleFilter, statusFilter]);

  async function createUser(payload: UserFormPayload) {
    const response = await blueberryApi.createUsuario(payload);
    onUsuariosChange(response.items);
    setCreating(false);
    emitToast('success', 'Usuario creado', `${payload.nombreCompleto} ya puede operar con su cuenta corporativa.`);
  }

  async function updateUser(payload: UserFormPayload) {
    if (!editingUser) {
      return;
    }
    const response = await blueberryApi.updateUsuario(editingUser.id, payload);
    onUsuariosChange(response.items);
    setEditingUser(null);
    setSelectedUser(response.items.find((item) => item.id === editingUser.id) || null);
    emitToast('success', 'Usuario actualizado', `${payload.nombreCompleto} fue actualizado correctamente.`);
  }

  async function toggleUserStatus() {
    if (!confirmUser) {
      return;
    }
    try {
      setConfirmLoading(true);
      const response = await blueberryApi.toggleUsuarioStatus(confirmUser.id);
      onUsuariosChange(response.items);
      const updated = response.items.find((item) => item.id === confirmUser.id);
      setSelectedUser(updated || null);
      emitToast('info', 'Estado actualizado', `${confirmUser.nombreCompleto} quedó ${updated?.activo ? 'activo' : 'inactivo'}.`);
      setConfirmUser(null);
    } finally {
      setConfirmLoading(false);
    }
  }

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Seguridad"
        title="Gestión de Usuarios"
        description="Administra cuentas corporativas, roles operativos y acceso al sistema."
        actions={<button className="action-button" type="button" onClick={() => setCreating(true)}><Plus size={16} /> Nuevo usuario</button>}
      />

      <section className="summary-strip summary-strip--three">
        <article className="summary-pill summary-pill--green"><strong>{usuarios.length}</strong><span>Usuarios</span><small>cuentas desde MySQL</small></article>
        <article className="summary-pill summary-pill--blue"><strong>{activos}</strong><span>Activos</span><small>con acceso habilitado</small></article>
        <article className="summary-pill summary-pill--purple"><strong>{availableRoles.length}</strong><span>Roles</span><small>perfiles corporativos</small></article>
      </section>

      <section className="panel-card panel-card--interactive">
        <div className="module-toolbar-card module-toolbar-card--filters">
          <label className="filter-toolbar__search">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar usuario, correo o rol..." />
          </label>
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="TODOS">Todos los roles</option>
            {availableRoles.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="TODOS">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>

        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Actualización</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((usuario) => (
                <tr key={usuario.id}>
                  <td>
                    <div className="user-row">
                      <span className="user-row__avatar">{initials(usuario.nombreCompleto)}</span>
                      <div>
                        <strong>{usuario.nombreCompleto}</strong>
                        <small>{usuario.email}</small>
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge value={usuario.rol} /></td>
                  <td>
                    <span className="status-with-dot">
                      <i className={usuario.activo ? 'status-dot status-dot--green' : 'status-dot'} />
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>{dateShort(usuario.fechaActualizacion || usuario.fechaCreacion)}</td>
                  <td>
                    <div className="icon-actions">
                      <button type="button" className="icon-action" title="Ver detalle" onClick={() => setSelectedUser(usuario)}><Eye size={15} /></button>
                      <button type="button" className="icon-action" title="Editar" onClick={() => setEditingUser(usuario)}><Pencil size={15} /></button>
                      <button type="button" className="icon-action" title={usuario.activo ? 'Desactivar usuario' : 'Activar usuario'} onClick={() => setConfirmUser(usuario)}><UserX size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state empty-state--inline">
            <ShieldCheck size={24} />
            <strong>No hay usuarios con esos filtros</strong>
            <span>Prueba con otro correo, rol o estado.</span>
          </div>
        ) : null}

        <div className="table-footer-note">Mostrando {filtered.length} de {usuarios.length} usuarios cargados desde la API</div>
      </section>

      <DetailDrawer
        open={Boolean(selectedUser)}
        title={selectedUser?.nombreCompleto || 'Detalle de usuario'}
        subtitle={selectedUser?.email || selectedUser?.username}
        onClose={() => setSelectedUser(null)}
        actions={selectedUser ? (
          <>
            <button type="button" className="ghost-button" onClick={() => setConfirmUser(selectedUser)}><KeyRound size={15} /> {selectedUser.activo ? 'Desactivar' : 'Activar'}</button>
            <button type="button" className="action-button" onClick={() => setEditingUser(selectedUser)}><Pencil size={15} /> Editar usuario</button>
          </>
        ) : null}
      >
        {selectedUser ? (
          <>
            <InfoGrid
              items={[
                { label: 'Usuario', value: selectedUser.username, tone: 'green' },
                { label: 'Rol', value: <StatusBadge value={selectedUser.rol} />, tone: 'purple' },
                { label: 'Estado', value: selectedUser.activo ? 'Activo' : 'Inactivo', tone: selectedUser.activo ? 'blue' : 'neutral' },
                { label: 'Correo', value: selectedUser.email },
                { label: 'Creación', value: dateShort(selectedUser.fechaCreacion), tone: 'orange' },
                { label: 'Actualización', value: dateShort(selectedUser.fechaActualizacion || selectedUser.fechaCreacion) }
              ]}
            />
            <section className="drawer-section drawer-section--soft">
              <h3>Cuenta empresarial</h3>
              <p>Este usuario opera con el dominio corporativo @vlv.com y sus permisos dependen del rol asignado desde la base de datos.</p>
            </section>
          </>
        ) : null}
      </DetailDrawer>

      <Modal
        open={creating}
        title="Nuevo usuario corporativo"
        description="Crea una cuenta operativa conectada al backend y a MySQL."
        size="md"
        onClose={() => setCreating(false)}
      >
        <UserForm roles={availableRoles} onSubmit={createUser} onCancel={() => setCreating(false)} />
      </Modal>

      <Modal
        open={Boolean(editingUser)}
        title="Editar usuario"
        description="Actualiza datos, rol, estado o contraseña sin salir del módulo."
        size="md"
        onClose={() => setEditingUser(null)}
      >
        {editingUser ? (
          <UserForm
            roles={availableRoles}
            initialData={toUserPayload(editingUser)}
            editing
            submitLabel="Guardar cambios"
            onSubmit={updateUser}
            onCancel={() => setEditingUser(null)}
          />
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(confirmUser)}
        title={confirmUser?.activo ? 'Desactivar usuario' : 'Activar usuario'}
        description={confirmUser ? `Se cambiará el estado de ${confirmUser.nombreCompleto}. Esta acción se reflejará en la base de datos.` : ''}
        confirmLabel={confirmUser?.activo ? 'Desactivar' : 'Activar'}
        tone={confirmUser?.activo ? 'danger' : 'success'}
        loading={confirmLoading}
        onCancel={() => setConfirmUser(null)}
        onConfirm={toggleUserStatus}
      />
    </main>
  );
}
