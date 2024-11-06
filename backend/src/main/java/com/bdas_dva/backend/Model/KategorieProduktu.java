package com.bdas_dva.backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "KATEGORIE_PRODUKTU")
public class KategorieProduktu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_KATEGORIE")
    private Long idKategorie;

    @Column(name = "NAZEV", length = 50, nullable = false)
    private String nazev;

    // Геттеры и сеттеры

    public Long getIdKategorie() {
        return idKategorie;
    }

    public void setIdKategorie(Long idKategorie) {
        this.idKategorie = idKategorie;
    }

    public String getNazev() {
        return nazev;
    }

    public void setNazev(String nazev) {
        this.nazev = nazev;
    }
}
