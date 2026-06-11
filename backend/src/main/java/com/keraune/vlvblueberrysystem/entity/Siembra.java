package com.keraune.vlvblueberrysystem.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "siembras")
public class Siembra extends AuditableEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "lote_id", nullable = false)
    private Lote lote;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "cama_id", nullable = false)
    private Cama cama;
    @Column(name = "fecha_siembra", nullable = false)
    private LocalDate fechaSiembra;
    @Column(name = "cantidad_registrada", nullable = false)
    private Integer cantidadRegistrada;
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
    public LocalDate getFechaSiembra() { return fechaSiembra; }
    public void setFechaSiembra(LocalDate fechaSiembra) { this.fechaSiembra = fechaSiembra; }
    public Integer getCantidadRegistrada() { return cantidadRegistrada; }
    public void setCantidadRegistrada(Integer cantidadRegistrada) { this.cantidadRegistrada = cantidadRegistrada; }
    public String getObservacion() { return observacion; }
    public void setObservacion(String observacion) { this.observacion = observacion; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public User getUsuarioRegistro() { return usuarioRegistro; }
    public void setUsuarioRegistro(User usuarioRegistro) { this.usuarioRegistro = usuarioRegistro; }
}
