package com.bdas_dva.backend.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "Faktura")
public class Faktura {

    @Id
    @Column(name = "ID_PLATBY", nullable = false)
    private Long idPlatby;

    @Column(name = "CISLOUCTU", nullable = false)
    private Long cisloUctu;

    @Column(name = "DATUMSPLATNOSTI", nullable = false)
    private LocalDate datumSplatnosti;

    // Связь с сущностью Platba (предполагается)
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

    public Long getCisloUctu() {
        return cisloUctu;
    }

    public void setCisloUctu(Long cisloUctu) {
        this.cisloUctu = cisloUctu;
    }

    public LocalDate getDatumSplatnosti() {
        return datumSplatnosti;
    }

    public void setDatumSplatnosti(LocalDate datumSplatnosti) {
        this.datumSplatnosti = datumSplatnosti;
    }

    public Platba getPlatba() {
        return platba;
    }

    public void setPlatba(Platba platba) {
        this.platba = platba;
    }
}
