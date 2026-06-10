import { useMemo, useState } from 'react';
import { ShieldCheck, UserCheck, UsersRound } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { FilterToolbar } from '../components/FilterToolbar';
import { MetricCard } from '../components/MetricCard';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import type { UserReferenceResponse } from '../types/api';

interface UsuariosPageProps {
  usuarios: UserReferenceResponse[];
}

export function UsuariosPage({ usuarios }: UsuariosPageProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return usuarios;
    }
    return usuarios.filter((usuario) => [usuario.nombreCompleto, usuario.username, usuario.email, usuario.rol]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [usuarios, query]);

  const activos = usuarios.filter((usuario) => usuario.activo).length;
  const roles = new Set(usuarios.map((usuario) => usuario.rol).filter(Boolean)).size;

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Seguridad"
        title="Usuarios y accesos"
        description="Administración de usuarios conectados a los roles operativos del sistema."
      />

      <section className="metrics-grid metrics-grid--three">
        <MetricCard label="Usuarios" value={usuarios.length} detail="cuentas registradas" icon={<UsersRound size={20} />} tone="green" />
        <MetricCard label="Activos" value={activos} detail="con acceso habilitado" icon={<UserCheck size={20} />} tone="blue" />
        <MetricCard label="Roles" value={roles} detail="perfiles configurados" icon={<ShieldCheck size={20} />} tone="purple" />
      </section>

      <section className="panel-card">
        <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar usuario, correo o rol" />
        <DataTable<UserReferenceResponse>
          title="Directorio de usuarios"
          description="Cuentas activas e inactivas sincronizadas desde el backend."
          items={filtered}
          columns={[
            { key: 'nombreCompleto', label: 'Usuario' },
            { key: 'username', label: 'Username' },
            { key: 'email', label: 'Correo' },
            { key: 'rol', label: 'Rol' },
            { key: 'activo', label: 'Estado', render: (item) => <StatusBadge value={item.activo ? 'ACTIVO' : 'INACTIVO'} /> }
          ]}
        />
      </section>
    </main>
  );
}
