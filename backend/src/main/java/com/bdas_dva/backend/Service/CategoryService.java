// CategoryService.java
package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.Category;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Получение списка категорий
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
        System.out.println("categories.get(2).getLabel() = " + categories.get(2).getLabel());
        System.out.println("categories.get(2).getValue() = " + categories.get(2).getValue());

        return categories;
    }

    public List<Category> getCategories(Long pIdKategorie, Integer pLimit) {
        List<Category> categories = jdbcTemplate.execute("{call proc_kategorie_produktu_r(?, ?, ?)}",
                (CallableStatementCallback<List<Category>>) cs -> {
                    if (pIdKategorie != null) {
                        cs.setLong(1, pIdKategorie); // p_id_kategorie
                    } else {
                        cs.setNull(1, Types.NUMERIC);
                    }

                    if (pLimit != null) {
                        cs.setInt(2, pLimit); // p_limit
                    } else {
                        cs.setNull(2, Types.NUMERIC);
                    }

                    cs.registerOutParameter(3, Types.REF_CURSOR); // p_cursor
                    cs.execute();

                    ResultSet rs = (ResultSet) cs.getObject(3);
                    List<Category> categoryList = new ArrayList<>();
                    while (rs.next()) {
                        Category category = new Category();
                        category.setValue(rs.getString("id_kategorie"));
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

}
