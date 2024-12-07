package com.bdas_dva.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DodavatelService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(rollbackFor = Exception.class)
    public void addDodavatel(String name, String contactPerson, Long phone, String email) {
        try {
            SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withProcedureName("proc_dodavatel_cud")
                    .declareParameters(
                            new SqlParameter("p_action", Types.VARCHAR),
                            new SqlParameter("p_id_dodavatelu", Types.NUMERIC),
                            new SqlParameter("p_nazev", Types.VARCHAR),
                            new SqlParameter("p_kontaktni_osoba", Types.VARCHAR),
                            new SqlParameter("p_telefon", Types.NUMERIC),
                            new SqlParameter("p_email", Types.VARCHAR)
                    );

            Map<String, Object> inParams = new HashMap<>();
            inParams.put("p_action", "INSERT");
            inParams.put("p_id_dodavatelu", null);
            inParams.put("p_nazev", name);
            inParams.put("p_kontaktni_osoba", contactPerson);
            inParams.put("p_telefon", phone);
            inParams.put("p_email", email);

            jdbcCall.execute(inParams);
        } catch (Exception e) {
            throw new RuntimeException("Error adding supplier: " + e.getMessage(), e);
        }
    }


    @Transactional(rollbackFor = Exception.class)
    public void updateDodavatel(Long dodavatelId, String name, String contactPerson, Long phone, String email) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_dodavatel_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_dodavatelu", Types.NUMERIC),
                        new SqlParameter("p_nazev", Types.VARCHAR),
                        new SqlParameter("p_kontaktni_osoba", Types.VARCHAR),
                        new SqlParameter("p_telefon", Types.NUMERIC),
                        new SqlParameter("p_email", Types.VARCHAR)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "UPDATE");
        inParams.put("p_id_dodavatelu", dodavatelId);
        inParams.put("p_nazev", name);
        inParams.put("p_kontaktni_osoba", contactPerson);
        inParams.put("p_telefon", phone);
        inParams.put("p_email", email);

        jdbcCall.execute(inParams);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteDodavatel(Long dodavatelId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_dodavatel_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_dodavatelu", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "DELETE");
        inParams.put("p_id_dodavatelu", dodavatelId);

        jdbcCall.execute(inParams);
    }

    public List<Map<String, Object>> getAllDodavatele() {
        return jdbcTemplate.execute((Connection connection) -> {
            CallableStatement callableStatement = connection.prepareCall("{call proc_dodavatel_r(?, ?, ?)}");
            callableStatement.setObject(1, null, Types.NUMERIC); // Передаем null для p_id_dodavatelu
            callableStatement.setObject(2, null, Types.NUMERIC); // Передаем null для p_limit
            callableStatement.registerOutParameter(3, Types.REF_CURSOR); // Регистрируем OUT параметр для курсора

            callableStatement.execute();

            ResultSet resultSet = (ResultSet) callableStatement.getObject(3);
            List<Map<String, Object>> result = new ArrayList<>();

            while (resultSet.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("ID_DODAVATELU", resultSet.getLong("id_dodavatelu"));
                row.put("NAZEV", resultSet.getString("nazev"));
                row.put("KONTAKTNI_OSOBA", resultSet.getString("kontaktniosoba"));
                row.put("TELEFON", resultSet.getLong("telefon"));
                row.put("EMAIL", resultSet.getString("email"));
                result.add(row);
            }
            return result;
        });
    }


    public Map<String, Object> getDodavatelById(Long idDodavatelu) {
        try {
            return jdbcTemplate.execute((Connection connection) -> {
                CallableStatement callableStatement = connection.prepareCall("{call proc_dodavatel_r(?, ?)}");
                callableStatement.setLong(1, idDodavatelu);
                callableStatement.registerOutParameter(2, Types.REF_CURSOR);
                callableStatement.execute();

                ResultSet resultSet = (ResultSet) callableStatement.getObject(2);

                if (resultSet.next()) {
                    Map<String, Object> row = new HashMap<>();
                    row.put("ID_DODAVATELU", resultSet.getLong("ID_DODAVATELU"));
                    row.put("NAZEV", resultSet.getString("NAZEV"));
                    row.put("KONTAKTNI_OSOBA", resultSet.getString("KONTAKTNI_OSOBA"));
                    row.put("TELEFON", resultSet.getLong("TELEFON"));
                    row.put("EMAIL", resultSet.getString("EMAIL"));
                    return row;
                } else {
                    throw new RuntimeException("Supplier not found with ID: " + idDodavatelu);
                }
            });
        } catch (Exception e) {
            throw new RuntimeException("Error fetching supplier by ID: " + e.getMessage(), e);
        }
    }
}
