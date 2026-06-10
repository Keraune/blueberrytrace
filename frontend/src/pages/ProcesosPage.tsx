import { useMemo, useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { Modal } from '../components/Modal';
import { ModuleHeader } from '../components/ModuleHeader';
import { ProcesoForm } from '../components/ProcesoForm';
import { StatusBadge } from '../components/StatusBadge';
import { blueberryApi } from '../lib/api';
import { dateShort, numberCompact } from '../lib/format';
import type { CamaResponse, FormalizacionFormPayload, ProcesoOperativoResponse, ReferenceResponse, SiembraResponse, UniformizacionFormPayload } from '../types/api';

interface ProcesosPageProps {
  procesos: ProcesoOperativoResponse | null;
  lotes: ReferenceResponse[];
  camas: CamaResponse[];
  siembras: SiembraResponse[];
  onProcesosChange: (items: ProcesoOperativoResponse) => void;
}

export function ProcesosPage({ procesos, lotes, camas, siembras, onProcesosChange }: ProcesosPageProps) {
  const [modal, setModal] = useState<'uniformizacion' | 'formalizacion' | null>(null);
  const uniformizaciones = procesos?.uniformizaciones.items || [];
  const aggregated = useMemo(() => {
    return lotes.map((lote) => {
      const siembrasLote = siembras.filter((siembra) => siembra.lote?.id === lote.id);
      const planted = siembrasLote.reduce((total, siembra) => total + (siembra.cantidadRegistrada || 0), 0);
      const registros = uniformizaciones.filter((registro) => registro.lote?.id === lote.id);
      const uniformized = registros.reduce((total, registro) => total + (registro.cantidadUniformizada || 0), 0);
      const latest = registros[0];
      const progress = planted === 0 ? 0 : Math.min(100, Math.round((uniformized / planted) * 100));
      return {
        lote,
        planted,
        uniformized,
        progress,
        latest,
        status: progress >= 100 ? 'COMPLETADO' : progress > 0 ? 'EN PROCESO' : 'PENDIENTE'
      };
    }).filter((item) => item.planted > 0 || item.uniformized > 0).slice(0, 6);
  }, [lotes, siembras, uniformizaciones]);

  async function createUniformizacion(payload: UniformizacionFormPayload | FormalizacionFormPayload) {
    onProcesosChange(await blueberryApi.createUniformizacion(payload as UniformizacionFormPayload));
    setModal(null);
  }

  async function createFormalizacion(payload: UniformizacionFormPayload | FormalizacionFormPayload) {
    onProcesosChange(await blueberryApi.createFormalizacion(payload as FormalizacionFormPayload));
    setModal(null);
  }

  return (
    <main className="content-grid">
      <ModuleHeader
        eyebrow="Proceso productivo"
        title="Uniformización y Formalización"
        description="Control del proceso de uniformización de plantas por lote."
        actions={<div className="button-group"><button type="button" className="ghost-button" onClick={() => setModal('uniformizacion')}><Plus size={15} /> Uniformización</button><button type="button" className="action-button" onClick={() => setModal('formalizacion')}><Plus size={15} /> Formalización</button></div>}
      />

      <div className="module-utility-row">
        <button type="button" className="ghost-button"><Download size={15} /> Exportar reporte</button>
      </div>

      <section className="stacked-process-list">
        {aggregated.map((item) => (
          <article className="process-card" key={item.lote.id}>
            <div className="process-card__header">
              <div className="process-card__identity">
                <span className="process-card__icon">◎</span>
                <div>
                  <div className="process-card__title"><strong>{item.lote.codigo}</strong> <span>{item.lote.descripcion || 'Invernadero'}</span></div>
                  <small>{numberCompact(item.planted)} plantas · Actualizado: {dateShort(item.latest?.fechaActualizacion || item.latest?.fechaCreacion || null)}</small>
                </div>
              </div>
              <div className="process-card__meta">
                <StatusBadge value={item.status} />
                <strong>{item.progress}%</strong>
              </div>
            </div>
            <span className="process-card__caption">Progreso de uniformización</span>
            <div className="progress-track progress-track--wide"><span style={{ width: `${item.progress}%` }} /></div>
            <div className="process-card__footer">
              <span>{numberCompact(item.uniformized)} uniformizadas</span>
              <span>{numberCompact(item.planted)} sembradas</span>
            </div>
          </article>
        ))}
      </section>

      <Modal open={modal === 'uniformizacion'} title="Nueva uniformización" description="Registra cantidad inicial y cantidad uniformizada." onClose={() => setModal(null)}>
        <ProcesoForm mode="uniformizacion" lotes={lotes} camas={camas} onSubmit={createUniformizacion} onCancel={() => setModal(null)} />
      </Modal>
      <Modal open={modal === 'formalizacion'} title="Nueva formalización" description="Registra bandejas y plantas formalizadas." onClose={() => setModal(null)}>
        <ProcesoForm mode="formalizacion" lotes={lotes} camas={camas} onSubmit={createFormalizacion} onCancel={() => setModal(null)} />
      </Modal>
    </main>
  );
}
