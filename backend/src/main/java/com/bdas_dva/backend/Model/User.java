package com.bdas_dva.backend.Model;

public class User {
    private Long idUser;
    private String jmeno;
    private String prijmeni;
    private String email;
    private String telNumber;
    private String password;
    private Long roleIdRole;
    private Long zakaznikIdZakazniku;
    private Long zamnestnanecIdZamnestnance;
    private String roleName;

    // Конструкторы
    public User() {}

    public User(Long idUser, String jmeno, String prijmeni, String email, String telNumber, String password, Long roleIdRole, Long zakaznikIdZakazniku, Long zamnestnanecIdZamnestnance) {
        this.idUser = idUser;
        this.jmeno = jmeno;
        this.prijmeni = prijmeni;
        this.email = email;
        this.telNumber = telNumber;
        this.password = password;
        this.roleIdRole = roleIdRole;
        this.zakaznikIdZakazniku = zakaznikIdZakazniku;
        this.zamnestnanecIdZamnestnance = zamnestnanecIdZamnestnance;
    }

    // Геттеры и сеттеры
    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public String getJmeno() {
        return jmeno;
    }

    public void setJmeno(String jmeno) {
        this.jmeno = jmeno;
    }

    public String getPrijmeni() {
        return prijmeni;
    }

    public void setPrijmeni(String prijmeni) {
        this.prijmeni = prijmeni;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelNumber() {
        return telNumber;
    }

    public void setTelNumber(String telNumber) {
        this.telNumber = telNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getRoleIdRole() {
        return roleIdRole;
    }

    public void setRoleIdRole(Long roleIdRole) {
        this.roleIdRole = roleIdRole;
    }

    public Long getZakaznikIdZakazniku() {
        return zakaznikIdZakazniku;
    }

    public void setZakaznikIdZakazniku(Long zakaznikIdZakazniku) {
        this.zakaznikIdZakazniku = zakaznikIdZakazniku;
    }

    public Long getZamnestnanecIdZamnestnance() {
        return zamnestnanecIdZamnestnance;
    }

    public void setZamnestnanecIdZamnestnance(Long zamnestnanecIdZamnestnance) {
        this.zamnestnanecIdZamnestnance = zamnestnanecIdZamnestnance;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    // Метод для получения username (email)
    public String getUsername() {
        return email;
    }
}
