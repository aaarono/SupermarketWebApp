package com.bdas_dva.backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "SKLAD")
public class Sklad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_SKLADU", nullable = false)
    private Long idSkladu;

    @Column(name = "NAZEV", length = 30, nullable = false)
    private String nazev;

    @Column(name = "TELEFON", nullable = false)
    private Long telefon;

    @Column(name = "EMAIL", length = 50, nullable = false)
    private String email;

    @ManyToOne
    @JoinColumn(name = "ADRESA_ID_ADRESY")
    private Adresa adresa;

    // Геттеры и сеттеры

    public Long getIdSkladu() {
        return idSkladu;
    }

    public void setIdSkladu(Long idSkladu) {
        this.idSkladu = idSkladu;
    }

    public String getNazev() {
        return nazev;
    }

    public void setNazev(String nazev) {
        this.nazev = nazev;
    }

    public Long getTelefon() {
        return telefon;
    }

    public void setTelefon(Long telefon) {
        this.telefon = telefon;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Adresa getAdresa() {
        return adresa;
    }

    public void setAdresa(Adresa adresa) {
        this.adresa = adresa;
    }
}
