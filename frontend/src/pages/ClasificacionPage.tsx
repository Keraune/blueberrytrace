import { useMemo, useState } from 'react';
import { BadgeCheck, Boxes, Scale } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { FilterToolbar } from '../components/FilterToolbar';
import { MetricCard } from '../components/MetricCard';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { dateShort, numberCompact } from '../lib/format';
import type { ClasificacionResponse } from '../types/api';

interface ClasificacionPageProps {
  clasificaciones: ClasificacionResponse[];
}

export function ClasificacionPage({ clasificaciones }: ClasificacionPageProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return clasificaciones;
    }
    return clasificaciones.filter((item) => [item.lote?.codigo, item.cama?.codigo, item.estadoPlanta, item.tamano, item.condicion, item.estado]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [clasificaciones, query]);

  const cantidad = clasificaciones.reduce((total, item) => total + (item.cantidad || 0), 0);
  const validadas = clasificaciones.filter((item) => item.estado === 'VALIDADA').length;
  const condiciones = new Set(clasificaciones.map((item) => item.condicion).filter(Boolean)).size;

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Calidad"
        title="Clasificación de plantas"
        description="Distribución de plantas por condición, tamaño, estado y lote antes del despacho."
      />

      <section className="metrics-grid metrics-grid--three">
        <MetricCard label="Registros" value={clasificaciones.length} detail="clasificaciones totales" icon={<Boxes size={20} />} tone="green" />
        <MetricCard label="Plantas clasificadas" value={cantidad} detail="cantidad acumulada" icon={<Scale size={20} />} tone="blue" />
        <MetricCard label="Validadas" value={validadas} detail={`${condiciones} condiciones`} icon={<BadgeCheck size={20} />} tone="purple" />
      </section>

      <section className="panel-card">
        <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar por lote, tamaño, condición o estado" />
        <DataTable<ClasificacionResponse>
          title="Historial de clasificación"
          description="Registros de calidad disponibles desde la API."
          items={filtered}
          columns={[
            { key: 'lote', label: 'Lote', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'fechaClasificacion', label: 'Fecha', render: (item) => dateShort(item.fechaClasificacion) },
            { key: 'estadoPlanta', label: 'Estado planta' },
            { key: 'tamano', label: 'Tamaño' },
            { key: 'cantidad', label: 'Cantidad', render: (item) => numberCompact(item.cantidad || 0) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> }
          ]}
        />
      </section>
    </main>
  );
}
