// HotovostService.java

package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.OrderProduct.Platba.Hotovost;
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
public class HotovostService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Получение всех платежей наличными
    @Transactional(readOnly = true)
    public List<Hotovost> getAllHotovosts() {
        String sql = "SELECT id_platby, prijato, vraceno FROM hotovost";

        return jdbcTemplate.query(sql, new RowMapper<Hotovost>() {
            @Override
            public Hotovost mapRow(ResultSet rs, int rowNum) throws SQLException {
                Hotovost hotovost = new Hotovost();
                hotovost.setIdPlatby(rs.getLong("id_platby"));
                hotovost.setPrijato(rs.getDouble("prijato"));
                hotovost.setVraceno(rs.getDouble("vraceno"));
                return hotovost;
            }
        });
    }

    // Добавление нового платежа наличными
    @Transactional(rollbackFor = Exception.class)
    public Long addHotovost(Double prijato, Double vraceno) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_hotovost_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_platby", Types.NUMERIC),
                        new SqlParameter("p_prijato", Types.NUMERIC),
                        new SqlParameter("p_vraceno", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "INSERT");
        inParams.put("p_id_platby", null); // Предполагается, что ID генерируется автоматически
        inParams.put("p_prijato", prijato);
        inParams.put("p_vraceno", vraceno);

        try {
            Map<String, Object> result = jdbcCall.execute(inParams);
            // Предполагается, что процедура возвращает ID_PLATBY, если необходимо
            // Если нет, можно изменить процедуру или вернуть актуальное значение
            // Здесь предполагается, что ID_PLATBY генерируется в базе данных и возвращается
            // Если это не так, возможно, потребуется другой подход для получения ID
            // Например, используя RETURNING или другие механизмы
            // Пока что вернём null
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении платежа наличными: " + e.getMessage());
        }
    }

    // Обновление платежа наличными
    @Transactional(rollbackFor = Exception.class)
    public void updateHotovost(Long id, Double prijato, Double vraceno) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_hotovost_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_platby", Types.NUMERIC),
                        new SqlParameter("p_prijato", Types.NUMERIC),
                        new SqlParameter("p_vraceno", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "UPDATE");
        inParams.put("p_id_platby", id);
        inParams.put("p_prijato", prijato);
        inParams.put("p_vraceno", vraceno);

        try {
            jdbcCall.execute(inParams);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при обновлении платежа наличными: " + e.getMessage());
        }
    }

    // Удаление платежа наличными
    @Transactional(rollbackFor = Exception.class)
    public void deleteHotovost(Long id) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_hotovost_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_platby", Types.NUMERIC),
                        new SqlParameter("p_prijato", Types.NUMERIC),
                        new SqlParameter("p_vraceno", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "DELETE");
        inParams.put("p_id_platby", id);
        inParams.put("p_prijato", null);
        inParams.put("p_vraceno", null);

        try {
            jdbcCall.execute(inParams);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при удалении платежа наличными: " + e.getMessage());
        }
    }

    /**
     * Дополнительные методы, например, фильтрация или получение по ID, при необходимости
     */
}
