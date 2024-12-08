package com.bdas_dva.backend.Model.Zamestnanec;

import java.util.Date;

public class Zamestnanec {
    private Long idZamestnance;
    private Date datumZamestnani;
    private Integer pracovnidoba;
    private Long supermarketIdSupermarketu;
    private Long skladIdSkladu;
    private Long zamestnanecIdZamestnance;
    private Long adresaIdAdresy;
    private String jmeno;
    private String prijmeni;
    private Double mzda;
    private Long poziceIdPozice;
    private Integer level; // Уровень иерархии
    private String employeeName; // Полное имя сотрудника

    // Getters and Setters

    public Long getIdZamestnance() {
        return idZamestnance;
    }

    public void setIdZamestnance(Long idZamestnance) {
        this.idZamestnance = idZamestnance;
    }

    public Date getDatumZamestnani() {
        return datumZamestnani;
    }

    public void setDatumZamestnani(Date datumZamestnani) {
        this.datumZamestnani = datumZamestnani;
    }

    public Integer getPracovnidoba() {
        return pracovnidoba;
    }

    public void setPracovnidoba(Integer pracovnidoba) {
        this.pracovnidoba = pracovnidoba;
    }

    public Long getSupermarketIdSupermarketu() {
        return supermarketIdSupermarketu;
    }

    public void setSupermarketIdSupermarketu(Long supermarketIdSupermarketu) {
        this.supermarketIdSupermarketu = supermarketIdSupermarketu;
    }

    public Long getSkladIdSkladu() {
        return skladIdSkladu;
    }

    public void setSkladIdSkladu(Long skladIdSkladu) {
        this.skladIdSkladu = skladIdSkladu;
    }

    public Long getZamestnanecIdZamestnance() {
        return zamestnanecIdZamestnance;
    }

    public void setZamestnanecIdZamestnance(Long zamestnanecIdZamestnance) {
        this.zamestnanecIdZamestnance = zamestnanecIdZamestnance;
    }

    public Long getAdresaIdAdresy() {
        return adresaIdAdresy;
    }

    public void setAdresaIdAdresy(Long adresaIdAdresy) {
        this.adresaIdAdresy = adresaIdAdresy;
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

    public Double getMzda() {
        return mzda;
    }

    public void setMzda(Double mzda) {
        this.mzda = mzda;
    }

    public Long getPoziceIdPozice() {
        return poziceIdPozice;
    }

    public void setPoziceIdPozice(Long poziceIdPozice) {
        this.poziceIdPozice = poziceIdPozice;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }
}
