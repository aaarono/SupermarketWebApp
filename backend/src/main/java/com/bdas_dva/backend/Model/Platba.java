package com.bdas_dva.backend.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "PLATBA")
public class Platba {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PLATBY", nullable = false)
    private Long idPlatby;

    @Column(name = "SUMA", nullable = false)
    private Double suma;

    @Column(name = "DATUM", nullable = false)
    private LocalDate datum;

    @Column(name = "TYP", length = 10, nullable = false)
    private String typ;

    @ManyToOne
    @JoinColumn(name = "OBJEDNAVKA_ID_OBJEDNAVKY", nullable = false)
    private Objednavka objednavka;

    // Геттеры и сеттеры

    public Long getIdPlatby() {
        return idPlatby;
    }

    public void setIdPlatby(Long idPlatby) {
        this.idPlatby = idPlatby;
    }

    public Double getSuma() {
        return suma;
    }

    public void setSuma(Double suma) {
        this.suma = suma;
    }

    public LocalDate getDatum() {
        return datum;
    }

    public void setDatum(LocalDate datum) {
        this.datum = datum;
    }

    public String getTyp() {
        return typ;
    }

    public void setTyp(String typ) {
        this.typ = typ;
    }

    public Objednavka getObjednavka() {
        return objednavka;
    }

    public void setObjednavka(Objednavka objednavka) {
        this.objednavka = objednavka;
    }
}
