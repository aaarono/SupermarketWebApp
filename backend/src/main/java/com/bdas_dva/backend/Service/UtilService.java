// UtilService.java
package com.bdas_dva.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.dao.DataAccessException;

import java.util.List;
import java.util.Map;

@Service
public class UtilService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Получить все объекты для владельца.
     * @param owner Имя владельца.
     * @return Список объектов и их типов.
     */
    public List<Map<String, Object>> getObjectsByOwner(String owner) {
        String query = "SELECT object_name, object_type FROM all_objects WHERE OWNER = ?";

        try {
            // Выполнение запроса с параметром owner
            return jdbcTemplate.queryForList(query, owner);
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw new RuntimeException("Ошибка при выполнении запроса: " + e.getMessage());
        }
    }

    /**
     * Получить все роли из таблицы ROLE.
     * @return Список ролей.
     */
    public List<Map<String, Object>> getAllRoles() {
        String query = "SELECT * FROM ROLE";

        try {
            // Выполнение запроса для получения всех ролей
            return jdbcTemplate.queryForList(query);
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw new RuntimeException("Ошибка при получении ролей: " + e.getMessage());
        }
    }
}
