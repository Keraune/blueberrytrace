import { useMemo, useState } from 'react';
import { MapPinned, PackageCheck, Truck } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { FilterToolbar } from '../components/FilterToolbar';
import { MetricCard } from '../components/MetricCard';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { dateShort, numberCompact } from '../lib/format';
import type { DespachoResponse } from '../types/api';

interface DespachoPageProps {
  despachos: DespachoResponse[];
}

export function DespachoPage({ despachos }: DespachoPageProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return despachos;
    }
    return despachos.filter((item) => [item.lote?.codigo, item.modalidad, item.destino, item.guiaRemision, item.estado]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [despachos, query]);

  const plantas = despachos.reduce((total, item) => total + (item.cantidadDespachada || 0), 0);
  const destinos = new Set(despachos.map((item) => item.destino).filter(Boolean)).size;
  const cerrados = despachos.filter((item) => item.estado === 'CERRADO').length;

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Salida"
        title="Despachos"
        description="Seguimiento de plantas despachadas por destino, modalidad, guía y validación de calidad."
      />

      <section className="metrics-grid metrics-grid--three">
        <MetricCard label="Despachos" value={despachos.length} detail="registrados" icon={<Truck size={20} />} tone="green" />
        <MetricCard label="Plantas despachadas" value={plantas} detail="total enviado" icon={<PackageCheck size={20} />} tone="blue" />
        <MetricCard label="Destinos" value={destinos} detail={`${cerrados} cerrados`} icon={<MapPinned size={20} />} tone="orange" />
      </section>

      <section className="panel-card">
        <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar por lote, destino, guía o estado" />
        <DataTable<DespachoResponse>
          title="Historial de despachos"
          description="Registros de salida para exportación o venta local."
          items={filtered}
          columns={[
            { key: 'lote', label: 'Lote', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'fechaDespacho', label: 'Fecha', render: (item) => dateShort(item.fechaDespacho) },
            { key: 'modalidad', label: 'Modalidad' },
            { key: 'cantidadDespachada', label: 'Cantidad', render: (item) => numberCompact(item.cantidadDespachada || 0) },
            { key: 'destino', label: 'Destino' },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> }
          ]}
        />
      </section>
    </main>
  );
}
