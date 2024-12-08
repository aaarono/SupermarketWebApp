package com.bdas_dva.backend.Model.Zamestnanec;

import java.util.Date;

public class ZamestnanecRegisterRequest {
    private String jmeno;
    private String prijmeni;
    private String email;
    private String password;
    private Long roleId;
    private Date datumZamestnani;
    private Integer pracovnidoba;
    private Long supermarketIdSupermarketu;
    private Long skladIdSkladu;
    private Long adresaIdAdresy;
    private Double mzda;
    private Long poziceIdPozice;

    // Getters and Setters

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
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

    public Long getAdresaIdAdresy() {
        return adresaIdAdresy;
    }

    public void setAdresaIdAdresy(Long adresaIdAdresy) {
        this.adresaIdAdresy = adresaIdAdresy;
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
}
