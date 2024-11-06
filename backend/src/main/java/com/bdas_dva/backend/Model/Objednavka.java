package com.bdas_dva.backend.Model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.Set;

@Entity
@Table(name = "OBJEDNAVKA")
public class Objednavka {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_OBJEDNAVKY", nullable = false)
    private Long idObjednavky;

    @Column(name = "DATUM", nullable = false)
    private LocalDate datum;

    @Column(name = "STAV", length = 30, nullable = false)
    private String stav;

    @Column(name = "MNOZSTVIPRODUKTU", nullable = false)
    private Integer mnozstviProduktu;

    @Column(name = "POZNAMKA", length = 700)
    private String poznamka;

    @ManyToOne
    @JoinColumn(name = "SUPERMARKET_ID_SUPERMARKETU", nullable = false)
    private Supermarket supermarket;

    @ManyToOne
    @JoinColumn(name = "ZAKAZNIK_ID_ZAKAZNIKU")
    private Zakaznik zakaznik;

    @OneToMany(mappedBy = "objednavka")
    private Set<Platba> platby;

    @OneToMany(mappedBy = "objednavka")
    private Set<HistorieObjednavek> historieObjednavek;

    @ManyToMany
    @JoinTable(
            name = "OBJEDNAVKA_PRODUKT",
            joinColumns = @JoinColumn(name = "OBJEDNAVKA_ID_OBJEDNAVKY"),
            inverseJoinColumns = @JoinColumn(name = "PRODUKT_ID_PRODUKTU")
    )
    private Set<Produkt> produkty;

    // Геттеры и сеттеры

    public Long getIdObjednavky() {
        return idObjednavky;
    }

    public void setIdObjednavky(Long idObjednavky) {
        this.idObjednavky = idObjednavky;
    }

    public LocalDate getDatum() {
        return datum;
    }

    public void setDatum(LocalDate datum) {
        this.datum = datum;
    }

    public String getStav() {
        return stav;
    }

    public void setStav(String stav) {
        this.stav = stav;
    }

    public Integer getMnozstviProduktu() {
        return mnozstviProduktu;
    }

    public void setMnozstviProduktu(Integer mnozstviProduktu) {
        this.mnozstviProduktu = mnozstviProduktu;
    }

    public String getPoznamka() {
        return poznamka;
    }

    public void setPoznamka(String poznamka) {
        this.poznamka = poznamka;
    }

    public Supermarket getSupermarket() {
        return supermarket;
    }

    public void setSupermarket(Supermarket supermarket) {
        this.supermarket = supermarket;
    }

    public Zakaznik getZakaznik() {
        return zakaznik;
    }

    public void setZakaznik(Zakaznik zakaznik) {
        this.zakaznik = zakaznik;
    }

    public Set<Platba> getPlatby() {
        return platby;
    }

    public void setPlatby(Set<Platba> platby) {
        this.platby = platby;
    }

    public Set<HistorieObjednavek> getHistorieObjednavek() {
        return historieObjednavek;
    }

    public void setHistorieObjednavek(Set<HistorieObjednavek> historieObjednavek) {
        this.historieObjednavek = historieObjednavek;
    }

    public Set<Produkt> getProdukty() {
        return produkty;
    }

    public void setProdukty(Set<Produkt> produkty) {
        this.produkty = produkty;
    }
}
