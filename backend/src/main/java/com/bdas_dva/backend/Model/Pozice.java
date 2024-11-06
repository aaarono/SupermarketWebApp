package com.bdas_dva.backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "POZICE")
public class Pozice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_POZICE", nullable = false)
    private Long idPozice;

    @Column(name = "NAZEV", length = 50, nullable = false)
    private String nazev;

    @Column(name = "MZDA", nullable = false)
    private Double mzda;

    // Геттеры и сеттеры

    public Long getIdPozice() {
        return idPozice;
    }

    public void setIdPozice(Long idPozice) {
        this.idPozice = idPozice;
    }

    public String getNazev() {
        return nazev;
    }

    public void setNazev(String nazev) {
        this.nazev = nazev;
    }

    public Double getMzda() {
        return mzda;
    }

    public void setMzda(Double mzda) {
        this.mzda = mzda;
    }
}
