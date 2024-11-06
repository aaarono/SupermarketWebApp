package com.bdas_dva.backend.Model;

import jakarta.persistence.*;

@Entity
@Table(name = "ZAKAZNIK")
public class Zakaznik {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_ZAKAZNIKU", nullable = false)
    private Long idZakazniku;

    @Column(name = "JMENO", length = 30, nullable = false)
    private String jmeno;

    @Column(name = "PRIJMENI", length = 30, nullable = false)
    private String prijmeni;

    @Column(name = "TELEFON", nullable = false)
    private Long telefon;

    @Column(name = "EMAIL", length = 50, nullable = false)
    private String email;

    @ManyToOne
    @JoinColumn(name = "ADRESA_ID_ADRESY")
    private Adresa adresa;

    // Геттеры и сеттеры

    public Long getIdZakazniku() {
        return idZakazniku;
    }

    public void setIdZakazniku(Long idZakazniku) {
        this.idZakazniku = idZakazniku;
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

    public Adresa getAdresa() {
        return adresa;
    }

    public void setAdresa(Adresa adresa) {
        this.adresa = adresa;
    }
}
