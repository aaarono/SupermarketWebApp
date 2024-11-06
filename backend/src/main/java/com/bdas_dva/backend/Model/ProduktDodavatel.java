package com.bdas_dva.backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "PRODUKT_DODAVATEL")
public class ProduktDodavatel {

    @EmbeddedId
    private ProduktDodavatelId id;

    @ManyToOne
    @MapsId("produktId")
    @JoinColumn(name = "PRODUKT_ID_PRODUKTU")
    private Produkt produkt;

    @ManyToOne
    @MapsId("dodavatelId")
    @JoinColumn(name = "DODAVATEL_ID_DODAVATELU")
    private Dodavatel dodavatel;

    // Геттеры и сеттеры

    public ProduktDodavatelId getId() {
        return id;
    }

    public void setId(ProduktDodavatelId id) {
        this.id = id;
    }

    public Produkt getProdukt() {
        return produkt;
    }

    public void setProdukt(Produkt produkt) {
        this.produkt = produkt;
    }

    public Dodavatel getDodavatel() {
        return dodavatel;
    }

    public void setDodavatel(Dodavatel dodavatel) {
        this.dodavatel = dodavatel;
    }
}
