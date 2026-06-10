import { useMemo, useState } from 'react';
import { MapPinned, PackageCheck, Plus, Truck } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { DespachoForm } from '../components/DespachoForm';
import { FilterToolbar } from '../components/FilterToolbar';
import { MetricCard } from '../components/MetricCard';
import { Modal } from '../components/Modal';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { blueberryApi } from '../lib/api';
import { dateShort, numberCompact } from '../lib/format';
import type { DespachoFormPayload, DespachoResponse, ReferenceResponse } from '../types/api';

interface DespachoPageProps {
  despachos: DespachoResponse[];
  lotes: ReferenceResponse[];
  modalidades: string[];
  validaciones: string[];
  onDespachosChange: (items: DespachoResponse[]) => void;
}

export function DespachoPage({ despachos, lotes, modalidades, validaciones, onDespachosChange }: DespachoPageProps) {
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return despachos;
    }
    return despachos.filter((item) => [item.lote?.codigo, item.modalidad, item.destino, item.guiaRemision, item.estado]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [despachos, query]);

  const plantas = despachos.reduce((total, item) => total + (item.cantidadDespachada || 0), 0);
  const destinos = new Set(despachos.map((item) => item.destino).filter(Boolean)).size;
  const cerrados = despachos.filter((item) => item.estado === 'CERRADO').length;

  async function create(payload: DespachoFormPayload) {
    const response = await blueberryApi.createDespacho(payload);
    onDespachosChange(response.items);
    setCreating(false);
  }

  async function changeStatus(id: number, estado: string) {
    const response = await blueberryApi.changeDespachoStatus(id, estado);
    onDespachosChange(response.items);
  }

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Salida"
        title="Despachos"
        description="Seguimiento de plantas despachadas por destino, modalidad, guía y validación de calidad."
        actions={<button type="button" className="action-button" onClick={() => setCreating(true)}><Plus size={16} /> Nuevo despacho</button>}
      />

      <section className="metrics-grid metrics-grid--three">
        <MetricCard label="Despachos" value={despachos.length} detail="registrados" icon={<Truck size={20} />} tone="green" />
        <MetricCard label="Plantas despachadas" value={plantas} detail="total enviado" icon={<PackageCheck size={20} />} tone="blue" />
        <MetricCard label="Destinos" value={destinos} detail={`${cerrados} cerrados`} icon={<MapPinned size={20} />} tone="orange" />
      </section>

      <section className="panel-card">
        <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar por lote, destino, guía o estado" />
        <DataTable<DespachoResponse>
          title="Historial de despachos"
          description="Registros de salida para exportación o venta local."
          items={filtered}
          columns={[
            { key: 'lote', label: 'Lote', render: (item) => item.lote?.codigo || 'Sin lote' },
            { key: 'fechaDespacho', label: 'Fecha', render: (item) => dateShort(item.fechaDespacho) },
            { key: 'modalidad', label: 'Modalidad' },
            { key: 'cantidadDespachada', label: 'Cantidad', render: (item) => numberCompact(item.cantidadDespachada || 0) },
            { key: 'destino', label: 'Destino' },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> },
            { key: 'acciones', label: 'Acciones', render: (item) => (
              <div className="table-actions">
                <button type="button" className="table-action" onClick={() => changeStatus(item.id, 'CERRADO')}>Cerrar</button>
                <button type="button" className="table-action" onClick={() => changeStatus(item.id, 'OBSERVADO')}>Observar</button>
              </div>
            ) }
          ]}
        />
      </section>

      <Modal open={creating} title="Nuevo despacho" description="Registra salida de plantas y validación de calidad." onClose={() => setCreating(false)}>
        <DespachoForm lotes={lotes} modalidades={modalidades} validaciones={validaciones} onSubmit={create} onCancel={() => setCreating(false)} />
      </Modal>
    </main>
  );
}
