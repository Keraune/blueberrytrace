import { useMemo, useState, type CSSProperties } from 'react';
import {
  Boxes,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Factory,
  Filter,
  GitBranch,
  Leaf,
  PackageCheck,
  Printer,
  Search,
  Sprout,
  Tags,
  Truck
} from 'lucide-react';
import { EmptyState } from '../components/EmptyState';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { downloadCsv, printCurrentView } from '../lib/export';
import { dateShort, numberCompact } from '../lib/format';
import type {
  CamaResponse,
  ClasificacionResponse,
  DespachoResponse,
  LoteResponse,
  ProcesoOperativoResponse,
  SiembraResponse,
  TrazabilidadResponse
} from '../types/api';

interface TrazabilidadPageProps {
  lotes: LoteResponse[];
  camas: CamaResponse[];
  siembras: SiembraResponse[];
  procesos: ProcesoOperativoResponse | null;
  clasificaciones: ClasificacionResponse[];
  despachos: DespachoResponse[];
  trazabilidad: TrazabilidadResponse[];
}

type TraceEventTone = 'green' | 'blue' | 'purple' | 'orange' | 'slate' | 'red';

interface TraceEvent {
  id: string;
  date: string | null;
  type: string;
  title: string;
  detail: string;
  quantity?: number | null;
  status?: string | null;
  actor?: string | null;
  tone: TraceEventTone;
}

function lotIdOf(value: { lote?: { id: number } | null }) {
  return value.lote?.id || 0;
}

function actorName(value: { usuarioRegistro?: { nombreCompleto?: string | null } | null }) {
  return value.usuarioRegistro?.nombreCompleto || 'Sin responsable';
}

function eventDate(...values: Array<string | null | undefined>) {
  return values.find(Boolean) || null;
}

function byRecent(left: TraceEvent, right: TraceEvent) {
  return new Date(right.date || 0).getTime() - new Date(left.date || 0).getTime();
}

function byOldest(left: TraceEvent, right: TraceEvent) {
  return new Date(left.date || 0).getTime() - new Date(right.date || 0).getTime();
}

function progressPercent(planted: number, shipped: number) {
  if (planted <= 0) return 0;
  return Math.min(100, Math.round((shipped / planted) * 100));
}

export function TrazabilidadPage({ lotes, camas, siembras, procesos, clasificaciones, despachos, trazabilidad }: TrazabilidadPageProps) {
  const [query, setQuery] = useState('');
  const [selectedLoteId, setSelectedLoteId] = useState<string>('TODOS');
  const [order, setOrder] = useState<'reciente' | 'antiguo'>('reciente');

  const uniformizaciones = procesos?.uniformizaciones.items || [];
  const formalizaciones = procesos?.formalizaciones.items || [];

  const traceRows = useMemo(() => {
    return lotes.map((lote) => {
      const row = trazabilidad.find((item) => item.lote?.id === lote.id);
      const siembrasLote = siembras.filter((item) => lotIdOf(item) === lote.id);
      const despachosLote = despachos.filter((item) => lotIdOf(item) === lote.id);
      const camasLote = camas.filter((item) => lotIdOf(item) === lote.id);
      const clasificacionesLote = clasificaciones.filter((item) => lotIdOf(item) === lote.id);
      const uniformizacionesLote = uniformizaciones.filter((item) => lotIdOf(item) === lote.id);
      const formalizacionesLote = formalizaciones.filter((item) => lotIdOf(item) === lote.id);

      const planted = siembrasLote.reduce((total, item) => total + (item.cantidadRegistrada || 0), 0) || row?.plantasSembradas || 0;
      const shipped = despachosLote.reduce((total, item) => total + (item.cantidadDespachada || 0), 0) || row?.plantasDespachadas || 0;
      const latestDates = [
        lote.fechaActualizacion,
        lote.fechaCreacion,
        lote.fechaRegistro,
        ...siembrasLote.map((item) => eventDate(item.fechaActualizacion, item.fechaCreacion, item.fechaSiembra)),
        ...uniformizacionesLote.map((item) => eventDate(item.fechaActualizacion, item.fechaCreacion, item.fechaUniformizacion)),
        ...formalizacionesLote.map((item) => eventDate(item.fechaActualizacion, item.fechaCreacion, item.fechaFormalizacion)),
        ...clasificacionesLote.map((item) => eventDate(item.fechaActualizacion, item.fechaCreacion, item.fechaClasificacion)),
        ...despachosLote.map((item) => eventDate(item.fechaActualizacion, item.fechaCreacion, item.fechaDespacho))
      ].filter(Boolean) as string[];

      return {
        lote,
        camas: camasLote.length || row?.camas || 0,
        siembras: siembrasLote.length || row?.siembras || 0,
        plantasSembradas: planted,
        uniformizaciones: uniformizacionesLote.length || row?.uniformizaciones || 0,
        formalizaciones: formalizacionesLote.length || row?.formalizaciones || 0,
        clasificaciones: clasificacionesLote.length || row?.clasificaciones || 0,
        despachos: despachosLote.length || row?.despachos || 0,
        plantasDespachadas: shipped,
        ultimoEvento: row?.ultimoEvento || 'Solo estructura base',
        ultimoEventoFecha: latestDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] || null
      };
    });
  }, [camas, clasificaciones, despachos, formalizaciones, lotes, siembras, trazabilidad, uniformizaciones]);

  const filteredLots = useMemo(() => {
    const term = query.trim().toLowerCase();
    return traceRows.filter((row) => {
      const matchesSearch = !term || [row.lote.codigo, row.lote.descripcion, row.lote.variedad, row.lote.estado]
        .some((value) => String(value || '').toLowerCase().includes(term));
      const matchesLote = selectedLoteId === 'TODOS' || String(row.lote.id) === selectedLoteId;
      return matchesSearch && matchesLote;
    });
  }, [query, selectedLoteId, traceRows]);

  const selectedRow = selectedLoteId === 'TODOS' ? filteredLots[0] : traceRows.find((row) => String(row.lote.id) === selectedLoteId) || filteredLots[0];
  const selectedLote = selectedRow?.lote || null;

  const timeline = useMemo<TraceEvent[]>(() => {
    if (!selectedLote) return [];
    const loteId = selectedLote.id;
    const events: TraceEvent[] = [
      {
        id: `lote-${loteId}`,
        date: eventDate(selectedLote.fechaActualizacion, selectedLote.fechaCreacion, selectedLote.fechaRegistro),
        type: 'Lote',
        title: `Registro de lote ${selectedLote.codigo}`,
        detail: [selectedLote.descripcion, selectedLote.variedad].filter(Boolean).join(' · ') || 'Estructura productiva creada',
        status: selectedLote.estado,
        actor: actorName(selectedLote),
        tone: 'green'
      },
      ...camas.filter((item) => lotIdOf(item) === loteId).map((item) => ({
        id: `cama-${item.id}`,
        date: eventDate(item.fechaActualizacion, item.fechaCreacion),
        type: 'Cama',
        title: `Cama ${item.codigo}`,
        detail: item.descripcion || `Capacidad referencial: ${numberCompact(item.capacidadReferencial || 0)}`,
        quantity: item.capacidadReferencial,
        status: item.estado,
        actor: actorName(item),
        tone: 'slate' as TraceEventTone
      })),
      ...siembras.filter((item) => lotIdOf(item) === loteId).map((item) => ({
        id: `siembra-${item.id}`,
        date: eventDate(item.fechaActualizacion, item.fechaCreacion, item.fechaSiembra),
        type: 'Siembra',
        title: `Siembra #${item.id}`,
        detail: `${item.cama?.codigo || 'Sin cama'} · ${item.observacion || 'Registro operativo de plantas'}`,
        quantity: item.cantidadRegistrada,
        status: item.estado,
        actor: actorName(item),
        tone: 'blue' as TraceEventTone
      })),
      ...uniformizaciones.filter((item) => lotIdOf(item) === loteId).map((item) => ({
        id: `uniformizacion-${item.id}`,
        date: eventDate(item.fechaActualizacion, item.fechaCreacion, item.fechaUniformizacion),
        type: 'Uniformización',
        title: `Uniformización #${item.id}`,
        detail: `${item.cama?.codigo || 'Sin cama'} · ${item.criterio || item.observacion || 'Proceso registrado'}`,
        quantity: item.cantidadUniformizada,
        status: item.estado,
        actor: actorName(item),
        tone: 'purple' as TraceEventTone
      })),
      ...formalizaciones.filter((item) => lotIdOf(item) === loteId).map((item) => ({
        id: `formalizacion-${item.id}`,
        date: eventDate(item.fechaActualizacion, item.fechaCreacion, item.fechaFormalizacion),
        type: 'Formalización',
        title: `Formalización #${item.id}`,
        detail: `${item.cama?.codigo || 'Sin cama'} · ${item.detalle || item.observacion || 'Bandejas formalizadas'}`,
        quantity: item.cantidadPlantas,
        status: item.estado,
        actor: actorName(item),
        tone: 'orange' as TraceEventTone
      })),
      ...clasificaciones.filter((item) => lotIdOf(item) === loteId).map((item) => ({
        id: `clasificacion-${item.id}`,
        date: eventDate(item.fechaActualizacion, item.fechaCreacion, item.fechaClasificacion),
        type: 'Clasificación',
        title: `Clasificación #${item.id}`,
        detail: [item.cama?.codigo, item.estadoPlanta, item.tamano, item.condicion].filter(Boolean).join(' · ') || 'Control de calidad registrado',
        quantity: item.cantidad,
        status: item.estado,
        actor: actorName(item),
        tone: item.estado && /PENDIENTE|OBSERVADA|RECHAZ/i.test(item.estado) ? 'red' as TraceEventTone : 'green' as TraceEventTone
      })),
      ...despachos.filter((item) => lotIdOf(item) === loteId).map((item) => ({
        id: `despacho-${item.id}`,
        date: eventDate(item.fechaActualizacion, item.fechaCreacion, item.fechaDespacho),
        type: 'Despacho',
        title: `Despacho #${item.id}`,
        detail: [item.modalidad, item.destino, item.guiaRemision].filter(Boolean).join(' · ') || 'Salida registrada',
        quantity: item.cantidadDespachada,
        status: item.estado || item.validacionCalidad,
        actor: actorName(item),
        tone: 'blue' as TraceEventTone
      }))
    ];

    return events.filter((event) => event.date || event.title).sort(order === 'reciente' ? byRecent : byOldest);
  }, [camas, clasificaciones, despachos, formalizaciones, order, selectedLote, siembras, uniformizaciones]);

  const totals = filteredLots.reduce((acc, row) => ({
    planted: acc.planted + row.plantasSembradas,
    shipped: acc.shipped + row.plantasDespachadas,
    processes: acc.processes + row.uniformizaciones + row.formalizaciones,
    classifications: acc.classifications + row.clasificaciones,
    shipments: acc.shipments + row.despachos
  }), { planted: 0, shipped: 0, processes: 0, classifications: 0, shipments: 0 });

  const selectedProgress = selectedRow ? progressPercent(selectedRow.plantasSembradas, selectedRow.plantasDespachadas) : 0;

  function exportCsv() {
    const suffix = selectedLote ? selectedLote.codigo : 'trazabilidad';
    downloadCsv(`blueberrytrace-trazabilidad-${suffix}.csv`, [
      'Fecha', 'Lote', 'Evento', 'Tipo', 'Detalle', 'Cantidad', 'Estado', 'Responsable'
    ], timeline.map((event) => [
      event.date || '',
      selectedLote?.codigo || '',
      event.title,
      event.type,
      event.detail,
      event.quantity || '',
      event.status || '',
      event.actor || ''
    ]));
  }

  return (
    <main className="content-grid trace-screen">
      <ModuleHeader
        eyebrow="Historial operativo"
        title="Trazabilidad por lote"
        description="Seguimiento cronológico desde el registro del lote hasta la salida de plantas."
        icon={<GitBranch size={21} />}
        tone="green"
        actions={
          <div className="button-group">
            <button type="button" className="ghost-button" onClick={exportCsv} disabled={timeline.length === 0}><Download size={15} /> Exportar CSV</button>
            <button type="button" className="ghost-button" onClick={printCurrentView}><Printer size={15} /> Imprimir</button>
          </div>
        }
      />

      <section className="trace-control-panel panel-card">
        <div className="trace-control-panel__search">
          <label className="filter-toolbar__search">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar lote, variedad o estado..." />
          </label>
          <label>
            <Filter size={15} />
            <select value={selectedLoteId} onChange={(event) => setSelectedLoteId(event.target.value)}>
              <option value="TODOS">Todos los lotes</option>
              {traceRows.map((row) => <option key={row.lote.id} value={row.lote.id}>{row.lote.codigo}</option>)}
            </select>
          </label>
          <label>
            <CalendarClock size={15} />
            <select value={order} onChange={(event) => setOrder(event.target.value as 'reciente' | 'antiguo')}>
              <option value="reciente">Más reciente primero</option>
              <option value="antiguo">Más antiguo primero</option>
            </select>
          </label>
        </div>
      </section>

      <section className="trace-kpi-grid">
        <article className="trace-kpi trace-kpi--green"><span><Sprout size={17} /></span><div><strong>{numberCompact(totals.planted)}</strong><small>Plantas sembradas</small></div></article>
        <article className="trace-kpi trace-kpi--blue"><span><Truck size={17} /></span><div><strong>{numberCompact(totals.shipped)}</strong><small>Plantas despachadas</small></div></article>
        <article className="trace-kpi trace-kpi--purple"><span><ClipboardCheck size={17} /></span><div><strong>{numberCompact(totals.processes)}</strong><small>Procesos intermedios</small></div></article>
        <article className="trace-kpi trace-kpi--orange"><span><Tags size={17} /></span><div><strong>{numberCompact(totals.classifications)}</strong><small>Clasificaciones</small></div></article>
      </section>

      {selectedRow ? (
        <section className="trace-overview-grid">
          <article className="panel-card trace-lot-card">
            <div className="trace-lot-card__header">
              <span><Factory size={22} /></span>
              <div>
                <strong>{selectedRow.lote.codigo}</strong>
                <small>{selectedRow.lote.descripcion || selectedRow.lote.variedad || 'Lote productivo'}</small>
              </div>
              <StatusBadge value={selectedRow.lote.estado} />
            </div>
            <div className="trace-progress-ring" style={{ '--progress': `${selectedProgress * 3.6}deg` } as CSSProperties}>
              <span>{selectedProgress}%</span>
            </div>
            <div className="trace-lot-card__metrics">
              <div><span>Camas</span><strong>{selectedRow.camas}</strong></div>
              <div><span>Siembras</span><strong>{selectedRow.siembras}</strong></div>
              <div><span>Despachos</span><strong>{selectedRow.despachos}</strong></div>
              <div><span>Último evento</span><strong>{selectedRow.ultimoEvento}</strong><small>{dateShort(selectedRow.ultimoEventoFecha)}</small></div>
            </div>
          </article>

          <article className="panel-card trace-flow-card">
            <div className="panel-card__header"><div><h2>Flujo del lote seleccionado</h2><p>Vista resumida del avance por etapa.</p></div></div>
            <div className="trace-stage-row">
              <div className={selectedRow.siembras > 0 ? 'trace-stage trace-stage--done' : 'trace-stage'}><Sprout size={18} /><strong>Siembra</strong><span>{selectedRow.siembras}</span></div>
              <div className={selectedRow.uniformizaciones > 0 ? 'trace-stage trace-stage--done' : 'trace-stage'}><Leaf size={18} /><strong>Uniformización</strong><span>{selectedRow.uniformizaciones}</span></div>
              <div className={selectedRow.formalizaciones > 0 ? 'trace-stage trace-stage--done' : 'trace-stage'}><Boxes size={18} /><strong>Formalización</strong><span>{selectedRow.formalizaciones}</span></div>
              <div className={selectedRow.clasificaciones > 0 ? 'trace-stage trace-stage--done' : 'trace-stage'}><Tags size={18} /><strong>Clasificación</strong><span>{selectedRow.clasificaciones}</span></div>
              <div className={selectedRow.despachos > 0 ? 'trace-stage trace-stage--done' : 'trace-stage'}><PackageCheck size={18} /><strong>Despacho</strong><span>{selectedRow.despachos}</span></div>
            </div>
          </article>
        </section>
      ) : null}

      <section className="trace-main-grid">
        <article className="panel-card trace-timeline-card">
          <div className="panel-card__header">
            <div><h2>Línea de tiempo operativa</h2><p>{selectedLote ? `Eventos vinculados al lote ${selectedLote.codigo}.` : 'Selecciona un lote para ver el historial.'}</p></div>
            <span className="panel-card__count">{timeline.length} eventos</span>
          </div>

          {timeline.length > 0 ? (
            <div className="trace-timeline">
              {timeline.map((event) => (
                <article key={event.id} className={`trace-event trace-event--${event.tone}`}>
                  <span className="trace-event__dot" />
                  <div className="trace-event__body">
                    <header>
                      <div><strong>{event.title}</strong><small>{event.type} · {dateShort(event.date)}</small></div>
                      {event.status ? <StatusBadge value={event.status} /> : null}
                    </header>
                    <p>{event.detail}</p>
                    <footer>
                      <span>{event.actor}</span>
                      {event.quantity !== undefined && event.quantity !== null ? <b>{numberCompact(event.quantity)} plantas</b> : null}
                    </footer>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState compact icon={<GitBranch size={24} />} title="Sin eventos para mostrar" description="Registra movimientos operativos para construir la trazabilidad del lote." />
          )}
        </article>

        <article className="panel-card trace-lot-list-card">
          <div className="panel-card__header"><div><h2>Lotes disponibles</h2><p>Resumen de trazabilidad por lote.</p></div></div>
          {filteredLots.length > 0 ? (
            <div className="trace-lot-list">
              {filteredLots.map((row) => {
                const progress = progressPercent(row.plantasSembradas, row.plantasDespachadas);
                return (
                  <button key={row.lote.id} type="button" className={selectedLote?.id === row.lote.id ? 'trace-lot-item trace-lot-item--active' : 'trace-lot-item'} onClick={() => setSelectedLoteId(String(row.lote.id))}>
                    <span><Factory size={15} /></span>
                    <div>
                      <strong>{row.lote.codigo}</strong>
                      <small>{numberCompact(row.plantasSembradas)} sembradas · {numberCompact(row.plantasDespachadas)} despachadas</small>
                      <i><em style={{ width: `${progress}%` }} /></i>
                    </div>
                    <b>{progress}%</b>
                  </button>
                );
              })}
            </div>
          ) : (
            <EmptyState compact title="Sin lotes con esos filtros" description="Ajusta la búsqueda para volver a consultar la trazabilidad." />
          )}
        </article>
      </section>
    </main>
  );
}
