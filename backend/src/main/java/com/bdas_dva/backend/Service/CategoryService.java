// CategoryService.java
package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.OrderProduct.Product.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Получение списка категорий
    @Transactional(rollbackFor = Exception.class)
    public List<Category> getCategories() {
        List<Category> categories = jdbcTemplate.execute("{call proc_kategorie_produktu_r(?, ?, ?)}",
                (CallableStatementCallback<List<Category>>) cs -> {
                    cs.setNull(1, Types.NUMERIC); // p_id_kategorie
                    cs.setNull(2, Types.NUMERIC); // p_limit
                    cs.registerOutParameter(3, Types.REF_CURSOR); // p_cursor
                    cs.execute();

                    ResultSet rs = (ResultSet) cs.getObject(3);
                    List<Category> categoryList = new ArrayList<>();
                    while (rs.next()) {
                        Category category = new Category();
                        category.setId(rs.getLong("id_kategorie")); // Добавляем ID категории
                        category.setValue(rs.getString("nazev"));
                        category.setLabel(rs.getString("nazev"));
                        categoryList.add(category);
                    }
                    return categoryList;
                });

        // Добавляем категорию "all" в начало списка
        Category allCategory = new Category();
        allCategory.setValue("all");
        allCategory.setLabel("All Categories");
        categories.add(0, allCategory);

        return categories;
    }

    // Вставка новой категории
    @Transactional(rollbackFor = Exception.class)
    public void insertCategory(String name) {
        jdbcTemplate.execute("{call proc_kategorie_produktu_cud(?, ?, ?)}", (CallableStatementCallback<Void>) cs -> {
            cs.setString(1, "INSERT");
            cs.setNull(2, Types.NUMERIC); // p_id_kategorie
            cs.setString(3, name); // p_nazev
            cs.execute();
            return null;
        });
    }

    // Обновление существующей категории
    @Transactional(rollbackFor = Exception.class)
    public void updateCategory(Long id, String name) {
        jdbcTemplate.execute("{call proc_kategorie_produktu_cud(?, ?, ?)}", (CallableStatementCallback<Void>) cs -> {
            cs.setString(1, "UPDATE");
            cs.setLong(2, id); // p_id_kategorie
            cs.setString(3, name); // p_nazev
            cs.execute();
            return null;
        });
    }

    // Удаление категории
    @Transactional(rollbackFor = Exception.class)
    public void deleteCategory(Long id) {
        jdbcTemplate.execute("{call proc_kategorie_produktu_cud(?, ?, ?)}", (CallableStatementCallback<Void>) cs -> {
            cs.setString(1, "DELETE");
            cs.setLong(2, id); // p_id_kategorie
            cs.setNull(3, Types.VARCHAR); // p_nazev
            cs.execute();
            return null;
        });
    }
}
