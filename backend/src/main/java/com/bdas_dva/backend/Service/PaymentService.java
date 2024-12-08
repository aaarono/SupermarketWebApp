package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.OrderProduct.Platba.Payment;
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
public class PaymentService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Получение всех платежей
    @Transactional(readOnly = true)
    public List<Payment> getAllPayments() {
        String sql = "SELECT id_platby, suma, datum, typ, objednavka_id_objednavky FROM platba";

        return jdbcTemplate.query(sql, new RowMapper<Payment>() {
            @Override
            public Payment mapRow(ResultSet rs, int rowNum) throws SQLException {
                Payment payment = new Payment();
                payment.setId(rs.getLong("id_platby"));
                payment.setSuma(rs.getDouble("suma"));
                payment.setDatum(rs.getDate("datum"));
                payment.setTyp(rs.getString("typ"));
                payment.setObjednavkaId(rs.getLong("objednavka_id_objednavky"));
                return payment;
            }
        });
    }

    // Добавление нового платежа
    @Transactional(rollbackFor = Exception.class)
    public Long addPayment(Double suma, Date datum, String typ, Long objednavkaId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_platba_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlInOutParameter("p_id_platby", Types.NUMERIC),
                        new SqlParameter("p_suma", Types.NUMERIC),
                        new SqlParameter("p_datum", Types.DATE),
                        new SqlParameter("p_typ", Types.VARCHAR),
                        new SqlParameter("p_objednavka_id_objednavky", Types.NUMERIC)
                );

        Map<String, Object> inOutParams = new HashMap<>();
        inOutParams.put("p_action", "INSERT");
        inOutParams.put("p_id_platby", null);
        inOutParams.put("p_suma", suma);
        inOutParams.put("p_datum", datum);
        inOutParams.put("p_typ", typ);
        inOutParams.put("p_objednavka_id_objednavky", objednavkaId);

        Map<String, Object> result = jdbcCall.execute(inOutParams);
        Number generatedId = (Number) result.get("p_id_platby");
        return generatedId != null ? generatedId.longValue() : null;
    }

    // Обновление платежа
    @Transactional(rollbackFor = Exception.class)
    public void updatePayment(Long Id, Double suma, Date datum, String typ, Long objednavkaId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_platba_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_platby", Types.NUMERIC),
                        new SqlParameter("p_suma", Types.NUMERIC),
                        new SqlParameter("p_datum", Types.DATE),
                        new SqlParameter("p_typ", Types.VARCHAR),
                        new SqlParameter("p_objednavka_id_objednavky", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "UPDATE");
        inParams.put("p_id_platby", Id);
        inParams.put("p_suma", suma);
        inParams.put("p_datum", datum);
        inParams.put("p_typ", typ);
        inParams.put("p_objednavka_id_objednavky", objednavkaId);

        jdbcCall.execute(inParams);
    }

    // Удаление платежа
    @Transactional(rollbackFor = Exception.class)
    public void deletePayment(Long Id) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_platba_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_platby", Types.NUMERIC),
                        new SqlParameter("p_suma", Types.NUMERIC),
                        new SqlParameter("p_datum", Types.DATE),
                        new SqlParameter("p_typ", Types.VARCHAR),
                        new SqlParameter("p_objednavka_id_objednavky", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "DELETE");
        inParams.put("p_id_platby", Id);
        inParams.put("p_suma", null);
        inParams.put("p_datum", null);
        inParams.put("p_typ", null);
        inParams.put("p_objednavka_id_objednavky", null);

        jdbcCall.execute(inParams);
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
