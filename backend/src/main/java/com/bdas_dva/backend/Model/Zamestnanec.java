package com.bdas_dva.backend.Model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "ZAMNESTNANEC")
public class Zamestnanec {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ZAMNESTNANCE", nullable = false)
    private Long idZamestnance;

    @Column(name = "JMENO", length = 20, nullable = false)
    private String jmeno;

    @Column(name = "PRIJMENI", length = 20, nullable = false)
    private String prijmeni;

    @Column(name = "DATUMZAMESTNANI", nullable = false)
    private LocalDate datumZamestnani;

    @Column(name = "PRACOVNIDOBA", nullable = false)
    private Integer pracovniDoba;

    @ManyToOne
    @JoinColumn(name = "SUPERMARKET_ID_SUPERMARKETU", nullable = false)
    private Supermarket supermarket;

    @ManyToOne
    @JoinColumn(name = "POZICE_ID_POZICE", nullable = false)
    private Pozice pozice;

    @ManyToOne
    @JoinColumn(name = "SKLAD_ID_SKLADU", nullable = false)
    private Sklad sklad;

    @OneToOne
    @JoinColumn(name = "ZAMNESTNANEC_ID_ZAMNESTNANCE")
    private Zamestnanec nadrazeny;

    @ManyToOne
    @JoinColumn(name = "ADRESA_ID_ADRESY")
    private Adresa adresa;

    // Геттеры и сеттеры

    public Long getIdZamestnance() {
        return idZamestnance;
    }

    public void setIdZamestnance(Long idZamestnance) {
        this.idZamestnance = idZamestnance;
    }

    public String getJmeno() {
        return jmeno;
    }

    public void setJmeno(String jmeno) {
        this.jmeno = jmeno;
    }

    public String getPrijmeni() {
        return prijmeni;
    }

    public void setPrijmeni(String prijmeni) {
        this.prijmeni = prijmeni;
    }

    public LocalDate getDatumZamestnani() {
        return datumZamestnani;
    }

    public void setDatumZamestnani(LocalDate datumZamestnani) {
        this.datumZamestnani = datumZamestnani;
    }

    public Integer getPracovniDoba() {
        return pracovniDoba;
    }

    public void setPracovniDoba(Integer pracovniDoba) {
        this.pracovniDoba = pracovniDoba;
    }

    public Supermarket getSupermarket() {
        return supermarket;
    }

    public void setSupermarket(Supermarket supermarket) {
        this.supermarket = supermarket;
    }

    public Pozice getPozice() {
        return pozice;
    }

    public void setPozice(Pozice pozice) {
        this.pozice = pozice;
    }

    public Sklad getSklad() {
        return sklad;
    }

    public void setSklad(Sklad sklad) {
        this.sklad = sklad;
    }

    public Zamestnanec getNadrazeny() {
        return nadrazeny;
    }

    public void setNadrazeny(Zamestnanec nadrazeny) {
        this.nadrazeny = nadrazeny;
    }

    public Adresa getAdresa() {
        return adresa;
    }

    public void setAdresa(Adresa adresa) {
        this.adresa = adresa;
    }
}
