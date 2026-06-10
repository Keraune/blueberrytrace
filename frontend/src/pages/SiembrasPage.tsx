import { useMemo, useState } from 'react';
import { CalendarDays, Sprout, Warehouse } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { FilterToolbar } from '../components/FilterToolbar';
import { MetricCard } from '../components/MetricCard';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { dateShort, numberCompact } from '../lib/format';
import type { SiembraResponse } from '../types/api';

interface SiembrasPageProps {
  siembras: SiembraResponse[];
}

export function SiembrasPage({ siembras }: SiembrasPageProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return siembras;
    }
    return siembras.filter((siembra) => [siembra.lote?.codigo, siembra.cama?.codigo, siembra.estado, siembra.observacion]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [siembras, query]);

  const plantas = siembras.reduce((total, siembra) => total + (siembra.cantidadRegistrada || 0), 0);
  const lotes = new Set(siembras.map((siembra) => siembra.lote?.codigo).filter(Boolean)).size;

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Cultivo"
        title="Registro de siembra"
        description="Monitoreo de siembras registradas por lote, cama y cantidad de plantas ingresadas al flujo productivo."
      />

      <section className="metrics-grid metrics-grid--three">
        <MetricCard label="Siembras" value={siembras.length} detail="operaciones registradas" icon={<Sprout size={20} />} tone="green" />
        <MetricCard label="Plantas sembradas" value={plantas} detail="total acumulado" icon={<Warehouse size={20} />} tone="blue" />
        <MetricCard label="Lotes usados" value={lotes} detail="con actividad de siembra" icon={<CalendarDays size={20} />} tone="purple" />
      </section>

      <section className="panel-card">
        <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar por lote, cama o estado" />
        <DataTable<SiembraResponse>
          title="Historial de siembras"
          description="Registros actuales consumidos desde el backend Spring Boot."
          items={filtered}
          columns={[
            { key: 'lote', label: 'Lote', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'cama', label: 'Cama', render: (item) => item.cama?.codigo || 'Sin cama' },
            { key: 'fechaSiembra', label: 'Fecha', render: (item) => dateShort(item.fechaSiembra) },
            { key: 'cantidadRegistrada', label: 'Cantidad', render: (item) => numberCompact(item.cantidadRegistrada || 0) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> }
          ]}
        />
      </section>
    </main>
  );
}
