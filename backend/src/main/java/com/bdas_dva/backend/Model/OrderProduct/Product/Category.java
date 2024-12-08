package com.bdas_dva.backend.Model;

public class Category {
    private String label; // Название категории
    private String value; // Значение (ID категории)

    // Добавим поле для ID категории
    private Long id;

    // Getters and Setters
    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
