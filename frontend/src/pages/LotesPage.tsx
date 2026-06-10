import { useMemo, useState } from 'react';
import { Factory, Leaf, Layers3, Plus } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { FilterToolbar } from '../components/FilterToolbar';
import { MetricCard } from '../components/MetricCard';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { dateShort, numberCompact } from '../lib/format';
import type { LoteResponse } from '../types/api';

interface LotesPageProps {
  lotes: LoteResponse[];
}

export function LotesPage({ lotes }: LotesPageProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return lotes;
    }
    return lotes.filter((lote) => [lote.codigo, lote.descripcion, lote.cultivo, lote.variedad, lote.estado]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [lotes, query]);

  const activos = lotes.filter((lote) => lote.estado === 'ACTIVO').length;
  const variedades = new Set(lotes.map((lote) => lote.variedad).filter(Boolean)).size;

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Producción"
        title="Lotes e invernaderos"
        description="Control de invernaderos registrados, variedades activas y estado operativo de cada lote."
        actions={<a className="action-button" href="http://localhost:8080/lotes/nuevo"><Plus size={17} /> Nuevo lote</a>}
      />

      <section className="metrics-grid metrics-grid--three">
        <MetricCard label="Total de lotes" value={lotes.length} detail="registros productivos" icon={<Factory size={20} />} tone="green" />
        <MetricCard label="Activos" value={activos} detail={`${numberCompact(lotes.length - activos)} no activos`} icon={<Leaf size={20} />} tone="blue" />
        <MetricCard label="Variedades" value={variedades} detail="cultivos registrados" icon={<Layers3 size={20} />} tone="purple" />
      </section>

      <section className="panel-card">
        <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar por código, variedad o estado" />
        <DataTable<LoteResponse>
          title="Inventario de invernaderos"
          description="Registros sincronizados desde la API del backend."
          items={filtered}
          columns={[
            { key: 'codigo', label: 'Código' },
            { key: 'cultivo', label: 'Cultivo' },
            { key: 'variedad', label: 'Variedad' },
            { key: 'fechaRegistro', label: 'Registro', render: (item) => dateShort(item.fechaRegistro) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> }
          ]}
        />
      </section>
    </main>
  );
}
