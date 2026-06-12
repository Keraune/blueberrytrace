import { useMemo, useState } from 'react';
import { BarChart3, Download, FileText, Leaf, Printer, Tags, Truck, type LucideIcon } from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ModuleHeader } from '../components/ModuleHeader';
import { downloadCsv, downloadExcel, printCurrentView, type CsvRow } from '../lib/export';
import { dateShort, numberCompact } from '../lib/format';
import type {
  ClasificacionResponse,
  DespachoResponse,
  LoteResponse,
  ProcesoOperativoResponse,
  ReferenceResponse,
  SiembraResponse,
  TrazabilidadResponse,
  CamaResponse
} from '../types/api';

interface ReportesPageProps {
  lotes: LoteResponse[];
  camas: CamaResponse[];
  siembras: SiembraResponse[];
  procesos: ProcesoOperativoResponse | null;
  clasificaciones: ClasificacionResponse[];
  despachos: DespachoResponse[];
  trazabilidad: TrazabilidadResponse[];
}

type ReportType = 'trazabilidad' | 'produccion' | 'clasificacion' | 'despachos';

type ReportRow = Record<string, string | number | null | undefined> & {
  _loteId?: number | null;
};

interface ReportDefinition {
  key: ReportType;
  label: string;
  description: string;
  filename: string;
  icon: LucideIcon;
  headers: string[];
  rows: ReportRow[];
}

const reportOptions: Array<{ key: ReportType; label: string }> = [
  { key: 'trazabilidad', label: 'Trazabilidad por lote' },
  { key: 'produccion', label: 'Producción por lote' },
  { key: 'clasificacion', label: 'Clasificación' },
  { key: 'despachos', label: 'Despachos' }
];

const allLots = 'TODOS';

function traceId(item: TrazabilidadResponse, index: number) {
  return item.lote?.id || item.id || index + 1;
}

function uniqueLots(...groups: Array<Array<ReferenceResponse | LoteResponse | null | undefined>>) {
  const map = new Map<number, ReferenceResponse>();
  groups.flat().forEach((item) => {
    if (!item?.id) return;
    map.set(item.id, {
      id: item.id,
      codigo: item.codigo,
      descripcion: item.descripcion || null
    });
  });
  return Array.from(map.values()).sort((left, right) => left.codigo.localeCompare(right.codigo));
}

function lotId(item: { lote?: ReferenceResponse | null }) {
  return item.lote?.id || null;
}

function rowValues(headers: string[], row: ReportRow): CsvRow {
  return headers.map((header) => row[header]);
}

function fileSuffix(reportType: ReportType, selectedLote: string, lotOptions: ReferenceResponse[]) {
  const lot = selectedLote === allLots ? 'todos-los-lotes' : lotOptions.find((item) => String(item.id) === selectedLote)?.codigo || 'lote';
  return `${reportType}-${lot}`.toLowerCase().replace(/\s+/g, '-');
}

export function ReportesPage({ lotes, camas, siembras, procesos, clasificaciones, despachos, trazabilidad }: ReportesPageProps) {
  const [reportType, setReportType] = useState<ReportType>('trazabilidad');
  const [selectedLote, setSelectedLote] = useState(allLots);

  const uniformizaciones = procesos?.uniformizaciones.items || [];
  const formalizaciones = procesos?.formalizaciones.items || [];

  const lotOptions = useMemo(() => uniqueLots(
    lotes,
    trazabilidad.map((item) => item.lote),
    clasificaciones.map((item) => item.lote),
    despachos.map((item) => item.lote),
    siembras.map((item) => item.lote),
    uniformizaciones.map((item) => item.lote),
    formalizaciones.map((item) => item.lote)
  ), [clasificaciones, despachos, formalizaciones, lotes, siembras, trazabilidad, uniformizaciones]);

  const reportDefinitions = useMemo<Record<ReportType, ReportDefinition>>(() => {
    const trazabilidadRows = trazabilidad.map((item, index) => ({
      _loteId: item.lote?.id || null,
      Lote: item.lote?.codigo || `TRZ-${traceId(item, index)}`,
      Descripción: item.lote?.descripcion || 'Sin descripción',
      Camas: item.camas,
      Siembras: item.siembras,
      'Plantas sembradas': item.plantasSembradas,
      Uniformizaciones: item.uniformizaciones,
      Formalizaciones: item.formalizaciones,
      Clasificaciones: item.clasificaciones,
      Despachos: item.despachos,
      'Plantas despachadas': item.plantasDespachadas,
      'Último evento': item.ultimoEvento || 'Sin eventos operativos'
    }));

    const produccionRows = lotes.map((lote) => {
      const camasLote = camas.filter((cama) => cama.lote?.id === lote.id);
      const siembrasLote = siembras.filter((siembra) => siembra.lote?.id === lote.id);
      const uniformizacionesLote = uniformizaciones.filter((item) => item.lote?.id === lote.id);
      const formalizacionesLote = formalizaciones.filter((item) => item.lote?.id === lote.id);
      const planted = siembrasLote.reduce((total, item) => total + (item.cantidadRegistrada || 0), 0);
      const uniformized = uniformizacionesLote.reduce((total, item) => total + (item.cantidadUniformizada || 0), 0);
      const formalized = formalizacionesLote.reduce((total, item) => total + (item.cantidadPlantas || 0), 0);
      const capacity = camasLote.reduce((total, item) => total + (item.capacidadReferencial || 0), 0);
      return {
        _loteId: lote.id,
        Lote: lote.codigo,
        Descripción: lote.descripcion || 'Sin descripción',
        Variedad: lote.variedad || lote.cultivo || 'Sin variedad',
        Estado: lote.estado || 'Sin estado',
        Camas: camasLote.length,
        'Capacidad referencial': capacity,
        Siembras: siembrasLote.length,
        'Plantas sembradas': planted,
        'Plantas uniformizadas': uniformized,
        'Plantas formalizadas': formalized,
        'Avance productivo': planted > 0 ? `${Math.min(100, Math.round((formalized / planted) * 100))}%` : '0%'
      };
    });

    const clasificacionRows = clasificaciones.map((item) => ({
      _loteId: lotId(item),
      Lote: item.lote?.codigo || 'Sin lote',
      Cama: item.cama?.codigo || 'Sin cama',
      Fecha: dateShort(item.fechaClasificacion),
      'Estado de planta': item.estadoPlanta || 'No definido',
      Tamaño: item.tamano || 'No definido',
      Condición: item.condicion || 'No definida',
      Cantidad: item.cantidad || 0,
      Estado: item.estado || 'Sin estado',
      Responsable: item.usuarioRegistro?.nombreCompleto || 'Sin responsable'
    }));

    const despachoRows = despachos.map((item) => ({
      _loteId: lotId(item),
      Lote: item.lote?.codigo || 'Sin lote',
      Fecha: dateShort(item.fechaDespacho),
      Modalidad: item.modalidad || 'No definida',
      'Cantidad despachada': item.cantidadDespachada || 0,
      Destino: item.destino || 'Sin destino',
      'Guía de remisión': item.guiaRemision || 'Sin guía',
      'Validación de calidad': item.validacionCalidad || 'Sin validación',
      Estado: item.estado || 'Sin estado',
      Responsable: item.usuarioRegistro?.nombreCompleto || 'Sin responsable'
    }));

    return {
      trazabilidad: {
        key: 'trazabilidad',
        label: 'Trazabilidad por lote',
        description: 'Consolidado de etapas operativas por lote productivo.',
        filename: 'blueberrytrace-trazabilidad',
        icon: BarChart3,
        headers: ['Lote', 'Descripción', 'Camas', 'Siembras', 'Plantas sembradas', 'Uniformizaciones', 'Formalizaciones', 'Clasificaciones', 'Despachos', 'Plantas despachadas', 'Último evento'],
        rows: trazabilidadRows
      },
      produccion: {
        key: 'produccion',
        label: 'Producción por lote',
        description: 'Resumen de camas, capacidad, siembras, uniformizaciones y formalizaciones.',
        filename: 'blueberrytrace-produccion',
        icon: Leaf,
        headers: ['Lote', 'Descripción', 'Variedad', 'Estado', 'Camas', 'Capacidad referencial', 'Siembras', 'Plantas sembradas', 'Plantas uniformizadas', 'Plantas formalizadas', 'Avance productivo'],
        rows: produccionRows
      },
      clasificacion: {
        key: 'clasificacion',
        label: 'Clasificación',
        description: 'Registros de calidad, condición, tamaño y cantidad clasificada.',
        filename: 'blueberrytrace-clasificacion',
        icon: Tags,
        headers: ['Lote', 'Cama', 'Fecha', 'Estado de planta', 'Tamaño', 'Condición', 'Cantidad', 'Estado', 'Responsable'],
        rows: clasificacionRows
      },
      despachos: {
        key: 'despachos',
        label: 'Despachos',
        description: 'Historial de salidas, destinos, guías y validaciones de calidad.',
        filename: 'blueberrytrace-despachos',
        icon: Truck,
        headers: ['Lote', 'Fecha', 'Modalidad', 'Cantidad despachada', 'Destino', 'Guía de remisión', 'Validación de calidad', 'Estado', 'Responsable'],
        rows: despachoRows
      }
    };
  }, [camas, clasificaciones, despachos, formalizaciones, lotes, siembras, trazabilidad, uniformizaciones]);

  const currentReport = reportDefinitions[reportType];
  const filteredRows = useMemo(() => currentReport.rows.filter((item) => selectedLote === allLots || String(item._loteId || '') === selectedLote), [currentReport.rows, selectedLote]);
  const previewRows = filteredRows.slice(0, 8);
  const exportRows = filteredRows.map((row) => rowValues(currentReport.headers, row));

  const production = filteredRows.reduce((total, item) => total + (Number(item['Plantas sembradas']) || 0), 0);
  const shippedPlants = filteredRows.reduce((total, item) => total + (Number(item['Plantas despachadas'] || item['Cantidad despachada']) || 0), 0);
  const classifications = filteredRows.reduce((total, item) => total + (Number(item.Clasificaciones || item.Cantidad) || 0), 0);
  const shipments = filteredRows.reduce((total, item) => total + (Number(item.Despachos) || (item['Cantidad despachada'] !== undefined ? 1 : 0)), 0);
  const processTotal = filteredRows.reduce((total, item) => total + (Number(item.Uniformizaciones || 0) + Number(item.Formalizaciones || 0)), 0);

  function exportCsv() {
    const suffix = fileSuffix(reportType, selectedLote, lotOptions);
    downloadCsv(`${currentReport.filename}-${suffix}.csv`, currentReport.headers, exportRows);
  }

  function exportExcel() {
    const suffix = fileSuffix(reportType, selectedLote, lotOptions);
    downloadExcel(`${currentReport.filename}-${suffix}.xls`, currentReport.label, currentReport.headers, exportRows);
  }

  const ReportIcon = currentReport.icon;

  return (
    <main className="content-grid report-screen report-screen--apf3">
      <ModuleHeader
        eyebrow="Análisis operativo"
        title="Reportes operativos"
        description="Exporta reportes reales de trazabilidad, producción, clasificación y despachos para sustentación y control interno."
        icon={<BarChart3 size={21} />}
        tone="blue"
      />

      <section className="panel-card report-parameter-card report-parameter-card--refined">
        <div className="panel-card__header">
          <div>
            <h2>Parámetros del reporte</h2>
            <p>Selecciona el tipo de reporte y filtra por lote cuando necesites una vista específica.</p>
          </div>
        </div>
        <div className="report-parameters-grid report-parameters-grid--compact">
          <label>
            Tipo de reporte
            <select value={reportType} onChange={(event) => setReportType(event.target.value as ReportType)}>
              {reportOptions.map((type) => <option key={type.key} value={type.key}>{type.label}</option>)}
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
            <input value={`${filteredRows.length} registro(s) encontrados`} readOnly />
          </label>
        </div>
        <div className="button-group">
          <button type="button" className="action-button" onClick={() => document.querySelector('.report-preview-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} disabled={filteredRows.length === 0}><ReportIcon size={15} /> Ver vista previa</button>
          <button type="button" className="ghost-button" onClick={exportCsv} disabled={filteredRows.length === 0}><Download size={15} /> Exportar CSV</button>
          <button type="button" className="ghost-button" onClick={exportExcel} disabled={filteredRows.length === 0}><FileText size={15} /> Exportar Excel</button>
          <button type="button" className="ghost-button" onClick={printCurrentView}><Printer size={15} /> Imprimir/PDF</button>
        </div>
      </section>

      <section className="report-card-grid report-card-grid--real">
        <article className="report-card">
          <span className="report-card__icon"><Leaf size={18} /></span>
          <h3>Producción</h3>
          <p>Plantas sembradas y avance productivo calculado con registros reales.</p>
          <div className="report-card__footer"><span>{filteredRows.length} registros · {numberCompact(production)} plantas</span></div>
        </article>
        <article className="report-card">
          <span className="report-card__icon"><Tags size={18} /></span>
          <h3>Calidad y procesos</h3>
          <p>Clasificaciones, uniformizaciones y formalizaciones vinculadas al lote.</p>
          <div className="report-card__footer"><span>{numberCompact(classifications)} clasificaciones · {numberCompact(processTotal)} procesos</span></div>
        </article>
        <article className="report-card">
          <span className="report-card__icon"><Truck size={18} /></span>
          <h3>Despachos</h3>
          <p>Salidas registradas, plantas despachadas y validación de calidad.</p>
          <div className="report-card__footer"><span>{numberCompact(shipments)} despachos · {numberCompact(shippedPlants)} plantas</span></div>
        </article>
      </section>

      <section className="panel-card report-preview-panel">
        <div className="panel-card__header">
          <div>
            <h2>{currentReport.label}</h2>
            <p>{currentReport.description}</p>
          </div>
          <span className="panel-card__count">{filteredRows.length} registros</span>
        </div>

        {previewRows.length > 0 ? (
          <div className="data-table-wrap report-preview-table-wrap">
            <table className="data-table report-preview-table">
              <thead>
                <tr>
                  {currentReport.headers.map((header) => <th key={header}>{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, index) => (
                  <tr key={`${reportType}-${index}`}>
                    {currentReport.headers.map((header) => <td key={header}>{String(row[header] ?? '')}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState compact title="Sin información para este reporte" description="Registra operaciones o ajusta los filtros para generar una vista previa exportable." />
        )}
      </section>
    </main>
  );
}
