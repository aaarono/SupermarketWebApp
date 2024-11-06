package com.bdas_dva.backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "ADRESA")
public class Adresa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ADRESY", nullable = false)
    private Long idAdresy;

    @Column(name = "ULICE", length = 50, nullable = false)
    private String ulice;

    @Column(name = "PSC", nullable = false)
    private Long psc;

    @Column(name = "MESTO", length = 50, nullable = false)
    private String mesto;

    @Column(name = "CISLOPOPISNE", nullable = false)
    private Long cisloPopisne;

    @ManyToOne
    @JoinColumn(name = "SUPERMARKET_ID_SUPERMARKETU", nullable = false)
    private Supermarket supermarket;

    // Геттеры и сеттеры

    public Long getIdAdresy() {
        return idAdresy;
    }

    public void setIdAdresy(Long idAdresy) {
        this.idAdresy = idAdresy;
    }

    public String getUlice() {
        return ulice;
    }

    public void setUlice(String ulice) {
        this.ulice = ulice;
    }

    public Long getPsc() {
        return psc;
    }

    public void setPsc(Long psc) {
        this.psc = psc;
    }

    public String getMesto() {
        return mesto;
    }

    public void setMesto(String mesto) {
        this.mesto = mesto;
    }

    public Long getCisloPopisne() {
        return cisloPopisne;
    }

    public void setCisloPopisne(Long cisloPopisne) {
        this.cisloPopisne = cisloPopisne;
    }

    public Supermarket getSupermarket() {
        return supermarket;
    }

    public void setSupermarket(Supermarket supermarket) {
        this.supermarket = supermarket;
    }
}
