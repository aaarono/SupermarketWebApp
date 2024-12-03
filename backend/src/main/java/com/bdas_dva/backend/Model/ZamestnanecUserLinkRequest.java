package com.bdas_dva.backend.Model;

public class ZamestnanecUserLinkRequest {
    private Long idZamestnance;
    private Long idUser;

    // Getters and Setters

    public Long getIdZamestnance() {
        return idZamestnance;
    }

    public void setIdZamestnance(Long idZamestnance) {
        this.idZamestnance = idZamestnance;
    }

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }
}
