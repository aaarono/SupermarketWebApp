package com.bdas_dva.backend.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Entity
public class Dodavatele {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_DODAVATELU")
    private Long idDodavatele;

    @Column(name = "NAZEV", nullable = false, length = 30)
    private String nazev;

    @Column(name = "KONTAKTNIOSOBA", length = 50)
    private String kontaktniOsoba;

    @Column(name = "TELEFON", nullable = false)
    private Long telefon;

    @Column(name = "EMAIL", length = 50)
    private String email;

    // Геттеры и сеттеры

    public Long getIdDodavatele() {
        return idDodavatele;
    }

    public void setIdDodavatele(Long idDodavatele) {
        this.idDodavatele = idDodavatele;
    }

    public String getNazev() {
        return nazev;
    }

    public void setNazev(String nazev) {
        this.nazev = nazev;
    }

    public String getKontaktniOsoba() {
        return kontaktniOsoba;
    }

    public void setKontaktniOsoba(String kontaktniOsoba) {
        this.kontaktniOsoba = kontaktniOsoba;
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
}
