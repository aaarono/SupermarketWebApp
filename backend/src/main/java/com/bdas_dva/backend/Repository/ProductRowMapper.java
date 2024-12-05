package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.Product;
import org.springframework.jdbc.core.RowMapper;
import java.sql.ResultSet;
import java.sql.SQLException;

public class ProductRowMapper implements RowMapper<Product> {
    @Override
    public Product mapRow(ResultSet rs, int rowNum) throws SQLException {
        Product product = new Product();
        product.setId(rs.getLong("id"));
        product.setName(rs.getString("name"));
        product.setPrice(rs.getDouble("price"));
        product.setDescription(rs.getString("description"));
        product.setCategory(rs.getLong("category"));
        product.setSklad_id(rs.getLong("sklad_id"));
        product.setImage(rs.getString("image"));
        return product;
    }
}
