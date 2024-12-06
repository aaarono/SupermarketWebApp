package com.bdas_dva.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.support.SqlLobValue;
import org.springframework.jdbc.support.lob.DefaultLobHandler;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;


import java.sql.Types;
import java.util.HashMap;
import java.util.Map;
import java.util.List;


@Service
public class ImageService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Получение всех изображений (только метаданные)
     */
    public List<Map<String, Object>> getAllImages() {
        String sql = "SELECT ID_OBRAZKU, NAZEV, DATUMNAHRANI, DATUMMODIFIKACE, PRODUKT_ID_PRODUKTU, FORMAT_ID_FORMATU " +
                "FROM OBRAZEK";
        try {
            return jdbcTemplate.queryForList(sql);
        } catch (Exception e) {
            // Логируем ошибки для анализа
            System.err.println("Ошибка при выполнении запроса: " + e.getMessage());
            throw new RuntimeException("Не удалось получить изображения из базы данных.");
        }
    }


    /**
     * Получение метаданных изображения по ID
     */
    public Map<String, Object> getImageById(Long imageId) {
        String sql = "SELECT ID_OBRAZKU, NAZEV, DATUMNAHRANI, DATUMMODIFIKACE, PRODUKT_ID_PRODUKTU, FORMAT_ID_FORMAT " +
                "FROM OBRAZEK WHERE ID_OBRAZKU = ?";
        return jdbcTemplate.queryForMap(sql, imageId);
    }

    /**
     * Фильтрация изображений по продукту или формату
     */
    public List<Map<String, Object>> getImagesByFilters(Long productId, Integer formatId) {
        StringBuilder sqlBuilder = new StringBuilder(
                "SELECT ID_OBRAZKU, NAZEV, DATUMNAHRANI, DATUMMODIFIKACE, PRODUKT_ID_PRODUKTU, FORMAT_ID_FORMAT " +
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

    /**
     * Создание нового изображения
     */
    public void createImage(byte[] obrazek, String nazev, Integer formatId, Long productId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_obrazek_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_obrazku", Types.INTEGER),
                        new SqlParameter("p_obrazek", Types.BLOB),
                        new SqlParameter("p_nazev", Types.VARCHAR),
                        new SqlParameter("p_format_id_formatu", Types.INTEGER),
                        new SqlParameter("p_produkt_id_produktu", Types.INTEGER)
                );

        Map<String, Object> params = new HashMap<>();
        params.put("p_action", "CREATE");
        params.put("p_id_obrazku", null);
        params.put("p_obrazek", new SqlLobValue(obrazek, new DefaultLobHandler()));
        params.put("p_nazev", nazev);
        params.put("p_format_id_formatu", formatId);
        params.put("p_produkt_id_produktu", productId);

        jdbcCall.execute(params);
    }

    /**
     * Обновление изображения
     */
    public void updateImage(Long id, byte[] obrazek, String nazev, Integer formatId, Long productId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_obrazek_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_obrazku", Types.INTEGER),
                        new SqlParameter("p_obrazek", Types.BLOB),
                        new SqlParameter("p_nazev", Types.VARCHAR),
                        new SqlParameter("p_format_id_formatu", Types.INTEGER),
                        new SqlParameter("p_produkt_id_produktu", Types.INTEGER)
                );

        Map<String, Object> params = new HashMap<>();
        params.put("p_action", "UPDATE");
        params.put("p_id_obrazku", id);
        params.put("p_obrazek", new SqlLobValue(obrazek, new DefaultLobHandler()));
        params.put("p_nazev", nazev);
        params.put("p_format_id_formatu", formatId);
        params.put("p_produkt_id_produktu", productId);

        jdbcCall.execute(params);
    }

    /**
     * Удаление изображения
     */
    public void deleteImage(Long id) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_obrazek_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_obrazku", Types.INTEGER),
                        new SqlParameter("p_obrazek", Types.BLOB),
                        new SqlParameter("p_nazev", Types.VARCHAR),
                        new SqlParameter("p_format_id_formatu", Types.INTEGER),
                        new SqlParameter("p_produkt_id_produktu", Types.INTEGER)
                );

        Map<String, Object> params = new HashMap<>();
        params.put("p_action", "DELETE");
        params.put("p_id_obrazku", id);
        params.put("p_obrazek", null);
        params.put("p_nazev", null);
        params.put("p_format_id_formatu", null);
        params.put("p_produkt_id_produktu", null);

        jdbcCall.execute(params);
    }
}