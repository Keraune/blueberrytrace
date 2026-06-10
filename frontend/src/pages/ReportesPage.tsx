import { useMemo, useState } from 'react';
import { BarChart3, Download, Eye, FileText, Leaf, Tags, Truck } from 'lucide-react';
import { ModuleHeader } from '../components/ModuleHeader';
import { numberCompact } from '../lib/format';
import type { TrazabilidadResponse } from '../types/api';

interface ReportesPageProps {
  trazabilidad: TrazabilidadResponse[];
}

const reportTypes = ['Producción por Lote', 'Clasificación', 'Despachos'];

export function ReportesPage({ trazabilidad }: ReportesPageProps) {
  const [reportType, setReportType] = useState(reportTypes[0]);
  const [lote, setLote] = useState('Todos los lotes');
  const rows = useMemo(() => trazabilidad.map((item, index) => ({ ...item, id: item.lote?.id || index + 1 })), [trazabilidad]);
  const monthly = useMemo(() => [45, 52, 60, 58, 67, 72], []);
  const maxMonthly = Math.max(...monthly, 1);

  const production = rows.reduce((total, item) => total + item.plantasSembradas, 0);
  const classification = rows.reduce((total, item) => total + item.clasificaciones, 0);
  const shipments = rows.reduce((total, item) => total + item.despachos, 0);

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Análisis"
        title="Reportes y Análisis"
        description="Generación y exportación de reportes por fecha, lote y clasificación."
      />

      <section className="panel-card report-parameter-card">
        <div className="panel-card__header"><div><h2>Parámetros del Reporte</h2></div></div>
        <div className="report-parameters-grid">
          <label>
            Tipo de reporte
            <select value={reportType} onChange={(event) => setReportType(event.target.value)}>
              {reportTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label>
            Fecha inicio
            <input type="date" defaultValue="2026-05-01" />
          </label>
          <label>
            Fecha fin
            <input type="date" defaultValue="2026-05-25" />
          </label>
          <label>
            Lote
            <select value={lote} onChange={(event) => setLote(event.target.value)}>
              <option>Todos los lotes</option>
              {rows.map((item) => <option key={item.id}>{item.lote?.codigo}</option>)}
            </select>
          </label>
        </div>
        <div className="button-group">
          <button type="button" className="action-button"><BarChart3 size={15} /> Generar Reporte</button>
          <button type="button" className="ghost-button"><Download size={15} /> Exportar Excel</button>
          <button type="button" className="ghost-button"><FileText size={15} /> Exportar PDF</button>
        </div>
      </section>

      <section className="report-card-grid">
        <article className="report-card">
          <span className="report-card__icon"><Leaf size={18} /></span>
          <h3>Reporte de Producción</h3>
          <p>Detalle de plantas por lote e invernadero. Incluye siembras, crecimientos y uniformizaciones.</p>
          <div className="report-card__footer"><span>{rows.length} lotes · {numberCompact(production)} plantas</span><div><button type="button" className="icon-action"><Download size={14} /></button><button type="button" className="icon-action"><Eye size={14} /></button></div></div>
        </article>
        <article className="report-card">
          <span className="report-card__icon"><Tags size={18} /></span>
          <h3>Reporte de Clasificación</h3>
          <p>Distribución de calidad por lote y período seleccionado.</p>
          <div className="report-card__footer"><span>{classification} registros · {numberCompact(production)} plantas</span><div><button type="button" className="icon-action"><Download size={14} /></button><button type="button" className="icon-action"><Eye size={14} /></button></div></div>
        </article>
        <article className="report-card">
          <span className="report-card__icon"><Truck size={18} /></span>
          <h3>Reporte de Despachos</h3>
          <p>Historial de exportaciones y ventas locales con destinos, certificados y estado de cada envío.</p>
          <div className="report-card__footer"><span>{shipments} despachos · {numberCompact(rows.reduce((total, item) => total + item.plantasDespachadas, 0))} plantas</span><div><button type="button" className="icon-action"><Download size={14} /></button><button type="button" className="icon-action"><Eye size={14} /></button></div></div>
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--equal">
        <article className="panel-card chart-panel chart-panel--bars chart-panel--tight">
          <div className="panel-card__header"><div><h2>Producción Mensual {new Date().getFullYear()}</h2></div></div>
          <div className="mini-bars">
            {monthly.map((value, index) => <div key={index} className="mini-bars__item"><div className="mini-bars__bar" style={{ height: `${(value / maxMonthly) * 100}%` }} /><span>{['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'][index]}</span></div>)}
          </div>
        </article>
        <article className="panel-card">
          <div className="panel-card__header"><div><h2>Trazabilidad por Lote</h2></div></div>
          <div className="trace-bars">
            {rows.slice(0, 5).map((row) => {
              const progress = row.plantasSembradas === 0 ? 0 : Math.round((row.plantasDespachadas / row.plantasSembradas) * 100);
              return (
                <div key={row.id} className="trace-bars__row">
                  <div className="trace-bars__meta"><strong>{row.lote?.codigo || 'Lote'}</strong><span>{row.lote?.descripcion || 'Sin descripción'}</span></div>
                  <div className="progress-track progress-track--wide"><span style={{ width: `${progress}%` }} /></div>
                  <div className="trace-bars__summary"><strong>{numberCompact(row.plantasSembradas)}</strong><span>{progress}%</span></div>
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </main>
  );
}
