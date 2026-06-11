package com.keraune.vlvblueberrysystem.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "despachos")
public class Despacho extends AuditableEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "lote_id", nullable = false)
    private Lote lote;
    @Column(name = "fecha_despacho", nullable = false)
    private LocalDate fechaDespacho;
    @Column(name = "modalidad_despacho", nullable = false, length = 80)
    private String modalidadDespacho;
    @Column(name = "modalidad", length = 80)
    private String modalidad;
    @Column(name = "cantidad_despachada", nullable = false)
    private Integer cantidadDespachada;
    @Column(name = "cantidad")
    private Integer cantidad;
    @Column(length = 120)
    private String destino;
    @Column(name = "guia_remision", length = 80)
    private String guiaRemision;
    @Column(name = "validacion_calidad", nullable = false, length = 120)
    private String validacionCalidad;
    @Column(length = 255)
    private String observacion;
    @Column(nullable = false, length = 30)
    private String estado = "REGISTRADO";
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "usuario_registro_id", nullable = false)
    private User usuarioRegistro;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Lote getLote() { return lote; }
    public void setLote(Lote lote) { this.lote = lote; }
    public LocalDate getFechaDespacho() { return fechaDespacho; }
    public void setFechaDespacho(LocalDate fechaDespacho) { this.fechaDespacho = fechaDespacho; }
    public String getModalidadDespacho() { return modalidadDespacho; }
    public void setModalidadDespacho(String modalidadDespacho) { this.modalidadDespacho = modalidadDespacho; }
    public String getModalidad() { return modalidad; }
    public void setModalidad(String modalidad) { this.modalidad = modalidad; }
    public Integer getCantidadDespachada() { return cantidadDespachada; }
    public void setCantidadDespachada(Integer cantidadDespachada) { this.cantidadDespachada = cantidadDespachada; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public String getDestino() { return destino; }
    public void setDestino(String destino) { this.destino = destino; }
    public String getGuiaRemision() { return guiaRemision; }
    public void setGuiaRemision(String guiaRemision) { this.guiaRemision = guiaRemision; }
    public String getValidacionCalidad() { return validacionCalidad; }
    public void setValidacionCalidad(String validacionCalidad) { this.validacionCalidad = validacionCalidad; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public User getUsuarioRegistro() { return usuarioRegistro; }
    public void setUsuarioRegistro(User usuarioRegistro) { this.usuarioRegistro = usuarioRegistro; }
}
