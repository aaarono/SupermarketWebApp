package com.bdas_dva.backend.Model;

import com.bdas_dva.backend.Repository.ObjednavkaProduktId;
import jakarta.persistence.*;

@Entity
@Table(name = "OBJEDNAVKA_PRODUKT")
public class ObjednavkaProdukt {

    @EmbeddedId
    private ObjednavkaProduktId id;

    @ManyToOne
    @MapsId("objednavkaId")
    @JoinColumn(name = "OBJEDNAVKA_ID_OBJEDNAVKY")
    private Objednavka objednavka;

    @ManyToOne
    @MapsId("produktId")
    @JoinColumn(name = "PRODUKT_ID_PRODUKTU")
    private Produkt produkt;

    // Геттеры и сеттеры

    public ObjednavkaProduktId getId() {
        return id;
    }

    public void setId(ObjednavkaProduktId id) {
        this.id = id;
    }

    public Objednavka getObjednavka() {
        return objednavka;
    }

    public void setObjednavka(Objednavka objednavka) {
        this.objednavka = objednavka;
    }

    public Produkt getProdukt() {
        return produkt;
    }

    public void setProdukt(Produkt produkt) {
        this.produkt = produkt;
    }
}
