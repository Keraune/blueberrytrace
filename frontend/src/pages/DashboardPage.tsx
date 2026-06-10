import type { CSSProperties, ReactNode } from 'react';
import { Boxes, Factory, Layers3, PackageCheck, Sprout, Truck } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { dateShort, numberCompact } from '../lib/format';
import type { CamaResponse, DashboardApiResponse, LoteResponse } from '../types/api';

interface DashboardPageProps {
  dashboard: DashboardApiResponse | null;
  lotes: LoteResponse[];
  camas: CamaResponse[];
}

export function DashboardPage({ dashboard, lotes, camas }: DashboardPageProps) {
  const summary = dashboard?.summary;

  const progressItems: Array<{ label: string; percent: number; icon: ReactNode }> = [
    { label: 'Uniformización', percent: summary?.porcentajeUniformizacionesSobreSiembras || 0, icon: <Boxes size={17} /> },
    { label: 'Formalización', percent: summary?.porcentajeFormalizacionesSobreSiembras || 0, icon: <PackageCheck size={17} /> },
    { label: 'Clasificación', percent: summary?.porcentajeClasificacionesSobreSiembras || 0, icon: <Layers3 size={17} /> },
    { label: 'Despacho', percent: summary?.porcentajeDespachosSobreSiembras || 0, icon: <Truck size={17} /> }
  ];

  return (
    <main className="content-grid">
      <section className="hero-panel">
        <div>
          <span className="hero-panel__tag">Operación agrícola</span>
          <h2>Trazabilidad integral de plantas de arándano</h2>
          <p>
            Vista centralizada para monitorear invernaderos, camas, siembras, clasificación y despacho en tiempo real.
          </p>
        </div>
        <div className="hero-panel__stats">
          <strong>{summary ? `${summary.porcentajePlantasDespachadas}%` : '0%'}</strong>
          <span>progreso de despacho</span>
        </div>
      </section>

      <section className="metrics-grid">
        <MetricCard
          label="Invernaderos activos"
          value={summary?.lotesActivos || 0}
          detail={`${numberCompact(summary?.lotesRegistrados || 0)} registrados`}
          icon={<Factory size={20} />}
          tone="green"
        />
        <MetricCard
          label="Camas activas"
          value={summary?.camasActivas || 0}
          detail={`${numberCompact(summary?.capacidadReferencialTotal || 0)} capacidad referencial`}
          icon={<Layers3 size={20} />}
          tone="blue"
        />
        <MetricCard
          label="Plantas sembradas"
          value={summary?.plantasSembradas || 0}
          detail={`${numberCompact(summary?.siembrasRegistradas || 0)} siembras`}
          icon={<Sprout size={20} />}
          tone="purple"
        />
        <MetricCard
          label="Plantas despachadas"
          value={summary?.plantasDespachadas || 0}
          detail={`${numberCompact(summary?.despachosRegistrados || 0)} despachos`}
          icon={<Truck size={20} />}
          tone="orange"
        />
      </section>

      <section className="analytics-grid">
        <article className="panel-card progress-panel">
          <div className="panel-card__header">
            <div>
              <h2>Flujo operativo</h2>
              <p>Porcentaje de registros procesados sobre siembras.</p>
            </div>
          </div>
          {progressItems.map(({ label, percent, icon }) => (
            <div className="progress-row" key={label}>
              <div>
                <span>{icon}</span>
                <strong>{label}</strong>
              </div>
              <small>{percent}%</small>
              <div className="progress-track">
                <span style={{ width: `${percent}%` }} />
              </div>
            </div>
          ))}
        </article>

        <article className="panel-card quality-panel">
          <div className="panel-card__header">
            <div>
              <h2>Clasificación</h2>
              <p>Validación operativa de plantas registradas.</p>
            </div>
          </div>
          <div className="quality-ring" style={{ '--value': `${summary?.porcentajeClasificacionesValidadas || 0}%` } as CSSProperties}>
            <span>{summary?.porcentajeClasificacionesValidadas || 0}%</span>
          </div>
          <div className="quality-grid">
            <div>
              <strong>{numberCompact(summary?.clasificacionesValidadas || 0)}</strong>
              <span>validadas</span>
            </div>
            <div>
              <strong>{numberCompact(summary?.clasificacionesPendientes || 0)}</strong>
              <span>pendientes</span>
            </div>
          </div>
        </article>
      </section>

      <section className="tables-grid">
        <DataTable<LoteResponse>
          title="Invernaderos recientes"
          description="Seguimiento de invernaderos registrados para producción."
          items={lotes.slice(0, 6)}
          columns={[
            { key: 'codigo', label: 'Código' },
            { key: 'variedad', label: 'Variedad' },
            { key: 'fechaRegistro', label: 'Fecha', render: (item) => dateShort(item.fechaRegistro) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> }
          ]}
        />

        <DataTable<CamaResponse>
          title="Camas operativas"
          description="Capacidad y estado operativo por cama de producción."
          items={camas.slice(0, 6)}
          columns={[
            { key: 'codigo', label: 'Código' },
            { key: 'lote', label: 'Invernadero', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'capacidadReferencial', label: 'Capacidad', render: (item) => numberCompact(item.capacidadReferencial || 0) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> }
          ]}
        />
      </section>
    </main>
  );
}
