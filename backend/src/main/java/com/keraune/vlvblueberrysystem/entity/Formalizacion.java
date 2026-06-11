package com.keraune.vlvblueberrysystem.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "formalizaciones")
public class Formalizacion extends AuditableEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "lote_id", nullable = false)
    private Lote lote;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "cama_id", nullable = false)
    private Cama cama;
    @Column(name = "fecha_formalizacion", nullable = false)
    private LocalDate fechaFormalizacion;
    @Column(nullable = false, length = 180)
    private String detalle;
    @Column(name = "cantidad_bandejas", nullable = false)
    private Integer cantidadBandejas;
    @Column(name = "cantidad_plantas", nullable = false)
    private Integer cantidadPlantas;
    @Column(length = 255)
    private String observacion;
    @Column(nullable = false, length = 30)
    private String estado = "REGISTRADA";
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "usuario_registro_id", nullable = false)
    private User usuarioRegistro;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Lote getLote() { return lote; }
    public void setLote(Lote lote) { this.lote = lote; }
    public Cama getCama() { return cama; }
    public void setCama(Cama cama) { this.cama = cama; }
    public LocalDate getFechaFormalizacion() { return fechaFormalizacion; }
    public void setFechaFormalizacion(LocalDate fechaFormalizacion) { this.fechaFormalizacion = fechaFormalizacion; }
    public String getDetalle() { return detalle; }
    public void setDetalle(String detalle) { this.detalle = detalle; }
    public Integer getCantidadBandejas() { return cantidadBandejas; }
    public void setCantidadBandejas(Integer cantidadBandejas) { this.cantidadBandejas = cantidadBandejas; }
    public Integer getCantidadPlantas() { return cantidadPlantas; }
    public void setCantidadPlantas(Integer cantidadPlantas) { this.cantidadPlantas = cantidadPlantas; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public User getUsuarioRegistro() { return usuarioRegistro; }
    public void setUsuarioRegistro(User usuarioRegistro) { this.usuarioRegistro = usuarioRegistro; }
}
