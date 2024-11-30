package com.bdas_dva.backend.Model;

public class Customer {
    private Long id;
    private String jmeno;      // Имя
    private String prijmeni;   // Фамилия
    private String email;
    private Long telefon;      // Телефон

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getTelefon() {
        return telefon;
    }

    public void setTelefon(Long telefon) {
        this.telefon = telefon;
    }

    // Конструкторы
    public Customer() {
    }

    public Customer(Long id, String jmeno, String prijmeni, String email, Long telefon) {
        this.id = id;
        this.jmeno = jmeno;
        this.prijmeni = prijmeni;
        this.email = email;
        this.telefon = telefon;
    }

    // Геттеры и сеттеры
}
