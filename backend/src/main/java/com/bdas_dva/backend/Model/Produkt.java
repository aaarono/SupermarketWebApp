package com.bdas_dva.backend.Model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "PRODUKT")
public class Produkt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_PRODUKTU", nullable = false)
    private Long idProduktu;

    @Column(name = "NAZEV", length = 50, nullable = false)
    private String nazev;

    @Column(name = "CENA", nullable = false)
    private Double cena;

    @Column(name = "POPIS", length = 700)
    private String popis;

    @ManyToOne
    @JoinColumn(name = "KATEG_PRODUKTU_ID_KATEGORIE", nullable = false)
    private KategorieProduktu kategorieProduktu;

    @ManyToOne
    @JoinColumn(name = "SKLAD_ID_SKLADU", nullable = false)
    private Sklad sklad;

    @ManyToMany(mappedBy = "produkty")
    private Set<Objednavka> objednavky;

    @ManyToMany
    @JoinTable(
            name = "PRODUKT_DODAVATEL",
            joinColumns = @JoinColumn(name = "PRODUKT_ID_PRODUKTU"),
            inverseJoinColumns = @JoinColumn(name = "DODAVATEL_ID_DODAVATELU")
    )
    private Set<Dodavatel> dodavatele;

    // Геттеры и сеттеры

    public Long getIdProduktu() {
        return idProduktu;
    }

    public void setIdProduktu(Long idProduktu) {
        this.idProduktu = idProduktu;
    }

    public String getNazev() {
        return nazev;
    }

    public void setNazev(String nazev) {
        this.nazev = nazev;
    }

    public Double getCena() {
        return cena;
    }

    public void setCena(Double cena) {
        this.cena = cena;
    }

    public String getPopis() {
        return popis;
    }

    public void setPopis(String popis) {
        this.popis = popis;
    }

    public KategorieProduktu getKategorieProduktu() {
        return kategorieProduktu;
    }

    public void setKategorieProduktu(KategorieProduktu kategorieProduktu) {
        this.kategorieProduktu = kategorieProduktu;
    }

    public Sklad getSklad() {
        return sklad;
    }

    public void setSklad(Sklad sklad) {
        this.sklad = sklad;
    }

    public Set<Objednavka> getObjednavky() {
        return objednavky;
    }

    public void setObjednavky(Set<Objednavka> objednavky) {
        this.objednavky = objednavky;
    }

    public Set<Dodavatel> getDodavatele() {
        return dodavatele;
    }

    public void setDodavatele(Set<Dodavatel> dodavatele) {
        this.dodavatele = dodavatele;
    }
}
