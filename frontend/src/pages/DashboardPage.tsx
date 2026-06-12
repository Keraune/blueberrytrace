import { AlertTriangle, CalendarDays, CheckCircle2, ClipboardList, Factory, Home, Leaf, MoreVertical, PackageCheck, Route, Sprout, Tag, Truck } from 'lucide-react';
import { dateShort, numberCompact } from '../lib/format';
import type {
  CamaResponse,
  ClasificacionResponse,
  DashboardApiResponse,
  DespachoResponse,
  LoteResponse,
  ProcesoOperativoResponse,
  SiembraResponse,
  TrazabilidadResponse
} from '../types/api';

interface DashboardPageProps {
  dashboard: DashboardApiResponse | null;
  lotes: LoteResponse[];
  camas: CamaResponse[];
  siembras: SiembraResponse[];
  procesos: ProcesoOperativoResponse | null;
  clasificaciones: ClasificacionResponse[];
  despachos: DespachoResponse[];
  trazabilidad: TrazabilidadResponse[];
}

type ActivityTone = 'green' | 'purple' | 'amber' | 'slate';

interface ActivityEntry {
  id: string;
  tone: ActivityTone;
  title: string;
  meta: string;
  time: string;
  icon: typeof Sprout;
}

function valueOf(value: number | null | undefined) {
  return Number.isFinite(value || 0) ? Number(value || 0) : 0;
}

function recordDate(...values: Array<string | null | undefined>) {
  return values.find(Boolean) || null;
}

function byLatestDate<T>(items: T[], dateOf: (item: T) => string | null | undefined) {
  return [...items].sort((left, right) => new Date(dateOf(right) || 0).getTime() - new Date(dateOf(left) || 0).getTime());
}

function actorName(value: { usuarioRegistro?: { nombreCompleto?: string | null } | null }) {
  return value.usuarioRegistro?.nombreCompleto || 'Sistema';
}

function statusClass(value?: string | null) {
  const source = (value || '').toLowerCase();
  if (/activo|producci|validado|completado|aprob/i.test(source)) return 'success';
  if (/proceso|pendiente|revisi/i.test(source)) return 'warning';
  if (/observ|anulado|inactivo|rechaz/i.test(source)) return 'danger';
  return 'neutral';
}

function traceProgress(trace?: TrazabilidadResponse) {
  const steps = [
    { label: 'Siembra', active: valueOf(trace?.siembras) > 0, icon: Sprout },
    { label: 'Uniformización', active: valueOf(trace?.uniformizaciones) > 0, icon: Leaf },
    { label: 'Formalización', active: valueOf(trace?.formalizaciones) > 0, icon: ClipboardList },
    { label: 'Clasificación', active: valueOf(trace?.clasificaciones) > 0, icon: Tag },
    { label: 'Despachado', active: valueOf(trace?.despachos) > 0, icon: Truck }
  ];
  return steps;
}

function monthName(value?: string | null) {
  const parsed = new Date(value || '');
  if (Number.isNaN(parsed.getTime())) return 'Actual';
  return parsed.toLocaleString('es-PE', { month: 'short' }).replace('.', '');
}

function buildRendimiento(lotes: LoteResponse[], siembras: SiembraResponse[]) {
  const totals = new Map<string, number>();
  siembras.forEach((item) => {
    const key = item.lote?.codigo || 'Sin lote';
    totals.set(key, (totals.get(key) || 0) + valueOf(item.cantidadRegistrada));
  });

  if (totals.size === 0) {
    lotes.slice(0, 5).forEach((lote) => totals.set(lote.codigo, 0));
  }

  const bars = [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 5);
  const max = Math.max(...bars.map((item) => item.value), 1);
  return { bars, max };
}

export function DashboardPage({ dashboard, lotes, camas, siembras, procesos, clasificaciones, despachos, trazabilidad }: DashboardPageProps) {
  const summary = dashboard?.summary;
  const activeLots = summary?.lotesActivos || lotes.filter((lote) => (lote.estado || '').toUpperCase() === 'ACTIVO').length;
  const activeBeds = summary?.camasActivas || camas.filter((cama) => (cama.estado || '').toUpperCase() === 'ACTIVA').length;
  const planted = summary?.plantasSembradas || siembras.reduce((total, item) => total + valueOf(item.cantidadRegistrada), 0);
  const dispatches = summary?.despachosRegistrados || despachos.length;
  const shipped = summary?.plantasDespachadas || despachos.reduce((total, item) => total + valueOf(item.cantidadDespachada), 0);
  const selectedTrace = byLatestDate(trazabilidad, (item) => item.ultimoEvento)[0];
  const recentLots = byLatestDate(lotes, (item) => recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaRegistro)).slice(0, 5);
  const rendimiento = buildRendimiento(lotes, siembras);

  const recentActivity: ActivityEntry[] = [
    ...despachos.map((item) => ({
      id: `despacho-${item.id}`,
      tone: 'purple' as ActivityTone,
      title: `Despacho registrado`,
      meta: `${item.lote?.codigo || 'Lote'} · ${numberCompact(item.cantidadDespachada)} plantas`,
      time: dateShort(recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaDespacho)),
      icon: Truck
    })),
    ...siembras.map((item) => ({
      id: `siembra-${item.id}`,
      tone: 'green' as ActivityTone,
      title: `Siembra registrada`,
      meta: `${item.lote?.codigo || 'Lote'} · ${numberCompact(item.cantidadRegistrada)} plantas`,
      time: dateShort(recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaSiembra)),
      icon: Sprout
    })),
    ...(procesos?.uniformizaciones.items || []).map((item) => ({
      id: `uniformizacion-${item.id}`,
      tone: 'amber' as ActivityTone,
      title: `Uniformización completada`,
      meta: `${item.lote?.codigo || 'Lote'} · ${item.cama?.codigo || 'Cama'}`,
      time: dateShort(recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaUniformizacion)),
      icon: Leaf
    })),
    ...clasificaciones.map((item) => ({
      id: `clasificacion-${item.id}`,
      tone: 'slate' as ActivityTone,
      title: `Clasificación registrada`,
      meta: `${item.lote?.codigo || 'Lote'} · ${numberCompact(item.cantidad)} plantas`,
      time: dateShort(recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaClasificacion)),
      icon: Tag
    }))
  ].slice(0, 4);

  const alerts = [
    {
      icon: AlertTriangle,
      tone: 'amber',
      title: clasificaciones.filter((item) => /PENDIENTE|OBSERVADA/i.test(item.estado || '')).length > 0 ? 'Clasificación pendiente' : 'Control operativo',
      text: clasificaciones.filter((item) => /PENDIENTE|OBSERVADA/i.test(item.estado || '')).length > 0
        ? 'Existen registros que requieren revisión de calidad.'
        : 'Los registros principales se encuentran disponibles.',
      time: 'Actual'
    },
    {
      icon: Route,
      tone: 'purple',
      title: 'Trazabilidad disponible',
      text: `${trazabilidad.length} lotes cuentan con seguimiento consolidado.`,
      time: 'Sistema'
    },
    {
      icon: CheckCircle2,
      tone: 'green',
      title: 'Despachos registrados',
      text: `${dispatches} movimientos de despacho cargados desde la base de datos.`,
      time: 'Sistema'
    }
  ] as const;

  const metricCards = [
    { label: 'Lotes activos', value: activeLots, detail: `${lotes.length} lotes registrados`, icon: Leaf, tone: 'green', spark: 'M2 28 C14 24 18 32 30 18 S52 22 62 9' },
    { label: 'Camas operativas', value: activeBeds, detail: `${camas.length} camas registradas`, icon: Sprout, tone: 'green', spark: 'M2 30 C12 26 18 30 26 18 S42 8 62 15' },
    { label: 'Siembras registradas', value: siembras.length, detail: `${numberCompact(planted)} plantas`, icon: Factory, tone: 'purple', spark: 'M2 27 C15 24 20 19 31 23 S51 16 62 7' },
    { label: 'Despachos del día', value: dispatches, detail: `${numberCompact(shipped)} plantas enviadas`, icon: Truck, tone: 'purple', spark: 'M2 31 C12 18 22 29 32 17 S51 10 62 14' }
  ];

  return (
    <main className="content-grid dashboard-screen dashboard-screen--vlv">
      <section className="vlv-dashboard-title">
        <div>
          <h1>Panel principal</h1>
          <p>Resumen general de operaciones</p>
        </div>
        <span>Datos sincronizados desde MySQL</span>
      </section>

      <section className="vlv-metric-grid">
        {metricCards.map((metric) => {
          const Icon = metric.icon;
          return (
            <article className={`vlv-metric-card vlv-metric-card--${metric.tone}`} key={metric.label}>
              <div className="vlv-metric-card__icon"><Icon size={28} /></div>
              <div className="vlv-metric-card__body">
                <span>{metric.label}</span>
                <strong>{numberCompact(metric.value)}</strong>
                <small>↑ Operativo · {metric.detail}</small>
              </div>
              <svg className="vlv-metric-card__spark" viewBox="0 0 64 36" aria-hidden="true">
                <path d={metric.spark} />
              </svg>
            </article>
          );
        })}
      </section>

      <section className="vlv-dashboard-main-grid">
        <article className="vlv-panel-card vlv-panel-card--table">
          <header className="vlv-panel-header">
            <div>
              <ClipboardList size={18} />
              <h2>Lotes recientes</h2>
            </div>
            <button type="button">Ver todos</button>
          </header>

          <div className="vlv-table-wrap">
            <table className="vlv-table">
              <thead>
                <tr>
                  <th>Lote</th>
                  <th>Variedad</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Responsable</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {recentLots.length > 0 ? recentLots.map((lote) => (
                  <tr key={lote.id}>
                    <td>{lote.codigo}</td>
                    <td>{lote.variedad || lote.cultivo || 'Sin variedad'}</td>
                    <td><span className={`vlv-status vlv-status--${statusClass(lote.estado)}`}>{lote.estado || 'Sin estado'}</span></td>
                    <td>{dateShort(recordDate(lote.fechaActualizacion, lote.fechaCreacion, lote.fechaRegistro))}</td>
                    <td>{actorName(lote)}</td>
                    <td><button className="vlv-row-action" type="button" aria-label="Ver acciones"><MoreVertical size={16} /></button></td>
                  </tr>
                )) : (
                  <tr><td colSpan={6}>No hay lotes registrados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="vlv-panel-card vlv-trace-card">
          <header className="vlv-panel-header">
            <div>
              <Route size={18} />
              <h2>Trazabilidad por lote</h2>
            </div>
            <button type="button">Ver detalle</button>
          </header>

          <div className="vlv-trace-card__title">
            <strong>{selectedTrace?.lote?.codigo || 'Sin lote seleccionado'}</strong>
            <span>{selectedTrace?.lote?.descripcion || 'Seguimiento consolidado'}</span>
          </div>

          <div className="vlv-trace-line">
            {traceProgress(selectedTrace).map((step) => {
              const Icon = step.icon;
              return (
                <div className={step.active ? 'vlv-trace-step vlv-trace-step--active' : 'vlv-trace-step'} key={step.label}>
                  <span><Icon size={18} /></span>
                  <strong>{step.label}</strong>
                  <small>{step.active ? monthName(selectedTrace?.ultimoEvento) : 'Pendiente'}</small>
                </div>
              );
            })}
          </div>

          <div className="vlv-trace-summary">
            <div>
              <span>Estado actual</span>
              <strong>{valueOf(selectedTrace?.despachos) > 0 ? 'Despachado' : valueOf(selectedTrace?.clasificaciones) > 0 ? 'Clasificado' : 'En producción'}</strong>
            </div>
            <div>
              <span>Último evento</span>
              <strong>{dateShort(selectedTrace?.ultimoEvento)}</strong>
            </div>
          </div>
        </article>
      </section>

      <section className="vlv-dashboard-bottom-grid">
        <article className="vlv-panel-card vlv-bars-card">
          <header className="vlv-panel-header">
            <div>
              <Factory size={18} />
              <h2>Rendimiento agrícola</h2>
            </div>
            <button type="button">Esta semana</button>
          </header>
          <div className="vlv-bars">
            {rendimiento.bars.length > 0 ? rendimiento.bars.map((bar) => (
              <div className="vlv-bar" key={bar.label}>
                <span style={{ height: `${Math.max((bar.value / rendimiento.max) * 100, bar.value > 0 ? 10 : 2)}%` }} />
                <strong>{numberCompact(bar.value)}</strong>
                <small>{bar.label}</small>
              </div>
            )) : <p className="vlv-muted">Sin datos de rendimiento.</p>}
          </div>
        </article>

        <article className="vlv-panel-card vlv-activity-card">
          <header className="vlv-panel-header">
            <div>
              <PackageCheck size={18} />
              <h2>Actividad reciente</h2>
            </div>
          </header>
          <div className="vlv-activity-list">
            {recentActivity.length > 0 ? recentActivity.map((entry) => {
              const Icon = entry.icon;
              return (
                <article className={`vlv-activity-item vlv-activity-item--${entry.tone}`} key={entry.id}>
                  <span><Icon size={18} /></span>
                  <div>
                    <strong>{entry.title}</strong>
                    <small>{entry.meta}</small>
                  </div>
                  <time>{entry.time}</time>
                </article>
              );
            }) : <p className="vlv-muted">Sin actividad reciente.</p>}
          </div>
        </article>

        <article className="vlv-panel-card vlv-alert-card">
          <header className="vlv-panel-header">
            <div>
              <AlertTriangle size={18} />
              <h2>Alertas y notificaciones</h2>
            </div>
            <button type="button">Ver todas</button>
          </header>
          <div className="vlv-alert-list">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <article className={`vlv-alert-item vlv-alert-item--${alert.tone}`} key={alert.title}>
                  <span><Icon size={18} /></span>
                  <div>
                    <strong>{alert.title}</strong>
                    <small>{alert.text}</small>
                  </div>
                  <time>{alert.time}</time>
                </article>
              );
            })}
          </div>
        </article>
      </section>
    </main>
  );
}
