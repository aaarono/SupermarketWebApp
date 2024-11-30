package com.bdas_dva.backend.Model;

public class Address {
    private Long id;
    private String ulice;          // Улица
    private Integer psc;           // Почтовый индекс
    private String mesto;          // Город
    private Integer cisloPopisne;  // Номер дома

    // Конструкторы
    public Address() {
    }

    public Address(Long id, String ulice, Integer psc, String mesto, Integer cisloPopisne) {
        this.id = id;
        this.ulice = ulice;
        this.psc = psc;
        this.mesto = mesto;
        this.cisloPopisne = cisloPopisne;
    }

    // Геттеры и сеттеры
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    // Остальные геттеры и сеттеры
}
