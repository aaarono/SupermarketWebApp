// src/main/java/com/bdas_dva/backend/Service/ProductSupplierService.java

package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.OrderProduct.Product.ProductSupplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.*;
import java.util.List;

@Service
public class ProductSupplierService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Создание новой связи продукт-поставщик (Create)
    @Transactional(rollbackFor = Exception.class)
    public void createProductSupplier(ProductSupplier productSupplier) {
        jdbcTemplate.update((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_product_supplier_cud(?, ?, ?, ?, ?)}");
            cs.setString(1, "INSERT");
            cs.setLong(2, productSupplier.getDodavatelIdDodavatelyu());
            cs.setLong(3, productSupplier.getProduktIdProduktu());
            return cs;
        });
    }

    // Обновление существующей связи продукт-поставщик (Update)
    @Transactional(rollbackFor = Exception.class)
    public void updateProductSupplier(ProductSupplier productSupplier) throws ResourceNotFoundException {
        if (productSupplier.getDodavatelIdDodavatelyu() == null || productSupplier.getProduktIdProduktu() == null) {
            throw new IllegalArgumentException("Product ID и Supplier ID не могут быть null для обновления.");
        }

        // Проверка существования записи
        getProductSupplierByIds(productSupplier.getProduktIdProduktu(), productSupplier.getDodavatelIdDodavatelyu());

        jdbcTemplate.update((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_product_supplier_cud(?, ?, ?, ?, ?)}");
            cs.setString(1, "UPDATE");
            cs.setLong(2, productSupplier.getDodavatelIdDodavatelyu());
            cs.setLong(3, productSupplier.getProduktIdProduktu());
            return cs;
        });
    }

    // Удаление связи продукт-поставщик (Delete)
    @Transactional(rollbackFor = Exception.class)
    public void deleteProductSupplier(Long produktIdProduktu, Long dodavatelIdDodavatelyu) throws ResourceNotFoundException {
        if (produktIdProduktu == null || dodavatelIdDodavatelyu == null) {
            throw new IllegalArgumentException("Product ID и Supplier ID не могут быть null для удаления.");
        }

        // Проверка существования записи
        getProductSupplierByIds(produktIdProduktu, dodavatelIdDodavatelyu);

        jdbcTemplate.update((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_product_supplier_cud(?, ?, ?, ?, ?)}");
            cs.setString(1, "DELETE");
            cs.setLong(2, dodavatelIdDodavatelyu);
            cs.setLong(3, produktIdProduktu);
            return cs;
        });
    }

    // Получение всех связей продукт-поставщик (Read)
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public List<ProductSupplier> getAllProductSuppliers() {
        String query = "SELECT DODAVATEL_ID_DODAVATELU, PRODUKT_ID_PRODUKTU FROM produkt_dodavatel";
        return jdbcTemplate.query(query, (rs, rowNum) -> mapRowToProductSupplier(rs));
    }

    // Получение связи продукт-поставщик по составному ключу (Read)
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public ProductSupplier getProductSupplierByIds(Long produktIdProduktu, Long dodavatelIdDodavatelyu) throws ResourceNotFoundException {
        String query = "SELECT DODAVATEL_ID_DODAVATELU, PRODUKT_ID_PRODUKTU FROM produkt_dodavatel WHERE PRODUKT_ID_PRODUKTU = ? AND DODAVATEL_ID_DODAVATELU = ?";
        List<ProductSupplier> productSuppliers = jdbcTemplate.query(query, new Object[]{produktIdProduktu, dodavatelIdDodavatelyu},
                (rs, rowNum) -> mapRowToProductSupplier(rs));

        if (productSuppliers.isEmpty()) {
            throw new ResourceNotFoundException("Связь продукт-поставщик не найдена.", "produktIdProduktu, dodavatelIdDodavatelyu", produktIdProduktu + ", " + dodavatelIdDodavatelyu);
        }

        return productSuppliers.get(0);
    }

    // Метод маппинга строки ResultSet в объект ProductSupplier
    private ProductSupplier mapRowToProductSupplier(ResultSet rs) throws SQLException {
        ProductSupplier ps = new ProductSupplier();
        ps.setDodavatelIdDodavatelyu(rs.getLong("DODAVATEL_ID_DODAVATELU"));
        ps.setProduktIdProduktu(rs.getLong("PRODUKT_ID_PRODUKTU"));
        return ps;
    }
}
