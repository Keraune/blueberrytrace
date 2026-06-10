package com.keraune.vlvblueberrysystem.api.mapper;

import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.CamaResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ClasificacionResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.DespachoResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.FormalizacionResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.LoteResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.ReferenceResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.SiembraResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.TrazabilidadResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.UniformizacionResponse;
import com.keraune.vlvblueberrysystem.api.dto.ApiPayloads.UserReferenceResponse;
import com.keraune.vlvblueberrysystem.dto.TrazabilidadRow;
import com.keraune.vlvblueberrysystem.entity.Cama;
import com.keraune.vlvblueberrysystem.entity.Clasificacion;
import com.keraune.vlvblueberrysystem.entity.Despacho;
import com.keraune.vlvblueberrysystem.entity.Formalizacion;
import com.keraune.vlvblueberrysystem.entity.Lote;
import com.keraune.vlvblueberrysystem.entity.Siembra;
import com.keraune.vlvblueberrysystem.entity.Uniformizacion;
import com.keraune.vlvblueberrysystem.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ApiRecordMapper {

    public LoteResponse toLoteResponse(Lote lote) {
        return new LoteResponse(
                lote.getId(),
                lote.getCodigo(),
                lote.getDescripcion(),
                lote.getCultivo(),
                lote.getVariedad(),
                lote.getFechaRegistro(),
                lote.getObservacion(),
                lote.getEstado(),
                toUserReference(lote.getUsuarioRegistro()),
                lote.getFechaCreacion(),
                lote.getFechaActualizacion()
        );
    }

    public CamaResponse toCamaResponse(Cama cama) {
        return new CamaResponse(
                cama.getId(),
                cama.getCodigo(),
                cama.getDescripcion(),
                cama.getCapacidadReferencial(),
                cama.getEstado(),
                toLoteReference(cama.getLote()),
                toUserReference(cama.getUsuarioRegistro()),
                cama.getFechaCreacion(),
                cama.getFechaActualizacion()
        );
    }

    public SiembraResponse toSiembraResponse(Siembra siembra) {
        return new SiembraResponse(
                siembra.getId(),
                toLoteReference(siembra.getLote()),
                toCamaReference(siembra.getCama()),
                siembra.getFechaSiembra(),
                siembra.getCantidadRegistrada(),
                siembra.getObservacion(),
                siembra.getEstado(),
                toUserReference(siembra.getUsuarioRegistro()),
                siembra.getFechaCreacion(),
                siembra.getFechaActualizacion()
        );
    }

    public UniformizacionResponse toUniformizacionResponse(Uniformizacion uniformizacion) {
        return new UniformizacionResponse(
                uniformizacion.getId(),
                toLoteReference(uniformizacion.getLote()),
                toCamaReference(uniformizacion.getCama()),
                uniformizacion.getFechaUniformizacion(),
                uniformizacion.getCriterio(),
                uniformizacion.getCantidadInicial(),
                uniformizacion.getCantidadUniformizada(),
                uniformizacion.getObservacion(),
                uniformizacion.getEstado(),
                toUserReference(uniformizacion.getUsuarioRegistro()),
                uniformizacion.getFechaCreacion(),
                uniformizacion.getFechaActualizacion()
        );
    }

    public FormalizacionResponse toFormalizacionResponse(Formalizacion formalizacion) {
        return new FormalizacionResponse(
                formalizacion.getId(),
                toLoteReference(formalizacion.getLote()),
                toCamaReference(formalizacion.getCama()),
                formalizacion.getFechaFormalizacion(),
                formalizacion.getDetalle(),
                formalizacion.getCantidadBandejas(),
                formalizacion.getCantidadPlantas(),
                formalizacion.getObservacion(),
                formalizacion.getEstado(),
                toUserReference(formalizacion.getUsuarioRegistro()),
                formalizacion.getFechaCreacion(),
                formalizacion.getFechaActualizacion()
        );
    }

    public ClasificacionResponse toClasificacionResponse(Clasificacion clasificacion) {
        return new ClasificacionResponse(
                clasificacion.getId(),
                toLoteReference(clasificacion.getLote()),
                toCamaReference(clasificacion.getCama()),
                clasificacion.getFechaClasificacion(),
                clasificacion.getEstadoPlanta(),
                clasificacion.getTamano(),
                clasificacion.getCondicion(),
                clasificacion.getCantidad(),
                clasificacion.getObservacion(),
                clasificacion.getEstado(),
                toUserReference(clasificacion.getUsuarioRegistro()),
                clasificacion.getFechaCreacion(),
                clasificacion.getFechaActualizacion()
        );
    }

    public DespachoResponse toDespachoResponse(Despacho despacho) {
        return new DespachoResponse(
                despacho.getId(),
                toLoteReference(despacho.getLote()),
                despacho.getFechaDespacho(),
                despacho.getModalidad(),
                despacho.getCantidadDespachada(),
                despacho.getDestino(),
                despacho.getGuiaRemision(),
                despacho.getValidacionCalidad(),
                despacho.getObservacion(),
                despacho.getEstado(),
                toUserReference(despacho.getUsuarioRegistro()),
                despacho.getFechaCreacion(),
                despacho.getFechaActualizacion()
        );
    }

    public TrazabilidadResponse toTrazabilidadResponse(TrazabilidadRow row) {
        return new TrazabilidadResponse(
                toLoteReference(row.lote()),
                row.camas(),
                row.siembras(),
                row.plantasSembradas(),
                row.uniformizaciones(),
                row.formalizaciones(),
                row.clasificaciones(),
                row.despachos(),
                row.plantasDespachadas(),
                row.ultimoEvento()
        );
    }

    public ReferenceResponse toLoteReference(Lote lote) {
        if (lote == null) {
            return null;
        }
        return new ReferenceResponse(lote.getId(), lote.getCodigo(), lote.getDescripcion());
    }

    public ReferenceResponse toCamaReference(Cama cama) {
        if (cama == null) {
            return null;
        }
        return new ReferenceResponse(cama.getId(), cama.getCodigo(), cama.getDescripcion());
    }

    private UserReferenceResponse toUserReference(User user) {
        if (user == null) {
            return null;
        }
        String roleName = user.getRol() == null ? null : user.getRol().getNombre();
        return new UserReferenceResponse(
                user.getId(),
                user.getUsername(),
                user.getNombreCompleto(),
                user.getEmail(),
                roleName,
                user.getEstado()
        );
    }
}
