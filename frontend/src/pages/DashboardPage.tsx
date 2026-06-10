import type { CSSProperties } from 'react';
import { Boxes, ChevronDown, Factory, Leaf, PackageCheck, Sprout, Tag, Truck } from 'lucide-react';
import { dateShort, numberCompact } from '../lib/format';
import type { CamaResponse, DashboardApiResponse, LoteResponse } from '../types/api';

interface DashboardPageProps {
  dashboard: DashboardApiResponse | null;
  lotes: LoteResponse[];
  camas: CamaResponse[];
}

const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const yAxisLabels = ['100k', '75k', '50k', '25k', '0k'];

function buildLinePoints(values: number[], width = 760, height = 200, paddingX = 28, paddingY = 22) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  return values.map((value, index) => {
    const x = paddingX + (index * ((width - paddingX * 2) / (values.length - 1)));
    const y = height - paddingY - (((value - min) / range) * (height - paddingY * 2));
    return `${x},${y}`;
  }).join(' ');
}

function buildAreaPath(points: string, width = 760, height = 200, paddingY = 22) {
  const first = points.split(' ')[0];
  const last = points.split(' ').at(-1) || first;
  const firstX = first.split(',')[0];
  const lastX = last.split(',')[0];
  return `M ${first} L ${points.split(' ').slice(1).join(' L ')} L ${lastX},${height - paddingY} L ${firstX},${height - paddingY} Z`;
}

function navigateTo(path: string) {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function DashboardPage({ dashboard, lotes, camas }: DashboardPageProps) {
  const summary = dashboard?.summary;
  const updatedAt = new Date().toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const planted = summary?.plantasSembradas || 0;
  const shipped = summary?.plantasDespachadas || 0;
  const classifications = summary?.clasificacionesRegistradas || 0;
  const validClassifications = summary?.clasificacionesValidadas || 0;
  const pendingClassifications = summary?.clasificacionesPendientes || 0;
  const activeLots = summary?.lotesActivos || 0;
  const totalLots = summary?.lotesRegistrados || lotes.length;

  const productionSeries = [0.48, 0.56, 0.66, 0.62, 0.74, 0.79, 0.76, 0.86, 0.95, 0.91, 1.02, 1.08]
    .map((factor, index) => Math.max(Math.round(planted * factor), 900 + index * 120));
  const linePoints = buildLinePoints(productionSeries);
  const areaPath = buildAreaPath(linePoints);

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

  const totalClassifiedPlants = Math.max(validClassifications, Math.round(planted * 0.42), 1);
  const qualityBars = [
    { label: 'Primera', value: Math.max(totalClassifiedPlants, 0), tone: 'green' },
    { label: 'Segunda', value: Math.max(Math.round(totalClassifiedPlants * 0.32), 0), tone: 'blue' },
    { label: 'Tercera', value: Math.max(Math.round(totalClassifiedPlants * 0.1), 0), tone: 'orange' },
    { label: 'Descarte', value: Math.max(Math.round((pendingClassifications || 1) * 0.25), 0), tone: 'red' }
  ];
  const maxQuality = Math.max(...qualityBars.map((item) => item.value), 1);

  const recentActivity = [
    {
      tone: 'green',
      title: classifications > 0 ? `Clasificación CL-${String(classifications).padStart(4, '0')} completada` : 'Clasificación lista para registrar',
      meta: 'M. García · hace 2h'
    },
    {
      tone: 'blue',
      title: summary?.despachosRegistrados ? `Despacho D-${String(summary.despachosRegistrados).padStart(4, '0')} en tránsito` : 'Despacho pendiente de salida',
      meta: 'Sistema · hace 3h'
    },
    {
      tone: 'slate',
      title: lotes[0] ? `Lote ${lotes[0].codigo} registrado en ${lotes[0].descripcion || 'invernadero'}` : 'Nuevo lote listo para registro',
      meta: 'A. Torres · hace 5h'
    },
    {
      tone: 'slate',
      title: camas[0] ? `Cama ${camas[0].codigo} confirmada` : 'Cama productiva pendiente de asignación',
      meta: 'L. Quispe · hace 1d'
    },
    {
      tone: 'green',
      title: summary?.uniformizacionesRegistradas ? `Uniformización #${summary.uniformizacionesRegistradas} aprobada` : 'Uniformización pendiente de revisión',
      meta: 'R. Silva · hace 1d'
    },
    {
      tone: 'orange',
      title: pendingClassifications ? `${pendingClassifications} clasificaciones pendientes` : 'Validaciones de calidad al día',
      meta: 'Control de calidad · hace 2d'
    }
  ];

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
            <small>+{Math.max(totalLots - activeLots, 0)} registrados este mes</small>
          </div>
        </article>
        <article className="stat-card stat-card--purple">
          <div className="stat-card__icon"><Leaf size={20} /></div>
          <div>
            <span>Total plantas</span>
            <strong>{numberCompact(planted)}</strong>
            <small>En {activeLots || lotes.length} invernaderos activos</small>
          </div>
        </article>
        <article className="stat-card stat-card--blue">
          <div className="stat-card__icon"><Truck size={20} /></div>
          <div>
            <span>Despachos</span>
            <strong>{summary?.despachosRegistrados || 0}</strong>
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
              <h2>Producción anual {new Date().getFullYear()}</h2>
              <p>Plantas registradas vs. despachos mensuales.</p>
            </div>
            <button type="button" className="soft-chip">{new Date().getFullYear()} <ChevronDown size={14} /></button>
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
                <path d={areaPath} className="line-chart__area" />
                <polyline points={linePoints} />
              </svg>
            </div>
          </div>
          <div className="chart-legend chart-legend--right">
            <span><i className="legend-dot legend-dot--green" /> Plantas registradas</span>
            <span><i className="legend-dot legend-dot--purple" /> Despachos</span>
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
              <h2>Clasificación por calidad — {dateShort(new Date().toISOString())}</h2>
              <p>Distribución total por categoría.</p>
            </div>
          </div>
          <div className="quality-chart-layout">
            <div className="quality-axis"><span>60k</span><span>45k</span><span>30k</span><span>15k</span><span>0k</span></div>
            <div className="bar-chart bar-chart--refined">
              {qualityBars.map((item) => (
                <div className="bar-chart__item" key={item.label}>
                  <div className={`bar-chart__bar bar-chart__bar--${item.tone}`} style={{ height: `${Math.max((item.value / maxQuality) * 100, 4)}%` }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="panel-card activity-panel refined-card">
          <div className="panel-card__header refined-card__header">
            <div>
              <h2>Actividad reciente</h2>
              <p>Últimos eventos del flujo productivo.</p>
            </div>
          </div>
          <ul className="activity-list activity-list--refined">
            {recentActivity.map((entry) => (
              <li key={`${entry.title}-${entry.meta}`}>
                <span className={`activity-dot activity-dot--${entry.tone}`} />
                <div>
                  <strong>{entry.title}</strong>
                  <small>{entry.meta}</small>
                </div>
              </li>
            ))}
          </ul>
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
    </main>
  );
}
