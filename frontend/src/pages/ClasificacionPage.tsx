import { useMemo, useState } from 'react';
import { BadgeCheck, Boxes, Plus, Scale } from 'lucide-react';
import { ClasificacionForm } from '../components/ClasificacionForm';
import { DataTable } from '../components/DataTable';
import { FilterToolbar } from '../components/FilterToolbar';
import { MetricCard } from '../components/MetricCard';
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

export function ClasificacionPage({ clasificaciones, lotes, camas, onClasificacionesChange }: ClasificacionPageProps) {
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return clasificaciones;
    }
    return clasificaciones.filter((item) => [item.lote?.codigo, item.cama?.codigo, item.estadoPlanta, item.tamano, item.condicion, item.estado]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [clasificaciones, query]);

  const cantidad = clasificaciones.reduce((total, item) => total + (item.cantidad || 0), 0);
  const validadas = clasificaciones.filter((item) => item.estado === 'VALIDADA').length;
  const condiciones = new Set(clasificaciones.map((item) => item.condicion).filter(Boolean)).size;

  async function create(payload: ClasificacionFormPayload) {
    const response = await blueberryApi.createClasificacion(payload);
    onClasificacionesChange(response.items);
    setCreating(false);
  }

  async function changeStatus(id: number, estado: string) {
    const response = await blueberryApi.changeClasificacionStatus(id, estado);
    onClasificacionesChange(response.items);
  }

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Calidad"
        title="Clasificación de plantas"
        description="Distribución de plantas por condición, tamaño, estado y lote antes del despacho."
        actions={<button type="button" className="action-button" onClick={() => setCreating(true)}><Plus size={16} /> Nueva clasificación</button>}
      />

      <section className="metrics-grid metrics-grid--three">
        <MetricCard label="Registros" value={clasificaciones.length} detail="clasificaciones totales" icon={<Boxes size={20} />} tone="green" />
        <MetricCard label="Plantas clasificadas" value={cantidad} detail="cantidad acumulada" icon={<Scale size={20} />} tone="blue" />
        <MetricCard label="Validadas" value={validadas} detail={`${condiciones} condiciones`} icon={<BadgeCheck size={20} />} tone="purple" />
      </section>

      <section className="panel-card">
        <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar por lote, tamaño, condición o estado" />
        <DataTable<ClasificacionResponse>
          title="Historial de clasificación"
          description="Registros de calidad disponibles desde la API."
          items={filtered}
          columns={[
            { key: 'lote', label: 'Lote', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'fechaClasificacion', label: 'Fecha', render: (item) => dateShort(item.fechaClasificacion) },
            { key: 'estadoPlanta', label: 'Estado planta' },
            { key: 'tamano', label: 'Tamaño' },
            { key: 'cantidad', label: 'Cantidad', render: (item) => numberCompact(item.cantidad || 0) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> },
            { key: 'acciones', label: 'Acciones', render: (item) => (
              <div className="table-actions">
                <button type="button" className="table-action" onClick={() => changeStatus(item.id, 'VALIDADA')}>Validar</button>
                <button type="button" className="table-action" onClick={() => changeStatus(item.id, 'OBSERVADA')}>Observar</button>
              </div>
            ) }
          ]}
        />
      </section>

      <Modal open={creating} title="Nueva clasificación" description="Registra el resultado de control de calidad por lote y cama." onClose={() => setCreating(false)}>
        <ClasificacionForm lotes={lotes} camas={camas} onSubmit={create} onCancel={() => setCreating(false)} />
      </Modal>
    </main>
  );
}
