// Pozice.java
package com.bdas_dva.backend.Model.Zamestnanec;

public class Pozice {
    private Long idPozice;
    private String nazev;

    // Конструкторы
    public Pozice() {}

    public Pozice(Long idPozice, String nazev) {
        this.idPozice = idPozice;
        this.nazev = nazev;
    }

    // Геттеры и сеттеры
    public Long getIdPozice() {
        return idPozice;
    }

    public void setIdPozice(Long idPozice) {
        this.idPozice = idPozice;
    }

    public String getNazev() {
        return nazev;
    }

    public void setNazev(String nazev) {
        this.nazev = nazev;
    }
}
