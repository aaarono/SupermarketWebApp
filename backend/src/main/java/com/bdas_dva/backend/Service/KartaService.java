// KartaService.java

package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.OrderProduct.Platba.Karta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Types;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Service
public class KartaService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private SimpleJdbcCall procKartaCud;

    @Autowired
    public void setUp() {
        this.procKartaCud = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_karta_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_platby", Types.NUMERIC),
                        new SqlParameter("p_cislo_karty", Types.VARCHAR)
                );
    }

    // Получение всех карт
    @Transactional(readOnly = true)
    public List<Karta> getAllKarty() {
        String sql = "SELECT id_platby, cislokarty FROM karta";

        return jdbcTemplate.query(sql, new RowMapper<Karta>() {
            @Override
            public Karta mapRow(ResultSet rs, int rowNum) throws SQLException {
                Karta karta = new Karta();
                karta.setIdPlatby(rs.getLong("id_platby"));
                karta.setCisloKarty(rs.getString("cislokarty"));
                return karta;
            }
        });
    }

    // Добавление новой карты через хранимую процедуру
    @Transactional(rollbackFor = Exception.class)
    public Long addKarta(String cisloKarty) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "INSERT");
        // Генерация ID_PLATBY может выполняться здесь с использованием последовательности
        Long newId = generateNewIdPlatby();
        inParams.put("p_id_platby", newId);
        inParams.put("p_cislo_karty", cisloKarty);

        try {
            procKartaCud.execute(inParams);
            return newId;
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении карты: " + e.getMessage());
        }
    }

    // Обновление карты через хранимую процедуру
    @Transactional(rollbackFor = Exception.class)
    public void updateKarta(Long idPlatby, String cisloKarty) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "UPDATE");
        inParams.put("p_id_platby", idPlatby);
        inParams.put("p_cislo_karty", cisloKarty);

        try {
            procKartaCud.execute(inParams);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при обновлении карты: " + e.getMessage());
        }
    }

    // Удаление карты через хранимую процедуру
    @Transactional(rollbackFor = Exception.class)
    public void deleteKarta(Long idPlatby) {
        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "DELETE");
        inParams.put("p_id_platby", idPlatby);
        inParams.put("p_cislo_karty", null);

        try {
            procKartaCud.execute(inParams);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при удалении карты: " + e.getMessage());
        }
    }

    // Вспомогательный метод для генерации нового ID_PLATBY
    private Long generateNewIdPlatby() {
        // Предполагается, что у вас есть последовательность в базе данных для генерации ID_PLATBY
        String sql = "SELECT karta_seq.NEXTVAL FROM dual"; // Для Oracle
        try {
            return jdbcTemplate.queryForObject(sql, Long.class);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при генерации нового ID_PLATBY: " + e.getMessage());
        }
    }

    /**
     * Дополнительные методы, например, фильтрация или получение по ID, при необходимости
     */
}
