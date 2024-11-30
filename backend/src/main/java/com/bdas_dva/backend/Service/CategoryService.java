// CategoryService.java
package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Получение списка категорий
    public List<Category> getCategories() {
        String sql = "SELECT NAZEV AS value, NAZEV AS label FROM KATEGORIE_PRODUKTU";

        List<Category> categories = jdbcTemplate.query(sql, categoryRowMapper);

        // Добавляем категорию "all" в начало списка
        Category allCategory = new Category();
        allCategory.setValue("all");
        allCategory.setLabel("All Categories");
        categories.add(0, allCategory);

        return categories;
    }

    private RowMapper<Category> categoryRowMapper = (rs, rowNum) -> {
        Category category = new Category();
        category.setValue(rs.getString("value"));
        category.setLabel(rs.getString("label"));
        return category;
    };
}
