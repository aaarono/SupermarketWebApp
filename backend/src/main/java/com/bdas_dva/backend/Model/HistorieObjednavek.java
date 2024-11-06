package com.bdas_dva.backend.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "HISTORIE_OBJEDNAVEK")
public class HistorieObjednavek {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_HISTORIE", nullable = false)
    private Long idHistorie;

    @Column(name = "DATUMZMENY", nullable = false)
    private LocalDate datumZmeny;

    @Column(name = "STAVZMENY", length = 30, nullable = false)
    private String stavZmeny;

    @ManyToOne
    @JoinColumn(name = "OBJEDNAVKA_ID_OBJEDNAVKY", nullable = false)
    private Objednavka objednavka;

    // Геттеры и сеттеры

    public Long getIdHistorie() {
        return idHistorie;
    }

    public void setIdHistorie(Long idHistorie) {
        this.idHistorie = idHistorie;
    }

    public LocalDate getDatumZmeny() {
        return datumZmeny;
    }

    public void setDatumZmeny(LocalDate datumZmeny) {
        this.datumZmeny = datumZmeny;
    }

    public String getStavZmeny() {
        return stavZmeny;
    }

    public void setStavZmeny(String stavZmeny) {
        this.stavZmeny = stavZmeny;
    }

    public Objednavka getObjednavka() {
        return objednavka;
    }

    public void setObjednavka(Objednavka objednavka) {
        this.objednavka = objednavka;
    }
}
