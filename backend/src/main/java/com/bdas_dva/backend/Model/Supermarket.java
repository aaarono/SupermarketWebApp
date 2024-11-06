package com.bdas_dva.backend.Model;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "SUPERMARKET")
public class Supermarket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID_SUPERMARKETU", nullable = false)
    private Long idSupermarketu;

    @Column(name = "NAZEV", length = 20, nullable = false)
    private String nazev;

    @Column(name = "TELEFON", nullable = false)
    private Long telefon;

    @Column(name = "EMAIL", length = 50, nullable = false)
    private String email;

    // Связи
    @OneToMany(mappedBy = "supermarket")
    private Set<Adresa> adresy;

    @OneToMany(mappedBy = "supermarket")
    private Set<Zamestnanec> zamestnanci;

    @OneToMany(mappedBy = "supermarket")
    private Set<Objednavka> objednavky;

    // Геттеры и сеттеры

    public Long getIdSupermarketu() {
        return idSupermarketu;
    }

    public void setIdSupermarketu(Long idSupermarketu) {
        this.idSupermarketu = idSupermarketu;
    }

    public String getNazev() {
        return nazev;
    }

    public void setNazev(String nazev) {
        this.nazev = nazev;
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

    public Set<Adresa> getAdresy() {
        return adresy;
    }

    public void setAdresy(Set<Adresa> adresy) {
        this.adresy = adresy;
    }

    public Set<Zamestnanec> getZamestnanci() {
        return zamestnanci;
    }

    public void setZamestnanci(Set<Zamestnanec> zamestnanci) {
        this.zamestnanci = zamestnanci;
    }

    public Set<Objednavka> getObjednavky() {
        return objednavky;
    }

    public void setObjednavky(Set<Objednavka> objednavky) {
        this.objednavky = objednavky;
    }
}
