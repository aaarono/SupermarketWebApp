package com.bdas_dva.backend.Model;

public class Log {
    private Long idLogu;
    private String operace;
    private String nazevTabulky;
    private String datumModifikace;
    private String oldValues;
    private String newValues;

    // Getters and Setters
    public Long getIdLogu() {
        return idLogu;
    }

    public void setIdLogu(Long idLogu) {
        this.idLogu = idLogu;
    }

    public String getOperace() {
        return operace;
    }

    public void setOperace(String operace) {
        this.operace = operace;
    }

    public String getNazevTabulky() {
        return nazevTabulky;
    }

    public void setNazevTabulky(String nazevTabulky) {
        this.nazevTabulky = nazevTabulky;
    }

    public String getDatumModifikace() {
        return datumModifikace;
    }

    public void setDatumModifikace(String datumModifikace) {
        this.datumModifikace = datumModifikace;
    }

    public String getOldValues() {
        return oldValues;
    }

    public void setOldValues(String oldValues) {
        this.oldValues = oldValues;
    }

    public String getNewValues() {
        return newValues;
    }

    public void setNewValues(String newValues) {
        this.newValues = newValues;
    }
}
