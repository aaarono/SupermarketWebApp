package com.bdas_dva.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Получение всех записей о платежах
     */
    public List<Map<String, Object>> getAllPayments() {
        String sql = "SELECT ID_PLATBY, SUMA, DATUM, TYP, OBJEDNAVKA_ID_OBJEDNAVKY FROM PLATBA";
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Фильтрация платежей по типу оплаты, дате и сумме
     */
    public List<Map<String, Object>> getPaymentsByFilters(String type, String date, Double minAmount, Double maxAmount) {
        StringBuilder sqlBuilder = new StringBuilder(
                "SELECT ID_PLATBY, SUMA, DATUM, TYP, OBJEDNAVKA_ID_OBJEDNAVKY FROM PLATBA WHERE 1=1"
        );

        List<Object> params = new ArrayList<>();
        if (type != null && !type.isEmpty()) {
            sqlBuilder.append(" AND TYP = ?");
            params.add(type);
        }
        if (date != null && !date.isEmpty()) {
            sqlBuilder.append(" AND TO_CHAR(DATUM, 'YYYY-MM-DD') = ?");
            params.add(date);
        }
        if (minAmount != null) {
            sqlBuilder.append(" AND SUMA >= ?");
            params.add(minAmount);
        }
        if (maxAmount != null) {
            sqlBuilder.append(" AND SUMA <= ?");
            params.add(maxAmount);
        }

        return jdbcTemplate.queryForList(sqlBuilder.toString(), params.toArray());
    }

    /**
     * Получение платежа по ID
     */
    public Map<String, Object> getPaymentById(Long paymentId) {
        String sql = "SELECT ID_PLATBY, SUMA, DATUM, TYP, OBJEDNAVKA_ID_OBJEDNAVKY FROM PLATBA WHERE ID_PLATBY = ?";
        return jdbcTemplate.queryForMap(sql, paymentId);
    }
}
