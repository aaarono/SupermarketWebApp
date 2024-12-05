// Hotovost.java

package com.bdas_dva.backend.Model;

public class Hotovost {
    private Long idPlatby;
    private Payment payment; // Связь с Payment
    private Double prijato;
    private Double vraceno;

    // Конструкторы
    public Hotovost() {
    }

    public Hotovost(Long idPlatby, Payment payment, Double prijato, Double vraceno) {
        this.idPlatby = idPlatby;
        this.payment = payment;
        this.prijato = prijato;
        this.vraceno = vraceno;
    }

    // Геттеры и сеттеры
    public Long getIdPlatby() {
        return idPlatby;
    }

    public void setIdPlatby(Long idPlatby) {
        this.idPlatby = idPlatby;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public Double getPrijato() {
        return prijato;
    }

    public void setPrijato(Double prijato) {
        this.prijato = prijato;
    }

    public Double getVraceno() {
        return vraceno;
    }

    public void setVraceno(Double vraceno) {
        this.vraceno = vraceno;
    }
}
