package com.bdas_dva.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

@Service
public class DodavatelService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(rollbackFor = Exception.class)
    public void addDodavatel(String name, String contactPerson, Long phone, String email) {
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
}
