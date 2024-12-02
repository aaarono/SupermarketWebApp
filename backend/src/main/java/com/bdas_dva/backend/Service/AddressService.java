package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

@Service
public class AddressService {


    @Autowired
    private JdbcTemplate jdbcTemplate;
    /**
     * Метод для получения адреса по ID адреса
     */
    public Address getAddressById(Long idAdresy) throws ResourceNotFoundException {
        List<Address> addresses = jdbcTemplate.execute("{call proc_adresa_r(?, ?, ?)}",
                (CallableStatementCallback<List<Address>>) cs -> {
                    cs.setLong(1, idAdresy); // p_id_adresy
                    cs.setNull(2, Types.NUMERIC); // p_limit
                    cs.registerOutParameter(3, Types.REF_CURSOR);
                    cs.execute();
                    ResultSet rs = (ResultSet) cs.getObject(3);
                    List<Address> list = new ArrayList<>();
                    while (rs.next()) {
                        Address address = mapRowToAddress(rs);
                        list.add(address);
                    }
                    return list;
                });

        if (addresses.isEmpty()) {
            throw new ResourceNotFoundException("Адрес с ID " + idAdresy + " не найден.", "idAdresy", idAdresy.toString());
        }

        return addresses.get(0);
    }


    private Address mapRowToAddress(ResultSet rs) throws SQLException {
        Address address = new Address();
        address.setIdAdresy(rs.getLong("id_adresy"));
        address.setUlice(rs.getString("ulice"));
        address.setPsc(rs.getString("psc"));
        address.setMesto(rs.getString("mesto"));
        address.setCisloPopisne(rs.getString("cislopopisne"));
        return address;
    }
}
