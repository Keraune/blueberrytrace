import { useMemo, useState } from 'react';
import { BarChart3, Download, Eye, FileText, Leaf, Printer, Tags, Truck } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ModuleHeader } from '../components/ModuleHeader';
import { downloadCsv, printCurrentView } from '../lib/export';
import { numberCompact } from '../lib/format';
import type { TrazabilidadResponse } from '../types/api';

interface ReportesPageProps {
  trazabilidad: TrazabilidadResponse[];
}

const reportTypes = ['Trazabilidad por lote', 'Clasificación', 'Despachos'];
const allLots = 'TODOS';

function traceId(item: TrazabilidadResponse, index: number) {
  return item.lote?.id || item.id || index + 1;
}

export function ReportesPage({ trazabilidad }: ReportesPageProps) {
  const [reportType, setReportType] = useState(reportTypes[0]);
  const [selectedLote, setSelectedLote] = useState(allLots);

  const rows = useMemo(() => trazabilidad.map((item, index) => ({ ...item, id: traceId(item, index) })), [trazabilidad]);
  const filteredRows = useMemo(() => rows.filter((item) => selectedLote === allLots || String(item.lote?.id || '') === selectedLote), [rows, selectedLote]);
  const lotOptions = useMemo(() => rows.filter((item) => item.lote).map((item) => item.lote!), [rows]);

  const production = filteredRows.reduce((total, item) => total + item.plantasSembradas, 0);
  const classifications = filteredRows.reduce((total, item) => total + item.clasificaciones, 0);
  const shipments = filteredRows.reduce((total, item) => total + item.despachos, 0);
  const shippedPlants = filteredRows.reduce((total, item) => total + item.plantasDespachadas, 0);
  const uniformizations = filteredRows.reduce((total, item) => total + item.uniformizaciones, 0);
  const formalizations = filteredRows.reduce((total, item) => total + item.formalizaciones, 0);

  function exportCsv() {
    const suffix = selectedLote === allLots ? 'todos-los-lotes' : (lotOptions.find((lote) => String(lote.id) === selectedLote)?.codigo || 'lote');
    downloadCsv(`blueberrytrace-reportes-${suffix}.csv`, [
      'Lote',
      'Descripción',
      'Camas',
      'Siembras',
      'Plantas sembradas',
      'Uniformizaciones',
      'Formalizaciones',
      'Clasificaciones',
      'Despachos',
      'Plantas despachadas',
      'Último evento'
    ], filteredRows.map((item) => [
      item.lote?.codigo || '',
      item.lote?.descripcion || '',
      item.camas,
      item.siembras,
      item.plantasSembradas,
      item.uniformizaciones,
      item.formalizaciones,
      item.clasificaciones,
      item.despachos,
      item.plantasDespachadas,
      item.ultimoEvento || ''
    ]));
  }

  return (
    <main className="content-grid report-screen">
      <ModuleHeader
        eyebrow="Análisis operativo"
        title="Reportes operativos"
        description="Consulta de trazabilidad, clasificación y despacho basada en registros reales del vivero."
      />

      <section className="panel-card report-parameter-card report-parameter-card--refined">
        <div className="panel-card__header">
          <div>
            <h2>Parámetros del reporte</h2>
            <p>Filtra la información por tipo de consulta y lote productivo.</p>
          </div>
        </div>
        <div className="report-parameters-grid report-parameters-grid--compact">
          <label>
            Tipo de reporte
            <select value={reportType} onChange={(event) => setReportType(event.target.value)}>
              {reportTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>
          </label>
          <label>
            Lote
            <select value={selectedLote} onChange={(event) => setSelectedLote(event.target.value)}>
              <option value={allLots}>Todos los lotes</option>
              {lotOptions.map((lote) => <option key={lote.id} value={lote.id}>{lote.codigo}</option>)}
            </select>
          </label>
          <label>
            Registros disponibles
            <input value={`${filteredRows.length} lote(s) encontrados`} readOnly />
          </label>
        </div>
        <div className="button-group">
          <button type="button" className="action-button" onClick={() => document.querySelector('.report-summary-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} disabled={filteredRows.length === 0}><BarChart3 size={15} /> Ver consolidado</button>
          <button type="button" className="ghost-button" onClick={exportCsv} disabled={filteredRows.length === 0}><Download size={15} /> Exportar CSV</button>
          <button type="button" className="ghost-button" onClick={printCurrentView}><Printer size={15} /> Imprimir o guardar PDF</button>
        </div>
      </section>

      <section className="report-card-grid report-card-grid--real">
        <article className="report-card">
          <span className="report-card__icon"><Leaf size={18} /></span>
          <h3>Producción por lote</h3>
          <p>Consolidado de camas, siembras y plantas sembradas por lote registrado.</p>
          <div className="report-card__footer"><span>{filteredRows.length} lotes · {numberCompact(production)} plantas</span><div><button type="button" className="icon-action" onClick={exportCsv} disabled={filteredRows.length === 0}><Download size={14} /></button><button type="button" className="icon-action" disabled={filteredRows.length === 0}><Eye size={14} /></button></div></div>
        </article>
        <article className="report-card">
          <span className="report-card__icon"><Tags size={18} /></span>
          <h3>Control de clasificación</h3>
          <p>Seguimiento de registros de calidad vinculados a la trazabilidad del lote.</p>
          <div className="report-card__footer"><span>{numberCompact(classifications)} clasificaciones · {numberCompact(uniformizations + formalizations)} procesos</span><div><button type="button" className="icon-action" onClick={exportCsv} disabled={filteredRows.length === 0}><Download size={14} /></button><button type="button" className="icon-action" disabled={filteredRows.length === 0}><Eye size={14} /></button></div></div>
        </article>
        <article className="report-card">
          <span className="report-card__icon"><Truck size={18} /></span>
          <h3>Seguimiento de despacho</h3>
          <p>Historial consolidado de salidas y plantas despachadas por lote.</p>
          <div className="report-card__footer"><span>{numberCompact(shipments)} despachos · {numberCompact(shippedPlants)} plantas</span><div><button type="button" className="icon-action" onClick={exportCsv} disabled={filteredRows.length === 0}><Download size={14} /></button><button type="button" className="icon-action" disabled={filteredRows.length === 0}><Eye size={14} /></button></div></div>
        </article>
      </section>

      <section className="dashboard-grid dashboard-grid--equal">
        <article className="panel-card report-summary-panel">
          <div className="panel-card__header"><div><h2>Resumen consolidado</h2><p>Indicadores calculados con la información filtrada.</p></div></div>
          {filteredRows.length > 0 ? (
            <div className="report-summary-grid">
              <div><span>Plantas sembradas</span><strong>{numberCompact(production)}</strong></div>
              <div><span>Plantas despachadas</span><strong>{numberCompact(shippedPlants)}</strong></div>
              <div><span>Uniformizaciones</span><strong>{numberCompact(uniformizations)}</strong></div>
              <div><span>Formalizaciones</span><strong>{numberCompact(formalizations)}</strong></div>
              <div><span>Clasificaciones</span><strong>{numberCompact(classifications)}</strong></div>
              <div><span>Despachos</span><strong>{numberCompact(shipments)}</strong></div>
            </div>
          ) : (
            <EmptyState compact title="Sin información para consolidar" description="Registra lotes y movimientos operativos para habilitar el reporte." />
          )}
        </article>

        <article className="panel-card">
          <div className="panel-card__header"><div><h2>Trazabilidad por lote</h2><p>Relación entre plantas sembradas y despachadas.</p></div></div>
          {filteredRows.length > 0 ? (
            <div className="trace-bars">
              {filteredRows.slice(0, 8).map((row) => {
                const progress = row.plantasSembradas === 0 ? 0 : Math.min(100, Math.round((row.plantasDespachadas / row.plantasSembradas) * 100));
                return (
                  <div key={row.id} className="trace-bars__row">
                    <div className="trace-bars__meta"><strong>{row.lote?.codigo || 'Lote sin código'}</strong><span>{row.lote?.descripcion || row.ultimoEvento || 'Sin detalle adicional'}</span></div>
                    <div className="progress-track progress-track--wide"><span style={{ width: `${progress}%` }} /></div>
                    <div className="trace-bars__summary"><strong>{numberCompact(row.plantasSembradas)}</strong><span>{progress}%</span></div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState compact title="Sin trazabilidad registrada" description="Los lotes aparecerán cuando exista información operativa vinculada." />
          )}
        </article>
      </section>
    </main>
  );
}
