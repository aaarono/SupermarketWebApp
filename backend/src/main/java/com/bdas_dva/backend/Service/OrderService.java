package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.dto.OrderRequest;
import com.bdas_dva.backend.dto.OrderResponse;
import com.bdas_dva.backend.dto.ProductDTO;
import com.bdas_dva.backend.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Создание нового заказа
    public OrderResponse createOrder(OrderRequest orderRequest, Long userId) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_objednavka_cud(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)}");

            // Установка входных параметров
            cs.setString(1, "INSERT"); // p_operation
            cs.setNull(2, Types.NUMERIC); // p_id_objednavky (null для INSERT)
            cs.setString(3, orderRequest.getFirstName()); // p_jmeno
            cs.setString(4, orderRequest.getLastName()); // p_prijmeni
            cs.setString(5, orderRequest.getEmail()); // p_email
            cs.setLong(6, orderRequest.getPhone()); // p_tel_number
            cs.setString(7, orderRequest.getStreet()); // p_street
            cs.setInt(8, orderRequest.getStreetNumber()); // p_street_number
            cs.setInt(9, orderRequest.getPostCode()); // p_post_code
            cs.setString(10, orderRequest.getCity()); // p_city
            cs.setString(11, orderRequest.getPaymentType()); // p_payment_type
            cs.setString(12, orderRequest.getCardNumber()); // p_card_number
            cs.setDouble(13, orderRequest.getCashAmount() != null ? orderRequest.getCashAmount() : 0); // p_cash_amount
            cs.setString(14, orderRequest.getBankAccountNumber()); // p_bank_account_number
            cs.setString(15, orderRequest.getPassword()); // p_password

            // Создание массива структур для продуктов
            List<ProductDTO> products = orderRequest.getProducts();
            // Поскольку мы не можем напрямую создать массив пользовательских типов в JDBC, нам нужно использовать OracleStruct и OracleArray
            // Предполагается, что вы используете драйвер Oracle JDBC и необходимые библиотеки
            Struct[] productStructs = products.stream().map(product -> {
                try {
                    Object[] attrs = new Object[] {
                            product.getId(),
                            product.getName(),
                            product.getPrice(),
                            product.getDescription(),
                            product.getCategory(),
                            product.getImage(),
                            product.getQuantity()
                    };
                    return conn.createStruct("PRODUCT_OBJECT", attrs);
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
            }).toArray(Struct[]::new);

            Array productArray = conn.createArrayOf("PRODUCT_OBJECT", productStructs);
            cs.setArray(16, productArray); // p_products

            // Регистрация выходного параметра (p_order_id)
            cs.registerOutParameter(17, Types.NUMERIC); // p_order_id

            cs.execute();

            // Получение выходного параметра
            Long orderId = cs.getLong(17);

            cs.close();

            return new OrderResponse("Заказ успешно создан с ID: " + orderId);
        });
    }

    // Получение заказов пользователя
    public List<OrderDetails> getOrders(Long userId) throws SQLException {
        return jdbcTemplate.execute("{call proc_objednavka_r(?, ?, ?)}",
                (CallableStatementCallback<List<OrderDetails>>) cs -> {
                    cs.setLong(1, userId); // p_id_user
                    cs.setNull(2, Types.NUMERIC); // p_limit (null для дефолта)
                    cs.registerOutParameter(3, Types.REF_CURSOR); // p_cursor

                    cs.execute();

                    ResultSet rs = (ResultSet) cs.getObject(3);
                    List<OrderDetails> orders = new ArrayList<>();
                    while (rs.next()) {
                        OrderDetails order = new OrderDetails();
                        order.setIdObjednavky(rs.getLong("ID_OBJEDNAVKY"));
                        order.setDatum(rs.getDate("DATUM"));
                        order.setStav(rs.getString("STAV"));
                        order.setMnozstvi(rs.getInt("MNOZSTVIPRODUKTU"));
                        order.setUlice(rs.getString("ULICE"));
                        order.setPsc(rs.getInt("PSC"));
                        order.setMesto(rs.getString("MESTO"));
                        order.setCisloPopisne(rs.getInt("CISLOPOPISNE"));
                        order.setTelefon(rs.getLong("TELEFON"));
                        order.setEmail(rs.getString("EMAIL"));
                        order.setJmeno(rs.getString("JMENO"));
                        order.setPrijmeni(rs.getString("PRIJMENI"));
                        order.setSuma(rs.getDouble("SUMA"));
                        order.setTyp(rs.getString("TYP"));
                        String productsStr = rs.getString("PRODUCTS");
                        if (productsStr != null && !productsStr.isEmpty()) {
                            String[] products = productsStr.split(", ");
                            order.setProducts(products);
                        } else {
                            order.setProducts(new String[0]);
                        }
                        orders.add(order);
                    }
                    return orders;
                });
    }

    // Класс для деталей заказа
    public static class OrderDetails {
        private Long idObjednavky;
        private Date datum;
        private String stav;
        private Integer mnozstvi;
        private String ulice;
        private Integer psc;
        private String mesto;
        private Integer cisloPopisne;
        private Long telefon;
        private String email;
        private String jmeno;
        private String prijmeni;
        private Double suma;
        private String typ;
        private String[] products; // Список продуктов

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

        public Integer getMnozstvi() {
            return mnozstvi;
        }

        public void setMnozstvi(Integer mnozstvi) {
            this.mnozstvi = mnozstvi;
        }

        public String getUlice() {
            return ulice;
        }

        public void setUlice(String ulice) {
            this.ulice = ulice;
        }

        public Integer getPsc() {
            return psc;
        }

        public void setPsc(Integer psc) {
            this.psc = psc;
        }

        public String getMesto() {
            return mesto;
        }

        public void setMesto(String mesto) {
            this.mesto = mesto;
        }

        public Integer getCisloPopisne() {
            return cisloPopisne;
        }

        public void setCisloPopisne(Integer cisloPopisne) {
            this.cisloPopisne = cisloPopisne;
        }

        public Long getTelefon() {
            return telefon;
        }

        public void setTelefon(Long telefon) {
            this.telefon = telefon;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
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

        public Double getSuma() {
            return suma;
        }

        public void setSuma(Double suma) {
            this.suma = suma;
        }

        public String getTyp() {
            return typ;
        }

        public void setTyp(String typ) {
            this.typ = typ;
        }

        public String[] getProducts() {
            return products;
        }

        public void setProducts(String[] products) {
            this.products = products;
        }

        // Геттеры и сеттеры для всех полей
    }
}
