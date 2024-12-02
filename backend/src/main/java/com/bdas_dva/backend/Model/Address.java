package com.bdas_dva.backend.Model;

public class Address {
    private Long idAdresy;
    private String ulice;
    private String psc;
    private String mesto;
    private String cisloPopisne;

    // Конструкторы
    public Address() {}

    public Address(Long idAdresy, String ulice, String psc, String mesto, String cisloPopisne) {
        this.idAdresy = idAdresy;
        this.ulice = ulice;
        this.psc = psc;
        this.mesto = mesto;
        this.cisloPopisne = cisloPopisne;
    }

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

    public String getPsc() {
        return psc;
    }

    public void setPsc(String psc) {
        this.psc = psc;
    }

    public String getMesto() {
        return mesto;
    }

    public void setMesto(String mesto) {
        this.mesto = mesto;
    }

    public String getCisloPopisne() {
        return cisloPopisne;
    }

    public void setCisloPopisne(String cisloPopisne) {
        this.cisloPopisne = cisloPopisne;
    }
}
