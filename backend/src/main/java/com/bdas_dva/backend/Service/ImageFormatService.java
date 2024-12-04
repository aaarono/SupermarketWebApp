package com.bdas_dva.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ImageFormatService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Получение всех форматов изображений
     */
    public List<Map<String, Object>> getAllImageFormats() {
        String sql = "SELECT ID_FORMATU, ROZIRENI FROM FORMAT_OBRAZKU";
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Получение формата изображения по ID
     */
    public Map<String, Object> getImageFormatById(Long formatId) {
        String sql = "SELECT ID_FORMATU, ROZIRENI FROM FORMAT_OBRAZKU WHERE ID_FORMATU = ?";
        return jdbcTemplate.queryForMap(sql, formatId);
    }
}
