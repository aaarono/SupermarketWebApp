package com.bdas_dva.backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "KARTA")
public class Karta {

    @Id
    @Column(name = "ID_PLATBY", nullable = false)
    private Long idPlatby;

    @Column(name = "CISLOKARTY", nullable = false)
    private Long cisloKarty;

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

    public Long getCisloKarty() {
        return cisloKarty;
    }

    public void setCisloKarty(Long cisloKarty) {
        this.cisloKarty = cisloKarty;
    }

    public Platba getPlatba() {
        return platba;
    }

    public void setPlatba(Platba platba) {
        this.platba = platba;
    }
}
