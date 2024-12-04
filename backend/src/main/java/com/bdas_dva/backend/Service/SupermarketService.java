package com.bdas_dva.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;

import java.sql.Types;
import java.util.HashMap;
import java.util.Map;

@Service
public class SupermarketService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void addSupermarket(String name, Long phone, String email, Long addressId,
                               String street, Integer postalCode, String city, Integer buildingNumber) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_supermarket_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_supermarketu", Types.NUMERIC),
                        new SqlParameter("p_nazev", Types.VARCHAR),
                        new SqlParameter("p_telefon", Types.NUMERIC),
                        new SqlParameter("p_email", Types.VARCHAR),
                        new SqlParameter("p_adresa_id_adresy", Types.NUMERIC),
                        new SqlParameter("p_ulice", Types.VARCHAR),
                        new SqlParameter("p_psc", Types.NUMERIC),
                        new SqlParameter("p_mesto", Types.VARCHAR),
                        new SqlParameter("p_cisloPopisne", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "INSERT");
        inParams.put("p_id_supermarketu", null);
        inParams.put("p_nazev", name);
        inParams.put("p_telefon", phone);
        inParams.put("p_email", email);
        inParams.put("p_adresa_id_adresy", addressId);
        inParams.put("p_ulice", street);
        inParams.put("p_psc", postalCode);
        inParams.put("p_mesto", city);
        inParams.put("p_cisloPopisne", buildingNumber);

        jdbcCall.execute(inParams);
    }

    public void updateSupermarket(Long supermarketId, String name, Long phone, String email, Long addressId,
                                  String street, Integer postalCode, String city, Integer buildingNumber) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_supermarket_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_supermarketu", Types.NUMERIC),
                        new SqlParameter("p_nazev", Types.VARCHAR),
                        new SqlParameter("p_telefon", Types.NUMERIC),
                        new SqlParameter("p_email", Types.VARCHAR),
                        new SqlParameter("p_adresa_id_adresy", Types.NUMERIC),
                        new SqlParameter("p_ulice", Types.VARCHAR),
                        new SqlParameter("p_psc", Types.NUMERIC),
                        new SqlParameter("p_mesto", Types.VARCHAR),
                        new SqlParameter("p_cisloPopisne", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "UPDATE");
        inParams.put("p_id_supermarketu", supermarketId);
        inParams.put("p_nazev", name);
        inParams.put("p_telefon", phone);
        inParams.put("p_email", email);
        inParams.put("p_adresa_id_adresy", addressId);
        inParams.put("p_ulice", street);
        inParams.put("p_psc", postalCode);
        inParams.put("p_mesto", city);
        inParams.put("p_cisloPopisne", buildingNumber);

        jdbcCall.execute(inParams);
    }

    public void deleteSupermarket(Long supermarketId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_supermarket_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_supermarketu", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "DELETE");
        inParams.put("p_id_supermarketu", supermarketId);

        jdbcCall.execute(inParams);
    }
}
