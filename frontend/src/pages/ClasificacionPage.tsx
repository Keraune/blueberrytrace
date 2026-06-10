import { useMemo, useState } from 'react';
import { Download, Eye, Plus } from 'lucide-react';
import { ClasificacionForm } from '../components/ClasificacionForm';
import { DetailDrawer } from '../components/DetailDrawer';
import { FilterToolbar } from '../components/FilterToolbar';
import { InfoGrid } from '../components/InfoGrid';
import { Modal } from '../components/Modal';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { blueberryApi } from '../lib/api';
import { dateShort, numberCompact } from '../lib/format';
import type { CamaResponse, ClasificacionFormPayload, ClasificacionResponse, ReferenceResponse } from '../types/api';

interface ClasificacionPageProps {
  clasificaciones: ClasificacionResponse[];
  lotes: ReferenceResponse[];
  camas: CamaResponse[];
  onClasificacionesChange: (items: ClasificacionResponse[]) => void;
}

function bucketOf(item: ClasificacionResponse, index: number) {
  const combined = `${item.condicion || ''} ${item.estadoPlanta || ''} ${item.tamano || ''}`.toLowerCase();
  if (combined.includes('descarte') || combined.includes('observ')) return 'Descarte';
  if (combined.includes('export') || combined.includes('apta') || combined.includes('grande')) return 'Primera Calidad';
  if (combined.includes('mediana')) return 'Segunda Calidad';
  if (combined.includes('peque')) return 'Tercera Calidad';
  return ['Primera Calidad', 'Segunda Calidad', 'Tercera Calidad', 'Descarte'][index % 4];
}

export function ClasificacionPage({ clasificaciones, lotes, camas, onClasificacionesChange }: ClasificacionPageProps) {
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedClasificacion, setSelectedClasificacion] = useState<ClasificacionResponse | null>(null);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return clasificaciones.filter((item) => !term || [item.lote?.codigo, item.estadoPlanta, item.tamano, item.condicion, item.estado]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [clasificaciones, query]);

  const grouped = useMemo(() => {
    const initial = { 'Primera Calidad': 0, 'Segunda Calidad': 0, 'Tercera Calidad': 0, 'Descarte': 0 };
    return clasificaciones.reduce((acc, item, index) => {
      acc[bucketOf(item, index) as keyof typeof acc] += item.cantidad || 0;
      return acc;
    }, initial);
  }, [clasificaciones]);
  const total = Object.values(grouped).reduce((sum, value) => sum + value, 0) || 1;

  async function create(payload: ClasificacionFormPayload) {
    const response = await blueberryApi.createClasificacion(payload);
    onClasificacionesChange(response.items);
    setCreating(false);
  }

  const cards = [
    { label: 'Primera Calidad', value: grouped['Primera Calidad'], tone: 'green' },
    { label: 'Segunda Calidad', value: grouped['Segunda Calidad'], tone: 'blue' },
    { label: 'Tercera Calidad', value: grouped['Tercera Calidad'], tone: 'orange' },
    { label: 'Descarte', value: grouped['Descarte'], tone: 'red' }
  ];

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Calidad"
        title="Módulo de Clasificación"
        description="Clasificación por tamaño, estado y condición de las plantas."
        actions={<button type="button" className="action-button" onClick={() => setCreating(true)}><Plus size={16} /> Nueva clasificación</button>}
      />

      <section className="quality-card-grid">
        {cards.map((card) => (
          <article key={card.label} className={`quality-card quality-card--${card.tone}`}>
            <div className="quality-card__header">
              <span>{card.label}</span>
              <strong>{Math.round((card.value / total) * 100)}%</strong>
            </div>
            <h3>{numberCompact(card.value)}</h3>
            <div className="progress-track"><span style={{ width: `${Math.max((card.value / total) * 100, 4)}%` }} /></div>
          </article>
        ))}
      </section>

      <section className="panel-card">
        <div className="module-toolbar-card module-toolbar-card--filters">
          <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar clasificación..." />
          <select><option>Todos los lotes</option></select>
          <select><option>Todos los estados</option></select>
          <button type="button" className="ghost-button"><Download size={15} /> Exportar</button>
        </div>
        <div className="data-table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Lote</th>
                <th>Fecha</th>
                <th>Primera</th>
                <th>Segunda</th>
                <th>Tercera</th>
                <th>Descarte</th>
                <th>Total</th>
                <th>Operario</th>
                <th>Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => {
                const bucket = bucketOf(item, index);
                const amount = item.cantidad || 0;
                const values = {
                  primera: bucket === 'Primera Calidad' ? amount : 0,
                  segunda: bucket === 'Segunda Calidad' ? amount : 0,
                  tercera: bucket === 'Tercera Calidad' ? amount : 0,
                  descarte: bucket === 'Descarte' ? amount : 0
                };
                return (
                  <tr key={item.id}>
                    <td><strong className="table-code">CL-{String(item.id).padStart(4, '0')}</strong></td>
                    <td>{item.lote?.codigo || 'Sin lote'}</td>
                    <td>{dateShort(item.fechaClasificacion)}</td>
                    <td className="table-number table-number--green">{numberCompact(values.primera)}</td>
                    <td className="table-number table-number--blue">{numberCompact(values.segunda)}</td>
                    <td className="table-number table-number--orange">{numberCompact(values.tercera)}</td>
                    <td className="table-number table-number--red">{numberCompact(values.descarte)}</td>
                    <td><strong>{numberCompact(amount)}</strong></td>
                    <td>{item.usuarioRegistro?.nombreCompleto || 'Sin operario'}</td>
                    <td><StatusBadge value={item.estado} /></td>
                    <td><button type="button" className="icon-action" onClick={() => setSelectedClasificacion(item)}><Eye size={15} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="table-footer-note">{filtered.length} registros · {numberCompact(total)} plantas clasificadas</div>
      </section>

      <DetailDrawer
        open={Boolean(selectedClasificacion)}
        title={selectedClasificacion ? `CL-${String(selectedClasificacion.id).padStart(4, '0')}` : 'Detalle de clasificación'}
        subtitle={selectedClasificacion?.lote?.codigo || 'Control de calidad'}
        onClose={() => setSelectedClasificacion(null)}
      >
        {selectedClasificacion ? (
          <>
            <InfoGrid
              items={[
                { label: 'Lote', value: selectedClasificacion.lote?.codigo || 'Sin lote', tone: 'green' },
                { label: 'Cama', value: selectedClasificacion.cama?.codigo || 'Sin cama' },
                { label: 'Cantidad', value: numberCompact(selectedClasificacion.cantidad || 0), tone: 'blue' },
                { label: 'Estado planta', value: selectedClasificacion.estadoPlanta || 'No definido' },
                { label: 'Tamaño', value: selectedClasificacion.tamano || 'No definido', tone: 'purple' },
                { label: 'Estado', value: <StatusBadge value={selectedClasificacion.estado} />, tone: 'orange' }
              ]}
            />
            <section className="drawer-section">
              <h3>Condición y observación</h3>
              <p><strong>Condición:</strong> {selectedClasificacion.condicion || 'Sin condición registrada'}</p>
              <p>{selectedClasificacion.observacion || 'No se registraron observaciones.'}</p>
            </section>
          </>
        ) : null}
      </DetailDrawer>

      <Modal open={creating} title="Nueva clasificación" description="Registra el resultado de control de calidad por lote y cama." onClose={() => setCreating(false)}>
        <ClasificacionForm lotes={lotes} camas={camas} onSubmit={create} onCancel={() => setCreating(false)} />
      </Modal>
    </main>
  );
}
