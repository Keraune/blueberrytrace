import { useMemo, useState } from 'react';
import { Factory, Leaf, Layers3, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { FilterToolbar } from '../components/FilterToolbar';
import { LoteForm } from '../components/LoteForm';
import { MetricCard } from '../components/MetricCard';
import { Modal } from '../components/Modal';
import { ModuleHeader } from '../components/ModuleHeader';
import { StatusBadge } from '../components/StatusBadge';
import { blueberryApi } from '../lib/api';
import { dateShort, numberCompact } from '../lib/format';
import type { LoteFormPayload, LoteResponse } from '../types/api';

interface LotesPageProps {
  lotes: LoteResponse[];
  onLotesChange: (items: LoteResponse[]) => void;
}

export function LotesPage({ lotes, onLotesChange }: LotesPageProps) {
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) {
      return lotes;
    }
    return lotes.filter((lote) => [lote.codigo, lote.descripcion, lote.cultivo, lote.variedad, lote.estado]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [lotes, query]);

  const activos = lotes.filter((lote) => lote.estado === 'ACTIVO').length;
  const variedades = new Set(lotes.map((lote) => lote.variedad).filter(Boolean)).size;

  async function createLote(payload: LoteFormPayload) {
    const response = await blueberryApi.createLote(payload);
    onLotesChange(response.items);
    setModalOpen(false);
  }

  async function toggleStatus(id: number) {
    const response = await blueberryApi.toggleLoteStatus(id);
    onLotesChange(response.items);
  }

  async function deleteLote(id: number) {
    const confirmed = window.confirm('¿Enviar este invernadero a eliminados?');
    if (!confirmed) {
      return;
    }
    const response = await blueberryApi.deleteLote(id);
    onLotesChange(response.items);
  }

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Producción"
        title="Lotes e invernaderos"
        description="Control de invernaderos registrados, variedades activas y estado operativo de cada lote."
        actions={<button className="action-button" type="button" onClick={() => setModalOpen(true)}><Plus size={17} /> Nuevo lote</button>}
      />

      <section className="metrics-grid metrics-grid--three">
        <MetricCard label="Total de lotes" value={lotes.length} detail="registros productivos" icon={<Factory size={20} />} tone="green" />
        <MetricCard label="Activos" value={activos} detail={`${numberCompact(lotes.length - activos)} no activos`} icon={<Leaf size={20} />} tone="blue" />
        <MetricCard label="Variedades" value={variedades} detail="cultivos registrados" icon={<Layers3 size={20} />} tone="purple" />
      </section>

      <section className="panel-card">
        <FilterToolbar value={query} onChange={setQuery} placeholder="Buscar por código, variedad o estado" />
        <DataTable<LoteResponse>
          title="Inventario de invernaderos"
          description="Registros sincronizados desde la API del backend."
          items={filtered}
          columns={[
            { key: 'codigo', label: 'Código' },
            { key: 'cultivo', label: 'Cultivo' },
            { key: 'variedad', label: 'Variedad' },
            { key: 'fechaRegistro', label: 'Registro', render: (item) => dateShort(item.fechaRegistro) },
            { key: 'estado', label: 'Estado', render: (item) => <StatusBadge value={item.estado} /> },
            {
              key: 'acciones',
              label: 'Acciones',
              render: (item) => (
                <div className="table-actions">
                  <button type="button" className="mini-button" onClick={() => toggleStatus(item.id)}><RotateCcw size={14} /> Estado</button>
                  <button type="button" className="mini-button mini-button--danger" onClick={() => deleteLote(item.id)}><Trash2 size={14} /> Eliminar</button>
                </div>
              )
            }
          ]}
        />
      </section>

      <Modal open={modalOpen} title="Nuevo invernadero" description="Registra un lote productivo desde el frontend React." onClose={() => setModalOpen(false)}>
        <LoteForm onSubmit={createLote} onCancel={() => setModalOpen(false)} />
      </Modal>
    </main>
  );
}
