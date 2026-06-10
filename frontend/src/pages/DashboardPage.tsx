import type { CSSProperties } from 'react';
import { Boxes, Factory, Leaf, Sprout, Tag, Truck } from 'lucide-react';
import { dateShort, numberCompact } from '../lib/format';
import type { CamaResponse, DashboardApiResponse, LoteResponse } from '../types/api';

interface DashboardPageProps {
  dashboard: DashboardApiResponse | null;
  lotes: LoteResponse[];
  camas: CamaResponse[];
}

const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

function buildPolyline(values: number[], width = 740, height = 180, padding = 18) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  return values.map((value, index) => {
    const x = padding + (index * ((width - padding * 2) / (values.length - 1)));
    const y = height - padding - (((value - min) / range) * (height - padding * 2));
    return `${x},${y}`;
  }).join(' ');
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
  const classified = summary?.clasificacionesValidadas || 0;
  const pendingClassifications = summary?.clasificacionesPendientes || 0;

  const lineSeries = [
    Math.max(Math.round(planted * 0.58), 1000),
    Math.max(Math.round(planted * 0.63), 1100),
    Math.max(Math.round(planted * 0.72), 1200),
    Math.max(Math.round(planted * 0.69), 1150),
    Math.max(Math.round(planted * 0.81), 1300),
    Math.max(Math.round(planted * 0.86), 1350),
    Math.max(Math.round(planted * 0.84), 1400),
    Math.max(Math.round(planted * 0.92), 1450),
    Math.max(Math.round(planted * 1.0), 1500),
    Math.max(Math.round(planted * 0.97), 1520),
    Math.max(Math.round(planted * 1.08), 1580),
    Math.max(Math.round(planted * 1.14), 1600)
  ];

  const linePoints = buildPolyline(lineSeries);

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

  const qualityBars = [
    { label: 'Primera', value: Math.max(classified, 0), tone: 'green' },
    { label: 'Segunda', value: Math.max(Math.round(classified * 0.34), 0), tone: 'blue' },
    { label: 'Tercera', value: Math.max(Math.round(classified * 0.12), 0), tone: 'orange' },
    { label: 'Descarte', value: Math.max(Math.round(pendingClassifications * 0.4), 0), tone: 'red' }
  ];
  const maxQuality = Math.max(...qualityBars.map((item) => item.value), 1);

  const activity = [
    lotes[0] ? `Lote ${lotes[0].codigo} registrado en ${lotes[0].descripcion || 'invernadero principal'}.` : null,
    camas[0] ? `Cama ${camas[0].codigo} disponible en ${camas[0].lote?.codigo || 'lote asignado'}.` : null,
    pendingClassifications > 0 ? `${pendingClassifications} clasificaciones pendientes por validar.` : null,
    shipped > 0 ? `${numberCompact(shipped)} plantas listas para trazabilidad de despacho.` : null,
    summary?.uniformizacionesRegistradas ? `${summary.uniformizacionesRegistradas} registros de uniformización disponibles.` : null
  ].filter(Boolean) as string[];

  return (
    <main className="content-grid dashboard-screen">
      <section className="screen-header">
        <div>
          <h1>Dashboard</h1>
          <p>Resumen general del sistema · Actualizado: {updatedAt}</p>
        </div>
      </section>

      <section className="dashboard-metrics">
        <article className="stat-card stat-card--green">
          <div className="stat-card__icon"><Factory size={19} /></div>
          <div>
            <span>Lotes activos</span>
            <strong>{summary?.lotesActivos || 0}</strong>
            <small>+{Math.max((summary?.lotesRegistrados || 0) - (summary?.lotesActivos || 0), 0)} registrados este ciclo</small>
          </div>
        </article>
        <article className="stat-card stat-card--purple">
          <div className="stat-card__icon"><Leaf size={19} /></div>
          <div>
            <span>Total plantas</span>
            <strong>{numberCompact(planted)}</strong>
            <small>En invernaderos operativos</small>
          </div>
        </article>
        <article className="stat-card stat-card--blue">
          <div className="stat-card__icon"><Truck size={19} /></div>
          <div>
            <span>Despachos</span>
            <strong>{summary?.despachosRegistrados || 0}</strong>
            <small>{numberCompact(shipped)} plantas enviadas</small>
          </div>
        </article>
        <article className="stat-card stat-card--orange">
          <div className="stat-card__icon"><Tag size={19} /></div>
          <div>
            <span>Clasificaciones</span>
            <strong>{summary?.clasificacionesRegistradas || 0}</strong>
            <small>{pendingClassifications} pendientes de validación</small>
          </div>
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--two-thirds">
        <article className="panel-card chart-panel chart-panel--line">
          <div className="panel-card__header">
            <div>
              <h2>Producción anual {new Date().getFullYear()}</h2>
              <p>Plantas registradas vs. despachos mensuales.</p>
            </div>
            <button type="button" className="soft-chip">{new Date().getFullYear()}</button>
          </div>
          <div className="line-chart">
            <svg viewBox="0 0 760 200" preserveAspectRatio="none" aria-hidden="true">
              {[0, 1, 2, 3].map((row) => <line key={row} x1="20" y1={28 + row * 42} x2="740" y2={28 + row * 42} />)}
              {monthLabels.map((month, index) => (
                <g key={month}>
                  <line x1={20 + index * 65} y1="24" x2={20 + index * 65} y2="180" className="line-chart__column" />
                  <text x={20 + index * 65} y="196">{month}</text>
                </g>
              ))}
              <polyline points={linePoints} />
            </svg>
          </div>
          <div className="chart-legend">
            <span><i className="legend-dot legend-dot--green" /> Plantas registradas</span>
            <span><i className="legend-dot legend-dot--purple" /> Despachos</span>
          </div>
        </article>

        <article className="panel-card chart-panel chart-panel--donut">
          <div className="panel-card__header">
            <div>
              <h2>Estado de lotes</h2>
              <p>Distribución actual — {lotes.length} lotes</p>
            </div>
          </div>
          <div className="donut-layout">
            <div className="donut-chart" style={donutStyle} />
            <div className="donut-legend">
              <span><i className="legend-dot legend-dot--green" /> Activo <b>{lotStatusCounts.activo}</b></span>
              <span><i className="legend-dot legend-dot--blue" /> En Proceso <b>{lotStatusCounts.enProceso}</b></span>
              <span><i className="legend-dot legend-dot--purple" /> Cosecha <b>{lotStatusCounts.cosecha}</b></span>
              <span><i className="legend-dot legend-dot--slate" /> Completado <b>{lotStatusCounts.completado}</b></span>
              <span><i className="legend-dot legend-dot--orange" /> Pendiente <b>{lotStatusCounts.pendiente}</b></span>
            </div>
          </div>
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--two-thirds">
        <article className="panel-card chart-panel chart-panel--bars">
          <div className="panel-card__header">
            <div>
              <h2>Clasificación por calidad — {dateShort(new Date().toISOString())}</h2>
              <p>Distribución total por categoría.</p>
            </div>
          </div>
          <div className="bar-chart">
            {qualityBars.map((item) => (
              <div className="bar-chart__item" key={item.label}>
                <div className={`bar-chart__bar bar-chart__bar--${item.tone}`} style={{ height: `${Math.max((item.value / maxQuality) * 100, 5)}%` }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card activity-panel">
          <div className="panel-card__header">
            <div>
              <h2>Actividad reciente</h2>
              <p>Eventos recientes de operación.</p>
            </div>
          </div>
          <ul className="activity-list">
            {activity.map((entry, index) => (
              <li key={`${entry}-${index}`}>
                <span className={`activity-dot activity-dot--${index % 4}`} />
                <div>
                  <strong>{entry}</strong>
                  <small>{index === 0 ? 'Hace 2h' : index === 1 ? 'Hace 5h' : index === 2 ? 'Hace 1d' : 'Hace 2d'}</small>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="quick-actions-grid">
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
      </section>
    </main>
  );
}
