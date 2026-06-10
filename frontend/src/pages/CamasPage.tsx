import { useMemo, useState } from 'react';
import { BedDouble, CheckCircle2, Layers3 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { FilterToolbar } from '../components/FilterToolbar';
import { MetricCard } from '../components/MetricCard';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { numberCompact } from '../lib/format';
import type { CamaResponse } from '../types/api';

interface CamasPageProps {
  camas: CamaResponse[];
}

export function CamasPage({ camas }: CamasPageProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return camas;
    }
    return camas.filter((cama) => [cama.codigo, cama.descripcion, cama.estado, cama.lote?.codigo]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [camas, query]);

  const activas = camas.filter((cama) => cama.estado === 'ACTIVA').length;
  const capacidad = camas.reduce((total, cama) => total + (cama.capacidadReferencial || 0), 0);

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Infraestructura"
        title="Camas productivas"
        description="Seguimiento de camas por invernadero, capacidad referencial y estado operativo."
      />

      <section className="metrics-grid metrics-grid--three">
        <MetricCard label="Camas registradas" value={camas.length} detail="en invernaderos" icon={<BedDouble size={20} />} tone="green" />
        <MetricCard label="Camas activas" value={activas} detail={`${numberCompact(camas.length - activas)} inactivas`} icon={<CheckCircle2 size={20} />} tone="blue" />
        <MetricCard label="Capacidad total" value={capacidad} detail="referencial de plantas" icon={<Layers3 size={20} />} tone="orange" />
      </section>

      <section className="panel-card">
        <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar cama, lote o estado" />
        <DataTable<CamaResponse>
          title="Listado de camas"
          description="Capacidad operativa disponible por cama e invernadero."
          items={filtered}
          columns={[
            { key: 'codigo', label: 'Código' },
            { key: 'lote', label: 'Lote', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'descripcion', label: 'Descripción' },
            { key: 'capacidadReferencial', label: 'Capacidad', render: (item) => numberCompact(item.capacidadReferencial || 0) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> }
          ]}
        />
      </section>
    </main>
  );
}
