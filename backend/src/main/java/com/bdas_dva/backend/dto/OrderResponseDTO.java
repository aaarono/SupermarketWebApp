package com.bdas_dva.backend.dto;

import java.util.Date;

public class OrderResponseDTO {
    private Long idObjednavky;
    private Date datum;
    private String stav;
    private Integer mnozstvi;
    private String ulice;
    private Integer psc;
    private String mesto;
    private Integer cisloPopisne;
    private Long telefon;
    private String email;
    private String jmeno;
    private String prijmeni;
    private Double suma;
    private String typ;
    private String[] products;

    public Long getIdObjednavky() {
        return idObjednavky;
    }

    public void setIdObjednavky(Long idObjednavky) {
        this.idObjednavky = idObjednavky;
    }

    public Date getDatum() {
        return datum;
    }

    public void setDatum(Date datum) {
        this.datum = datum;
    }

    public String getStav() {
        return stav;
    }

    public void setStav(String stav) {
        this.stav = stav;
    }

    public Integer getMnozstvi() {
        return mnozstvi;
    }

    public void setMnozstvi(Integer mnozstvi) {
        this.mnozstvi = mnozstvi;
    }

    public String getUlice() {
        return ulice;
    }

    public void setUlice(String ulice) {
        this.ulice = ulice;
    }

    public Integer getPsc() {
        return psc;
    }

    public void setPsc(Integer psc) {
        this.psc = psc;
    }

    public String getMesto() {
        return mesto;
    }

    public void setMesto(String mesto) {
        this.mesto = mesto;
    }

    public Integer getCisloPopisne() {
        return cisloPopisne;
    }

    public void setCisloPopisne(Integer cisloPopisne) {
        this.cisloPopisne = cisloPopisne;
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

    public Double getSuma() {
        return suma;
    }

    public void setSuma(Double suma) {
        this.suma = suma;
    }

    public String getTyp() {
        return typ;
    }

    public void setTyp(String typ) {
        this.typ = typ;
    }

    public String[] getProducts() {
        return products;
    }

    public void setProducts(String[] products) {
        this.products = products;
    }

    // Геттеры и сеттеры для всех полей
}
