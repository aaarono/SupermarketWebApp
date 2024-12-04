package com.bdas_dva.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ImageService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Получение всех изображений (только метаданные)
     */
    public List<Map<String, Object>> getAllImages() {
        String sql = "SELECT ID_OBRAZKU, NAZEV, TYP, DATUMNAHRANI, DATUMMODIFIKACE, PRODUKT_ID_PRODUKTU, FORMAT_ID_FORMAT " +
                "FROM OBRAZEK";
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Получение метаданных изображения по ID
     */
    public Map<String, Object> getImageById(Long imageId) {
        String sql = "SELECT ID_OBRAZKU, NAZEV, TYP, DATUMNAHRANI, DATUMMODIFIKACE, PRODUKT_ID_PRODUKTU, FORMAT_ID_FORMAT " +
                "FROM OBRAZEK WHERE ID_OBRAZKU = ?";
        return jdbcTemplate.queryForMap(sql, imageId);
    }

    /**
     * Фильтрация изображений по продукту или формату
     */
    public List<Map<String, Object>> getImagesByFilters(Long productId, Integer formatId) {
        StringBuilder sqlBuilder = new StringBuilder(
                "SELECT ID_OBRAZKU, NAZEV, TYP, DATUMNAHRANI, DATUMMODIFIKACE, PRODUKT_ID_PRODUKTU, FORMAT_ID_FORMAT " +
                        "FROM OBRAZEK WHERE 1=1"
        );

        List<Object> params = new java.util.ArrayList<>();
        if (productId != null) {
            sqlBuilder.append(" AND PRODUKT_ID_PRODUKTU = ?");
            params.add(productId);
        }
        if (formatId != null) {
            sqlBuilder.append(" AND FORMAT_ID_FORMAT = ?");
            params.add(formatId);
        }

        return jdbcTemplate.queryForList(sqlBuilder.toString(), params.toArray());
    }
}
