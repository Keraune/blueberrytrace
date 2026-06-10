import type { CSSProperties } from 'react';
import { Boxes, ChevronDown, Factory, Leaf, PackageCheck, Sprout, Tag, Truck } from 'lucide-react';
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

type ActivityTone = 'green' | 'blue' | 'orange' | 'purple' | 'slate' | 'red';

interface ActivityEntry {
  id: string;
  tone: ActivityTone;
  title: string;
  meta: string;
  date: string | null;
}

const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function valueOf(value: number | null | undefined) {
  return Number.isFinite(value || 0) ? Number(value || 0) : 0;
}

function monthIndex(value: string | null | undefined) {
  if (!value) {
    return -1;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return -1;
  }

  return parsed.getMonth();
}

function buildLinePoints(values: number[], maxValue: number, width = 760, height = 200, paddingX = 28, paddingY = 22) {
  const safeMax = Math.max(maxValue, 1);
  return values.map((value, index) => {
    const x = paddingX + (index * ((width - paddingX * 2) / Math.max(values.length - 1, 1)));
    const y = height - paddingY - ((value / safeMax) * (height - paddingY * 2));
    return `${x},${y}`;
  }).join(' ');
}

function buildAreaPath(points: string, height = 200, paddingY = 22) {
  const parts = points.split(' ');
  const first = parts[0];
  const last = parts.at(-1) || first;
  const firstX = first.split(',')[0];
  const lastX = last.split(',')[0];
  return `M ${first} L ${parts.slice(1).join(' L ')} L ${lastX},${height - paddingY} L ${firstX},${height - paddingY} Z`;
}

function axisLabels(maxValue: number) {
  const safeMax = Math.max(maxValue, 1);
  return [safeMax, safeMax * 0.75, safeMax * 0.5, safeMax * 0.25, 0].map((value) => numberCompact(Math.round(value)));
}

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function qualityBucket(item: ClasificacionResponse) {
  const source = `${item.estadoPlanta || ''} ${item.condicion || ''} ${item.tamano || ''}`.toLowerCase();

  if (/descarte|rechaz|no apt|dañ|enfer/i.test(source)) {
    return 'Descarte';
  }

  if (/primera|óptimo|optimo|excelente|apta/i.test(source)) {
    return 'Primera';
  }

  if (/segunda|bueno|media|mediano/i.test(source)) {
    return 'Segunda';
  }

  if (/tercera|regular|bajo|pequeño|pequeno/i.test(source)) {
    return 'Tercera';
  }

  return 'Sin clasificar';
}

function recordDate(...values: Array<string | null | undefined>) {
  return values.find(Boolean) || null;
}

function actorName(value: { usuarioRegistro?: { nombreCompleto?: string | null } | null }) {
  return value.usuarioRegistro?.nombreCompleto || 'Sistema';
}

function byRecent(left: ActivityEntry, right: ActivityEntry) {
  return new Date(right.date || 0).getTime() - new Date(left.date || 0).getTime();
}

export function DashboardPage({ dashboard, lotes, camas, siembras, procesos, clasificaciones, despachos, trazabilidad }: DashboardPageProps) {
  const summary = dashboard?.summary;
  const updatedAt = new Date().toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const planted = summary?.plantasSembradas || siembras.reduce((total, item) => total + valueOf(item.cantidadRegistrada), 0);
  const shipped = summary?.plantasDespachadas || despachos.reduce((total, item) => total + valueOf(item.cantidadDespachada), 0);
  const classifications = summary?.clasificacionesRegistradas || clasificaciones.length;
  const pendingClassifications = summary?.clasificacionesPendientes || clasificaciones.filter((item) => /PENDIENTE|OBSERVADA/i.test(item.estado || '')).length;
  const activeLots = summary?.lotesActivos || lotes.filter((lote) => (lote.estado || '').toUpperCase() === 'ACTIVO').length;
  const totalLots = summary?.lotesRegistrados || lotes.length;
  const newLotsThisMonth = lotes.filter((lote) => {
    const date = new Date(lote.fechaRegistro || lote.fechaCreacion || '');
    return !Number.isNaN(date.getTime()) && date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  const plantedByMonth = Array.from({ length: 12 }, () => 0);
  const shippedByMonth = Array.from({ length: 12 }, () => 0);
  siembras.forEach((item) => {
    const index = monthIndex(item.fechaSiembra || item.fechaCreacion);
    if (index >= 0) {
      plantedByMonth[index] += valueOf(item.cantidadRegistrada);
    }
  });
  despachos.forEach((item) => {
    const index = monthIndex(item.fechaDespacho || item.fechaCreacion);
    if (index >= 0) {
      shippedByMonth[index] += valueOf(item.cantidadDespachada);
    }
  });

  const monthlyMax = Math.max(...plantedByMonth, ...shippedByMonth, 1);
  const hasMonthlyData = plantedByMonth.some(Boolean) || shippedByMonth.some(Boolean);
  const plantPoints = buildLinePoints(plantedByMonth, monthlyMax);
  const dispatchPoints = buildLinePoints(shippedByMonth, monthlyMax);
  const areaPath = buildAreaPath(plantPoints);
  const yAxisLabels = axisLabels(monthlyMax);

  const lotStatusCounts = {
    activo: lotes.filter((lote) => (lote.estado || '').toUpperCase() === 'ACTIVO').length,
    enProceso: lotes.filter((lote) => /PROCESO|MANTENIMIENTO/i.test(lote.estado || '')).length,
    cosecha: lotes.filter((lote) => /COSECHA/i.test(lote.estado || '')).length,
    completado: lotes.filter((lote) => /COMPLETADO|INACTIVO/i.test(lote.estado || '')).length,
    pendiente: lotes.filter((lote) => /PENDIENTE/i.test(lote.estado || '')).length
  };
  const totalStatus = Object.values(lotStatusCounts).reduce((total, value) => total + value, 0) || 1;
  const donutStyle = {
    '--activo': `${(lotStatusCounts.activo / totalStatus) * 360}deg`,
    '--proceso': `${(lotStatusCounts.enProceso / totalStatus) * 360}deg`,
    '--cosecha': `${(lotStatusCounts.cosecha / totalStatus) * 360}deg`,
    '--completado': `${(lotStatusCounts.completado / totalStatus) * 360}deg`
  } as CSSProperties;

  const qualityTotals = clasificaciones.reduce<Record<string, number>>((accumulator, item) => {
    const bucket = qualityBucket(item);
    accumulator[bucket] = (accumulator[bucket] || 0) + valueOf(item.cantidad);
    return accumulator;
  }, { Primera: 0, Segunda: 0, Tercera: 0, Descarte: 0 });
  const qualityBars = [
    { label: 'Primera', value: qualityTotals.Primera || 0, tone: 'green' },
    { label: 'Segunda', value: qualityTotals.Segunda || 0, tone: 'blue' },
    { label: 'Tercera', value: qualityTotals.Tercera || 0, tone: 'orange' },
    { label: 'Descarte', value: qualityTotals.Descarte || 0, tone: 'red' }
  ];
  const maxQuality = Math.max(...qualityBars.map((item) => item.value), 1);
  const hasQualityData = qualityBars.some((item) => item.value > 0);

  const recentActivity: ActivityEntry[] = [
    ...lotes.map((item) => ({
      id: `lote-${item.id}`,
      tone: 'green' as ActivityTone,
      title: `Lote ${item.codigo} · ${item.estado || 'sin estado'}`,
      meta: `${actorName(item)} · ${dateShort(recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaRegistro))}`,
      date: recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaRegistro)
    })),
    ...siembras.map((item) => ({
      id: `siembra-${item.id}`,
      tone: 'blue' as ActivityTone,
      title: `Siembra #${item.id} · ${numberCompact(item.cantidadRegistrada)} plantas`,
      meta: `${actorName(item)} · ${dateShort(recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaSiembra))}`,
      date: recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaSiembra)
    })),
    ...(procesos?.uniformizaciones.items || []).map((item) => ({
      id: `uniformizacion-${item.id}`,
      tone: 'purple' as ActivityTone,
      title: `Uniformización #${item.id} · ${item.estado || 'sin estado'}`,
      meta: `${actorName(item)} · ${dateShort(recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaUniformizacion))}`,
      date: recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaUniformizacion)
    })),
    ...clasificaciones.map((item) => ({
      id: `clasificacion-${item.id}`,
      tone: (item.estado && /PENDIENTE|OBSERVADA/i.test(item.estado) ? 'orange' : 'green') as ActivityTone,
      title: `Clasificación #${item.id} · ${item.estado || 'sin estado'}`,
      meta: `${actorName(item)} · ${dateShort(recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaClasificacion))}`,
      date: recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaClasificacion)
    })),
    ...despachos.map((item) => ({
      id: `despacho-${item.id}`,
      tone: 'blue' as ActivityTone,
      title: `Despacho #${item.id} · ${numberCompact(item.cantidadDespachada)} plantas`,
      meta: `${actorName(item)} · ${dateShort(recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaDespacho))}`,
      date: recordDate(item.fechaActualizacion, item.fechaCreacion, item.fechaDespacho)
    }))
  ].sort(byRecent).slice(0, 6);

  return (
    <main className="content-grid dashboard-screen dashboard-screen--refined">
      <section className="screen-header dashboard-header-refined">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general del sistema · Actualizado: {updatedAt}</p>
        </div>
      </section>

      <section className="dashboard-metrics dashboard-metrics--refined">
        <article className="stat-card stat-card--green">
          <div className="stat-card__icon"><Factory size={20} /></div>
          <div>
            <span>Lotes activos</span>
            <strong>{activeLots}</strong>
            <small>{newLotsThisMonth} registrados este mes · {totalLots} total</small>
          </div>
        </article>
        <article className="stat-card stat-card--purple">
          <div className="stat-card__icon"><Leaf size={20} /></div>
          <div>
            <span>Total plantas</span>
            <strong>{numberCompact(planted)}</strong>
            <small>{summary?.siembrasRegistradas || siembras.length} siembras registradas</small>
          </div>
        </article>
        <article className="stat-card stat-card--blue">
          <div className="stat-card__icon"><Truck size={20} /></div>
          <div>
            <span>Despachos</span>
            <strong>{summary?.despachosRegistrados || despachos.length}</strong>
            <small>{numberCompact(shipped)} plantas enviadas</small>
          </div>
        </article>
        <article className="stat-card stat-card--orange">
          <div className="stat-card__icon"><Tag size={20} /></div>
          <div>
            <span>Clasificaciones</span>
            <strong>{classifications}</strong>
            <small>{pendingClassifications} pendientes de validación</small>
          </div>
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--main">
        <article className="panel-card chart-panel chart-panel--line refined-card">
          <div className="panel-card__header refined-card__header">
            <div>
              <h2>Producción anual {currentYear}</h2>
              <p>Plantas registradas y despachadas según registros reales.</p>
            </div>
            <button type="button" className="soft-chip">{currentYear} <ChevronDown size={14} /></button>
          </div>
          <div className="chart-with-axis">
            <div className="chart-y-axis">
              {yAxisLabels.map((label) => <span key={label}>{label}</span>)}
            </div>
            <div className="line-chart line-chart--refined">
              <svg viewBox="0 0 760 210" preserveAspectRatio="none" aria-hidden="true">
                <defs>
                  <linearGradient id="productionGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[0, 1, 2, 3, 4].map((row) => <line key={row} x1="24" y1={22 + row * 40} x2="736" y2={22 + row * 40} />)}
                {monthLabels.map((month, index) => (
                  <g key={month}>
                    <line x1={28 + index * 64} y1="22" x2={28 + index * 64} y2="180" className="line-chart__column" />
                    <text x={28 + index * 64} y="203">{month}</text>
                  </g>
                ))}
                {hasMonthlyData ? (
                  <>
                    <path d={areaPath} className="line-chart__area" />
                    <polyline points={plantPoints} />
                    <polyline points={dispatchPoints} className="line-chart__secondary" />
                  </>
                ) : null}
              </svg>
              {!hasMonthlyData ? (
                <div className="chart-empty-state">
                  <strong>Sin datos mensuales suficientes</strong>
                  <small>Registra siembras y despachos para construir la tendencia anual.</small>
                </div>
              ) : null}
            </div>
          </div>
          <div className="chart-legend chart-legend--right">
            <span><i className="legend-dot legend-dot--green" /> Plantas registradas</span>
            <span><i className="legend-dot legend-dot--purple" /> Plantas despachadas</span>
          </div>
        </article>

        <article className="panel-card chart-panel chart-panel--donut refined-card">
          <div className="panel-card__header refined-card__header">
            <div>
              <h2>Estado de lotes</h2>
              <p>Distribución actual — {lotes.length} lotes</p>
            </div>
          </div>
          <div className="donut-layout donut-layout--refined">
            <div className="donut-chart donut-chart--refined" style={donutStyle}>
              <span>{Math.round((activeLots / Math.max(totalLots, 1)) * 100)}%</span>
            </div>
            <div className="donut-legend donut-legend--refined">
              <span><i className="legend-dot legend-dot--green" /> Activo <b>{lotStatusCounts.activo}</b></span>
              <span><i className="legend-dot legend-dot--blue" /> En Proceso <b>{lotStatusCounts.enProceso}</b></span>
              <span><i className="legend-dot legend-dot--purple" /> Cosecha <b>{lotStatusCounts.cosecha}</b></span>
              <span><i className="legend-dot legend-dot--slate" /> Completado <b>{lotStatusCounts.completado}</b></span>
              <span><i className="legend-dot legend-dot--orange" /> Pendiente <b>{lotStatusCounts.pendiente}</b></span>
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--main">
        <article className="panel-card chart-panel chart-panel--bars refined-card">
          <div className="panel-card__header refined-card__header">
            <div>
              <h2>Clasificación por calidad</h2>
              <p>Totales por categoría calculados desde las clasificaciones registradas.</p>
            </div>
          </div>
          <div className="quality-chart-layout">
            <div className="quality-axis">{axisLabels(maxQuality).map((label) => <span key={label}>{label}</span>)}</div>
            <div className="bar-chart bar-chart--refined">
              {qualityBars.map((item) => (
                <div className="bar-chart__item" key={item.label}>
                  <div className={`bar-chart__bar bar-chart__bar--${item.tone}`} style={{ height: `${hasQualityData ? Math.max((item.value / maxQuality) * 100, 4) : 0}%` }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            {!hasQualityData ? (
              <div className="chart-empty-state chart-empty-state--compact">
                <strong>Sin clasificación por calidad</strong>
                <small>Los valores aparecerán al registrar clasificaciones reales.</small>
              </div>
            ) : null}
          </div>
        </article>

        <article className="panel-card activity-panel refined-card">
          <div className="panel-card__header refined-card__header">
            <div>
              <h2>Actividad reciente</h2>
              <p>Últimos eventos cargados desde los registros del sistema.</p>
            </div>
          </div>
          {recentActivity.length > 0 ? (
            <ul className="activity-list activity-list--refined">
              {recentActivity.map((entry) => (
                <li key={entry.id}>
                  <span className={`activity-dot activity-dot--${entry.tone}`} />
                  <div>
                    <strong>{entry.title}</strong>
                    <small>{entry.meta}</small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state empty-state--compact">
              <PackageCheck size={24} />
              <strong>Sin actividad reciente</strong>
              <small>Los movimientos aparecerán cuando existan registros en MySQL.</small>
            </div>
          )}
        </article>
      </section>

      <section className="quick-actions-grid quick-actions-grid--refined">
        <button type="button" className="quick-action quick-action--green" onClick={() => navigateTo('/siembra')}>
          <Sprout size={16} /> Registrar siembra
        </button>
        <button type="button" className="quick-action quick-action--blue" onClick={() => navigateTo('/procesos')}>
          <Boxes size={16} /> Registrar uniformización
        </button>
        <button type="button" className="quick-action quick-action--purple" onClick={() => navigateTo('/clasificacion')}>
          <Tag size={16} /> Nueva clasificación
        </button>
        <button type="button" className="quick-action quick-action--orange" onClick={() => navigateTo('/despacho')}>
          <Truck size={16} /> Registrar despacho
        </button>
        <button type="button" className="quick-action quick-action--slate" onClick={() => navigateTo('/reportes')}>
          <PackageCheck size={16} /> Ver reportes
        </button>
      </section>

      <section className="data-origin-note">
        <strong>Fuente de datos</strong>
        <span>{trazabilidad.length} registros de trazabilidad disponibles desde la API.</span>
      </section>
    </main>
  );
}
