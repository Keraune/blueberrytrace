import { Boxes, PackageCheck, PercentCircle, Sprout } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { dateShort, numberCompact } from '../lib/format';
import type { FormalizacionResponse, ProcesoOperativoResponse, UniformizacionResponse } from '../types/api';

interface ProcesosPageProps {
  procesos: ProcesoOperativoResponse | null;
}

export function ProcesosPage({ procesos }: ProcesosPageProps) {
  const uniformizaciones = procesos?.uniformizaciones.items || [];
  const formalizaciones = procesos?.formalizaciones.items || [];
  const plantasUniformizadas = uniformizaciones.reduce((total, item) => total + (item.cantidadUniformizada || 0), 0);
  const plantasFormalizadas = formalizaciones.reduce((total, item) => total + (item.cantidadPlantas || 0), 0);
  const ratio = plantasUniformizadas === 0 ? 0 : Math.round((plantasFormalizadas / plantasUniformizadas) * 100);

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Proceso productivo"
        title="Uniformización y formalización"
        description="Control operativo de plantas uniformizadas y formalizadas antes de clasificación."
      />

      <section className="metrics-grid metrics-grid--four">
        <MetricCard label="Uniformizaciones" value={uniformizaciones.length} detail="registros operativos" icon={<Boxes size={20} />} tone="green" />
        <MetricCard label="Formalizaciones" value={formalizaciones.length} detail="registros operativos" icon={<PackageCheck size={20} />} tone="blue" />
        <MetricCard label="Plantas uniformizadas" value={plantasUniformizadas} detail="cantidad procesada" icon={<Sprout size={20} />} tone="purple" />
        <MetricCard label="Conversión" value={`${ratio}%`} detail="formalizadas sobre uniformizadas" icon={<PercentCircle size={20} />} tone="orange" />
      </section>

      <section className="tables-grid">
        <DataTable<UniformizacionResponse>
          title="Uniformizaciones"
          description="Detalle por lote, cama y criterio aplicado."
          items={uniformizaciones}
          columns={[
            { key: 'lote', label: 'Lote', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'cama', label: 'Cama', render: (item) => item.cama?.codigo || 'Sin cama' },
            { key: 'fechaUniformizacion', label: 'Fecha', render: (item) => dateShort(item.fechaUniformizacion) },
            { key: 'cantidadUniformizada', label: 'Cantidad', render: (item) => numberCompact(item.cantidadUniformizada || 0) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> }
          ]}
        />
        <DataTable<FormalizacionResponse>
          title="Formalizaciones"
          description="Detalle de bandejas y plantas formalizadas."
          items={formalizaciones}
          columns={[
            { key: 'lote', label: 'Lote', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'cama', label: 'Cama', render: (item) => item.cama?.codigo || 'Sin cama' },
            { key: 'fechaFormalizacion', label: 'Fecha', render: (item) => dateShort(item.fechaFormalizacion) },
            { key: 'cantidadPlantas', label: 'Plantas', render: (item) => numberCompact(item.cantidadPlantas || 0) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> }
          ]}
        />
      </section>
    </main>
  );
}
