// ProductService.java
package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Получение списка продуктов
    public List<Product> getProducts(String searchQuery, String category) {
        String sql = "SELECT * FROM PRODUCT_VIEW WHERE LOWER(NAME) LIKE LOWER(?)";
        Object[] params;

        if (!"all".equalsIgnoreCase(category)) {
            sql += " AND CATEGORY = ?";
            params = new Object[]{"%" + (searchQuery != null ? searchQuery : "") + "%", category};
        } else {
            params = new Object[]{"%" + (searchQuery != null ? searchQuery : "") + "%"};
        }

        return jdbcTemplate.query(sql, params, productRowMapper);
    }

    private RowMapper<Product> productRowMapper = (rs, rowNum) -> {
        Product product = new Product();
        product.setId(rs.getLong("ID"));
        product.setName(rs.getString("NAME"));
        product.setPrice(rs.getDouble("PRICE"));
        product.setDescription(rs.getString("DESCRIPTION"));
        product.setCategory(rs.getString("CATEGORY"));

        // Обработка изображения
        Blob imageBlob = rs.getBlob("IMAGE");
        if (imageBlob != null) {
            byte[] imageBytes = imageBlob.getBytes(1, (int) imageBlob.length());
            String base64Image = java.util.Base64.getEncoder().encodeToString(imageBytes);
            product.setImage(base64Image);
        } else {
            product.setImage(null);
        }

        return product;
    };
}
