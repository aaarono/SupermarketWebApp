package com.bdas_dva.backend.Model;

import java.util.Date;

public class Payment {
    private Long id;
    private Double suma;
    private Date datum;
    private String typ;  // Тип оплаты ('kp' — карта, 'hp' — наличные, 'fp' — счёт)
    private Long objednavkaId;

    // Конструкторы
    public Payment() {
    }

    public Payment(Long id, Double suma, Date datum, String typ) {
        this.id = id;
        this.suma = suma;
        this.datum = datum;
        this.typ = typ;
    }

    public Long getObjednavkaId() {
        return objednavkaId;
    }

    public void setObjednavkaId(Long objednavkaId) {
        this.objednavkaId = objednavkaId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
