package com.bdas_dva.backend.dto;

public class OrderResponse {
    private String message;

    public OrderResponse(String message) {
        this.message = message;
    }

    // Геттер и сеттер

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
