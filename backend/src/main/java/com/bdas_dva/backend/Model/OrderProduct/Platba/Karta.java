// Karta.java

package com.bdas_dva.backend.Model.OrderProduct.Platba;

public class Karta {
    private Long idPlatby;
    private String cisloKarty;

    // Конструкторы
    public Karta() {
    }

    public Karta(Long idPlatby, String cisloKarty) {
        this.idPlatby = idPlatby;
        this.cisloKarty = cisloKarty;
    }

    // Геттеры и сеттеры
    public Long getIdPlatby() {
        return idPlatby;
    }

    public void setIdPlatby(Long idPlatby) {
        this.idPlatby = idPlatby;
    }

    public String getCisloKarty() {
        return cisloKarty;
    }

    public void setCisloKarty(String cisloKarty) {
        this.cisloKarty = cisloKarty;
    }
}
