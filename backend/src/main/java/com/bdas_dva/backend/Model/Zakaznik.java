package com.bdas_dva.backend.Model;

public class Zakaznik {
    private Long idZakazniku;
    private Long telefon;
    private Long adresaIdAdresy = 0L;

    public Zakaznik() {}

    public Zakaznik(Long idZakazniku, Long telefon, Long adresaIdAdresy) {
        this.idZakazniku = idZakazniku;
        this.telefon = telefon;
        this.adresaIdAdresy = adresaIdAdresy;
    }

    public Long getIdZakazniku() {
        return idZakazniku;
    }

    public void setIdZakazniku(Long idZakazniku) {
        this.idZakazniku = idZakazniku;
    }

    public Long getTelefon() {
        return telefon;
    }

    public void setTelefon(Long telefon) {
        this.telefon = telefon;
    }

    public Long getAdresaIdAdresy() {
        return adresaIdAdresy;
    }

    public void setAdresaIdAdresy(Long adresaIdAdresy) {
        this.adresaIdAdresy = adresaIdAdresy;
    }
}
