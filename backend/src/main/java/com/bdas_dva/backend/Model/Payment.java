package com.bdas_dva.backend.Model;

import java.util.Date;

public class Payment {
    private Long idPlatby;
    private Double suma;
    private Date datum;
    private String typ;  // Тип оплаты ('kp' — карта, 'hp' — наличные, 'fp' — счёт)

    // Конструкторы
    public Payment() {
    }

    public Payment(Long idPlatby, Double suma, Date datum, String typ) {
        this.idPlatby = idPlatby;
        this.suma = suma;
        this.datum = datum;
        this.typ = typ;
    }

    public Long getIdPlatby() {
        return idPlatby;
    }

    public void setIdPlatby(Long idPlatby) {
        this.idPlatby = idPlatby;
    }

    public Double getSuma() {
        return suma;
    }

    public void setSuma(Double suma) {
        this.suma = suma;
    }

    public Date getDatum() {
        return datum;
    }

    public void setDatum(Date datum) {
        this.datum = datum;
    }

    public String getTyp() {
        return typ;
    }

    public void setTyp(String typ) {
        this.typ = typ;
    }

    // Геттеры и сеттеры
}
