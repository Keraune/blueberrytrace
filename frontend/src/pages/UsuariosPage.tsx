import { useMemo, useState } from 'react';
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react';
import { DetailDrawer } from '../components/DetailDrawer';
import { InfoGrid } from '../components/InfoGrid';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import type { UserReferenceResponse } from '../types/api';

interface UsuariosPageProps {
  usuarios: UserReferenceResponse[];
}

function initials(name?: string | null) {
  return (name || 'USR').split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase();
}

export function UsuariosPage({ usuarios }: UsuariosPageProps) {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('TODOS');
  const [statusFilter, setStatusFilter] = useState('TODOS');
  const [selectedUser, setSelectedUser] = useState<UserReferenceResponse | null>(null);

  const roles = Array.from(new Set(usuarios.map((usuario) => usuario.rol).filter(Boolean))) as string[];
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

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Seguridad"
        title="Gestión de Usuarios"
        description="Administrar accesos y roles del sistema."
        actions={<button className="action-button" type="button"><Plus size={16} /> Nuevo usuario</button>}
      />

      <section className="summary-strip summary-strip--three">
        <article className="summary-pill summary-pill--green"><strong>{usuarios.length}</strong><span>Usuarios</span><small>cuentas registradas</small></article>
        <article className="summary-pill summary-pill--blue"><strong>{activos}</strong><span>Activos</span><small>con acceso habilitado</small></article>
        <article className="summary-pill summary-pill--purple"><strong>{roles.length}</strong><span>Roles</span><small>perfiles operativos</small></article>
      </section>

      <section className="panel-card">
        <div className="module-toolbar-card module-toolbar-card--filters">
          <label className="filter-toolbar__search">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar usuario..." />
          </label>
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="TODOS">Todos los roles</option>
            {roles.map((role) => <option key={role} value={role}>{role}</option>)}
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
                <th>Último acceso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((usuario, index) => (
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
                  <td>{index < 3 ? 'Hoy' : index < 6 ? 'Ayer' : 'Sin registro reciente'}</td>
                  <td>
                    <div className="icon-actions">
                      <button type="button" className="icon-action" title="Ver detalle" onClick={() => setSelectedUser(usuario)}><Eye size={15} /></button>
                      <button type="button" className="icon-action" title="Editar"><Pencil size={15} /></button>
                      <button type="button" className="icon-action"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer-note">Mostrando {filtered.length} de {usuarios.length} usuarios</div>
      </section>
      <DetailDrawer
        open={Boolean(selectedUser)}
        title={selectedUser?.nombreCompleto || 'Detalle de usuario'}
        subtitle={selectedUser?.email || selectedUser?.username}
        onClose={() => setSelectedUser(null)}
        actions={<button type="button" className="action-button"><Pencil size={15} /> Editar usuario</button>}
      >
        {selectedUser ? (
          <>
            <InfoGrid
              items={[
                { label: 'Usuario', value: selectedUser.username, tone: 'green' },
                { label: 'Rol', value: <StatusBadge value={selectedUser.rol} />, tone: 'purple' },
                { label: 'Estado', value: selectedUser.activo ? 'Activo' : 'Inactivo', tone: selectedUser.activo ? 'blue' : 'neutral' },
                { label: 'Correo', value: selectedUser.email }
              ]}
            />
            <section className="drawer-section drawer-section--soft">
              <h3>Permisos operativos</h3>
              <p>Este perfil se utilizará para validar accesos a módulos productivos, reportes y acciones administrativas desde React.</p>
            </section>
          </>
        ) : null}
      </DetailDrawer>

    </main>
  );
}
