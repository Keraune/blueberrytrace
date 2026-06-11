package com.keraune.vlvblueberrysystem.api.mapper;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.*;
import com.keraune.vlvblueberrysystem.dto.TrazabilidadRow;
import com.keraune.vlvblueberrysystem.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ApiRecordMapper {
    public UserReferenceResponse user(User user) {
        if (user == null) return null;
        return new UserReferenceResponse(
                user.getId(),
                user.getUsername(),
                user.getNombreCompleto(),
                user.getEmail(),
                user.getCargo(),
                user.getTelefono(),
                user.getAvatarColor(),
                user.getRole() != null ? user.getRole().getNombre() : null,
                Boolean.TRUE.equals(user.getEstado()),
                user.getFechaCreacion(),
                user.getFechaActualizacion()
        );
    }

    public ReferenceResponse reference(Lote lote) {
        if (lote == null) return null;
        return new ReferenceResponse(lote.getId(), lote.getCodigo(), lote.getDescripcion());
    }

    public ReferenceResponse reference(Cama cama) {
        if (cama == null) return null;
        return new ReferenceResponse(cama.getId(), cama.getCodigo(), cama.getDescripcion());
    }

    public LoteResponse lote(Lote lote) {
        return new LoteResponse(lote.getId(), lote.getCodigo(), lote.getDescripcion(), lote.getCultivo(), lote.getVariedad(),
                lote.getFechaRegistro(), lote.getObservacion(), lote.getEstado(), user(lote.getUsuarioRegistro()),
                lote.getFechaCreacion(), lote.getFechaActualizacion());
    }

    public CamaResponse cama(Cama cama) {
        return new CamaResponse(cama.getId(), cama.getCodigo(), cama.getDescripcion(), cama.getCapacidadReferencial(), cama.getEstado(),
                reference(cama.getLote()), user(cama.getUsuarioRegistro()), cama.getFechaCreacion(), cama.getFechaActualizacion());
    }

    public SiembraResponse siembra(Siembra siembra) {
        return new SiembraResponse(siembra.getId(), reference(siembra.getLote()), reference(siembra.getCama()), siembra.getFechaSiembra(),
                siembra.getCantidadRegistrada(), siembra.getObservacion(), siembra.getEstado(), user(siembra.getUsuarioRegistro()),
                siembra.getFechaCreacion(), siembra.getFechaActualizacion());
    }

    public UniformizacionResponse uniformizacion(Uniformizacion uniformizacion) {
        return new UniformizacionResponse(uniformizacion.getId(), reference(uniformizacion.getLote()), reference(uniformizacion.getCama()),
                uniformizacion.getFechaUniformizacion(), uniformizacion.getCriterio(), uniformizacion.getCantidadInicial(),
                uniformizacion.getCantidadUniformizada(), uniformizacion.getObservacion(), uniformizacion.getEstado(),
                user(uniformizacion.getUsuarioRegistro()), uniformizacion.getFechaCreacion(), uniformizacion.getFechaActualizacion());
    }

    public FormalizacionResponse formalizacion(Formalizacion formalizacion) {
        return new FormalizacionResponse(formalizacion.getId(), reference(formalizacion.getLote()), reference(formalizacion.getCama()),
                formalizacion.getFechaFormalizacion(), formalizacion.getDetalle(), formalizacion.getCantidadBandejas(),
                formalizacion.getCantidadPlantas(), formalizacion.getObservacion(), formalizacion.getEstado(),
                user(formalizacion.getUsuarioRegistro()), formalizacion.getFechaCreacion(), formalizacion.getFechaActualizacion());
    }

    public ClasificacionResponse clasificacion(Clasificacion clasificacion) {
        return new ClasificacionResponse(clasificacion.getId(), reference(clasificacion.getLote()), reference(clasificacion.getCama()),
                clasificacion.getFechaClasificacion(), clasificacion.getEstadoPlanta(), clasificacion.getTamano(),
                clasificacion.getCondicion(), clasificacion.getCantidad(), clasificacion.getObservacion(), clasificacion.getEstado(),
                user(clasificacion.getUsuarioRegistro()), clasificacion.getFechaCreacion(), clasificacion.getFechaActualizacion());
    }

    public DespachoResponse despacho(Despacho despacho) {
        String modalidad = despacho.getModalidadDespacho() != null ? despacho.getModalidadDespacho() : despacho.getModalidad();
        return new DespachoResponse(despacho.getId(), reference(despacho.getLote()), despacho.getFechaDespacho(), modalidad,
                despacho.getCantidadDespachada(), despacho.getDestino(), despacho.getGuiaRemision(), despacho.getValidacionCalidad(),
                despacho.getObservacion(), despacho.getEstado(), user(despacho.getUsuarioRegistro()),
                despacho.getFechaCreacion(), despacho.getFechaActualizacion());
    }

    public TrazabilidadResponse trazabilidad(TrazabilidadRow row) {
        return new TrazabilidadResponse(row.id(), new ReferenceResponse(row.loteId(), row.codigoLote(), row.descripcionLote()),
                row.camas(), row.siembras(), row.plantasSembradas(), row.uniformizaciones(), row.formalizaciones(),
                row.clasificaciones(), row.despachos(), row.plantasDespachadas(), row.ultimoEvento());
    }

    public <T> ListResponse<T> list(List<T> items) {
        return new ListResponse<>(items.size(), items);
    }
}
