// src/main/java/com/bdas_dva/backend/Model/ProductSupplier.java

package com.bdas_dva.backend.Model.OrderProduct.Product;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ProductSupplier {
    @JsonProperty("DODAVATEL_ID_DODAVATELU")
    private Long dodavatelIdDodavatelyu; // ID поставщика

    @JsonProperty("PRODUKT_ID_PRODUKTU")
    private Long produktIdProduktu; // ID продукта

    @JsonProperty("supplyPrice")
    private Double supplyPrice; // Цена поставки

    @JsonProperty("supplyDate")
    private String supplyDate; // Дата поставки (например, "2023-01-01")

    // Конструкторы
    public ProductSupplier() {}

    public ProductSupplier(Long dodavatelIdDodavatelyu, Long produktIdProduktu, Double supplyPrice, String supplyDate) {
        this.dodavatelIdDodavatelyu = dodavatelIdDodavatelyu;
        this.produktIdProduktu = produktIdProduktu;
        this.supplyPrice = supplyPrice;
        this.supplyDate = supplyDate;
    }

    // Геттеры и сеттеры
    public Long getDodavatelIdDodavatelyu() {
        return dodavatelIdDodavatelyu;
    }

    public void setDodavatelIdDodavatelyu(Long dodavatelIdDodavatelyu) {
        this.dodavatelIdDodavatelyu = dodavatelIdDodavatelyu;
    }

    public Long getProduktIdProduktu() {
        return produktIdProduktu;
    }

    public void setProduktIdProduktu(Long produktIdProduktu) {
        this.produktIdProduktu = produktIdProduktu;
    }

    public Double getSupplyPrice() {
        return supplyPrice;
    }

    public void setSupplyPrice(Double supplyPrice) {
        this.supplyPrice = supplyPrice;
    }

    public String getSupplyDate() {
        return supplyDate;
    }

    public void setSupplyDate(String supplyDate) {
        this.supplyDate = supplyDate;
    }
}
