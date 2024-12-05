package com.bdas_dva.backend.Model;

public class Product {
    private Long id;
    private String name;
    private Double price;
    private String description;
    private Long category;
    private String image;
    private Long sklad_id;

    public Long getSklad_id() {
        return sklad_id;
    }

    public void setSklad_id(Long sklad_id) {
        this.sklad_id = sklad_id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getCategory() {
        return category;
    }

    public void setCategory(Long category) {
        this.category = category;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
