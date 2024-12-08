package com.bdas_dva.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Service
public class OrderStatusService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Выполнение процедуры для операций CREATE, UPDATE, DELETE.
     */
    public void executeCUD(String action, Long idStatus, String nazev) {
        jdbcTemplate.execute((Connection connection) -> {
            CallableStatement callableStatement = connection.prepareCall("{call proc_status_objednavky_cud(?, ?, ?)}");
            callableStatement.setString(1, action);

            if (idStatus != null) {
                callableStatement.setLong(2, idStatus);
            } else {
                callableStatement.setNull(2, java.sql.Types.NUMERIC);
            }

            if (nazev != null) {
                callableStatement.setString(3, nazev);
            } else {
                callableStatement.setNull(3, java.sql.Types.VARCHAR);
            }

            callableStatement.execute();
            return null;
        });
    }

    /**
     * Выполнение процедуры для чтения статуса по ID.
     */
    public Map<String, Object> executeRead(Long idStatus) {
        return jdbcTemplate.execute((Connection connection) -> {
            CallableStatement callableStatement = connection.prepareCall("{call proc_status_objednavky_r(?, ?)}");
            callableStatement.setLong(1, idStatus);
            callableStatement.registerOutParameter(2, java.sql.Types.REF_CURSOR);

            callableStatement.execute();

            ResultSet rs = (ResultSet) callableStatement.getObject(2);

            if (rs.next()) {
                Map<String, Object> result = new HashMap<>();
                result.put("ID_STATUS", rs.getLong("ID_STATUS"));
                result.put("NAZEV", rs.getString("NAZEV"));
                return result;
            } else {
                throw new RuntimeException("Статус с ID " + idStatus + " не найден.");
            }
        });
    }

    /**
     * Выполнение процедуры для чтения всех статусов.
     */
    public List<Map<String, Object>> executeReadAll() {
        return jdbcTemplate.execute((Connection connection) -> {
            CallableStatement callableStatement = connection.prepareCall("{call proc_status_objednavky_r(?, ?)}");
            callableStatement.setNull(1, java.sql.Types.NUMERIC);
            callableStatement.registerOutParameter(2, java.sql.Types.REF_CURSOR);

            callableStatement.execute();

            ResultSet rs = (ResultSet) callableStatement.getObject(2);

            List<Map<String, Object>> results = new ArrayList<>();
            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("ID_STATUS", rs.getLong("ID_STATUS"));
                row.put("NAZEV", rs.getString("NAZEV"));
                results.add(row);
            }

            return results;
        });
    }

    /**
     * Метод для изменения статуса заказа.
     */
    public void updateOrderStatus(Long orderId, Long newStatusId) {
        jdbcTemplate.execute((Connection connection) -> {
            CallableStatement callableStatement = connection.prepareCall("{call UpdateOrderStatus(?, ?)}");
            callableStatement.setLong(1, orderId);
            callableStatement.setLong(2, newStatusId);
            callableStatement.execute();
            return null;
        });
    }
}
