package com.bdas_dva.backend.Model.OrderProduct;

import com.bdas_dva.backend.Model.Address;
import com.bdas_dva.backend.Model.Customer;
import com.bdas_dva.backend.Model.OrderProduct.Platba.Payment;
import com.bdas_dva.backend.Model.OrderProduct.Product.Product;

import java.util.Date;
import java.util.List;

public class Order {
    private Long idObjednavky;
    private Date datum;
    private String stav;
    private Integer mnozstviProduktu;
    private String poznamka;
    private Integer supermarketId;
    private Long zakaznikId;

    // Связанные объекты
    private List<OrderProduct> orderProducts;
    private List<Product> products;
    private Address address;
    private Customer customer;
    private Payment payment;

    // Конструкторы
    public Order() {
    }

    public Order(Long idObjednavky, Date datum, String stav, Integer mnozstviProduktu, String poznamka, Integer supermarketId, Long zakaznikId) {
        this.idObjednavky = idObjednavky;
        this.datum = datum;
        this.stav = stav;
        this.mnozstviProduktu = mnozstviProduktu;
        this.poznamka = poznamka;
        this.supermarketId = supermarketId;
        this.zakaznikId = zakaznikId;
    }

    // Геттеры и сеттеры
    public Long getIdObjednavky() {
        return idObjednavky;
    }

    public void setIdObjednavky(Long idObjednavky) {
        this.idObjednavky = idObjednavky;
    }

    public Date getDatum() {
        return datum;
    }

    public void setDatum(Date datum) {
        this.datum = datum;
    }

    public String getStav() {
        return stav;
    }

    public void setStav(String stav) {
        this.stav = stav;
    }

    public Integer getMnozstviProduktu() {
        return mnozstviProduktu;
    }

    public void setMnozstviProduktu(Integer mnozstviProduktu) {
        this.mnozstviProduktu = mnozstviProduktu;
    }

    public String getPoznamka() {
        return poznamka;
    }

    public void setPoznamka(String poznamka) {
        this.poznamka = poznamka;
    }

    public Integer getSupermarketId() {
        return supermarketId;
    }

    public void setSupermarketId(Integer supermarketId) {
        this.supermarketId = supermarketId;
    }

    public Long getZakaznikId() {
        return zakaznikId;
    }

    public void setZakaznikId(Long zakaznikId) {
        this.zakaznikId = zakaznikId;
    }

    public List<OrderProduct> getOrderProductProducts() {
        return orderProducts;
    }

    public void setOrderProductProducts(List<OrderProduct> orderProducts) {
        this.orderProducts = orderProducts;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }
}
