import { useMemo, useState } from 'react';
import { BarChart3, Boxes, Route, Truck } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { FilterToolbar } from '../components/FilterToolbar';
import { MetricCard } from '../components/MetricCard';
import { ModuleHeader } from '../components/ModuleHeader';
import { numberCompact } from '../lib/format';
import type { TrazabilidadResponse } from '../types/api';

interface ReportesPageProps {
  trazabilidad: TrazabilidadResponse[];
}

export function ReportesPage({ trazabilidad }: ReportesPageProps) {
  const [query, setQuery] = useState('');
  const rows = useMemo(() => trazabilidad.map((item, index) => ({ ...item, id: item.lote?.id || index + 1 })), [trazabilidad]);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return rows;
    }
    return rows.filter((item) => [item.lote?.codigo, item.lote?.descripcion, item.ultimoEvento]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [rows, query]);

  const plantasSembradas = rows.reduce((total, item) => total + item.plantasSembradas, 0);
  const plantasDespachadas = rows.reduce((total, item) => total + item.plantasDespachadas, 0);
  const avance = plantasSembradas === 0 ? 0 : Math.round((plantasDespachadas / plantasSembradas) * 100);

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Análisis"
        title="Reportes de trazabilidad"
        description="Lectura consolidada por lote para seguimiento de siembra, proceso, clasificación y despacho."
      />

      <section className="metrics-grid metrics-grid--three">
        <MetricCard label="Lotes trazados" value={rows.length} detail="con movimiento operativo" icon={<Route size={20} />} tone="green" />
        <MetricCard label="Plantas sembradas" value={plantasSembradas} detail="base productiva" icon={<Boxes size={20} />} tone="blue" />
        <MetricCard label="Avance despacho" value={`${avance}%`} detail={`${numberCompact(plantasDespachadas)} plantas despachadas`} icon={<Truck size={20} />} tone="orange" />
      </section>

      <section className="panel-card report-layout">
        <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar lote o último evento" />
        <div className="trace-summary-card">
          <BarChart3 size={22} />
          <div>
            <strong>Resumen operativo</strong>
            <span>La información se consume desde `/api/v1/reportes/trazabilidad` y queda lista para visualizaciones más avanzadas.</span>
          </div>
        </div>
        <DataTable<(TrazabilidadResponse & { id: number })>
          title="Trazabilidad por lote"
          description="Resumen de actividad productiva por lote registrado."
          items={filtered}
          columns={[
            { key: 'lote', label: 'Lote', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'camas', label: 'Camas' },
            { key: 'plantasSembradas', label: 'Sembradas', render: (item) => numberCompact(item.plantasSembradas) },
            { key: 'clasificaciones', label: 'Clasif.' },
            { key: 'plantasDespachadas', label: 'Despachadas', render: (item) => numberCompact(item.plantasDespachadas) },
            { key: 'ultimoEvento', label: 'Último evento' }
          ]}
        />
      </section>
    </main>
  );
}
