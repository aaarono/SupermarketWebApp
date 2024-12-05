package com.bdas_dva.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@Service
public class SkladService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllSklady() {
        String sql = "SELECT id_skladu, nazev, telefon, email, adresa_id_adresy FROM sklad";
        return jdbcTemplate.queryForList(sql);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getSkladById(Long skladId) {
        String sql = "SELECT id_skladu, nazev, telefon, email, adresa_id_adresy FROM sklad WHERE id_skladu = ?";
        return jdbcTemplate.queryForMap(sql, skladId);
    }

    @Transactional(rollbackFor = Exception.class)
    public void addSklad(String nazev, Long telefon, String email, Long adresaIdAdresy) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate).withProcedureName("proc_sklad_cud");

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "INSERT");
        inParams.put("p_id_skladu", null);
        inParams.put("p_nazev", nazev);
        inParams.put("p_telefon", telefon);
        inParams.put("p_email", email);
        inParams.put("p_adresa_id_adresy", adresaIdAdresy);

        jdbcCall.execute(inParams);
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateSklad(Long skladId, String nazev, Long telefon, String email, Long adresaIdAdresy) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate).withProcedureName("proc_sklad_cud");

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "UPDATE");
        inParams.put("p_id_skladu", skladId);
        inParams.put("p_nazev", nazev);
        inParams.put("p_telefon", telefon);
        inParams.put("p_email", email);
        inParams.put("p_adresa_id_adresy", adresaIdAdresy);

        jdbcCall.execute(inParams);
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteSklad(Long skladId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate).withProcedureName("proc_sklad_cud");

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "DELETE");
        inParams.put("p_id_skladu", skladId);

        jdbcCall.execute(inParams);
    }
}
