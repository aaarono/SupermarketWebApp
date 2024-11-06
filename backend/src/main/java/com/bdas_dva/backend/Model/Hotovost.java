package com.bdas_dva.backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "HOTOVOST")
public class Hotovost {

    @Id
    @Column(name = "ID_PLATBY", nullable = false)
    private Long idPlatby;

    @Column(name = "PRIJATO", nullable = false)
    private Long prijato;

    @Column(name = "VRACENO", nullable = false)
    private Long vraceno;

    // Связь с сущностью Platba
    @OneToOne
    @MapsId
    @JoinColumn(name = "ID_PLATBY")
    private Platba platba;

    // Геттеры и сеттеры

    public Long getIdPlatby() {
        return idPlatby;
    }

    public void setIdPlatby(Long idPlatby) {
        this.idPlatby = idPlatby;
    }

    public Long getPrijato() {
        return prijato;
    }

    public void setPrijato(Long prijato) {
        this.prijato = prijato;
    }

    public Long getVraceno() {
        return vraceno;
    }

    public void setVraceno(Long vraceno) {
        this.vraceno = vraceno;
    }

    public Platba getPlatba() {
        return platba;
    }

    public void setPlatba(Platba platba) {
        this.platba = platba;
    }
}
