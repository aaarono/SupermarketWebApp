package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.Product;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class ProductRepositoryImpl implements ProductRepository {
    private final JdbcTemplate jdbcTemplate;

    public ProductRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Product> findByNameContainingIgnoreCase(String name) {
        String sql = "SELECT * FROM PRODUCT_VIEW WHERE LOWER(name) LIKE LOWER(?)";
        return jdbcTemplate.query(sql, new Object[]{"%" + name + "%"}, new ProductRowMapper());
    }

    @Override
    public List<Product> findByNameContainingIgnoreCaseAndCategory(String name, String category) {
        String sql = "SELECT * FROM PRODUCT_VIEW WHERE LOWER(name) LIKE LOWER(?) AND category = ?";
        return jdbcTemplate.query(sql, new Object[]{"%" + name + "%", category}, new ProductRowMapper());
    }
}
