package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.Address;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.ArrayList;
import java.util.List;

@Service
public class AddressService {


    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(rollbackFor = Exception.class)
    public List<Address> getFilteredAddresses(String ulice, String psc, String mesto, String cisloPopisne) {
        // Формирование SQL-запроса с динамическими условиями
        StringBuilder queryBuilder = new StringBuilder("SELECT * FROM ADRESA WHERE 1=1");

        if (ulice != null && !ulice.isEmpty()) {
            queryBuilder.append(" AND ULICE LIKE ?");
        }
        if (psc != null && !psc.isEmpty()) {
            queryBuilder.append(" AND PSC = ?");
        }
        if (mesto != null && !mesto.isEmpty()) {
            queryBuilder.append(" AND MESTO LIKE ?");
        }
        if (cisloPopisne != null && !cisloPopisne.isEmpty()) {
            queryBuilder.append(" AND CISLOPOPISNE = ?");
        }

        // Преобразование SQL-запроса в строку
        String sql = queryBuilder.toString();

        return jdbcTemplate.query(sql, ps -> {
            int index = 1;
            if (ulice != null && !ulice.isEmpty()) {
                ps.setString(index++, "%" + ulice + "%");
            }
            if (psc != null && !psc.isEmpty()) {
                ps.setString(index++, psc);
            }
            if (mesto != null && !mesto.isEmpty()) {
                ps.setString(index++, "%" + mesto + "%");
            }
            if (cisloPopisne != null && !cisloPopisne.isEmpty()) {
                ps.setString(index++, cisloPopisne);
            }
        }, (rs, rowNum) -> mapRowToAddress(rs));
    }

    /**
     * Метод для создания новой записи об адресе
     */
    @Transactional(rollbackFor = Exception.class)
    public void createAddress(String ulice, Integer psc, String mesto, Integer cisloPopisne) {
        jdbcTemplate.execute("{call proc_adresa_cud(?, ?, ?, ?, ?, ?)}", (CallableStatementCallback<Void>) cs -> {
            cs.setString(1, "INSERT"); // p_action
            cs.setNull(2, Types.NUMERIC); // p_id_adresy
            cs.setString(3, ulice); // p_ulice
            if (psc != null) cs.setInt(4, psc); else cs.setNull(4, Types.NUMERIC); // p_psc
            cs.setString(5, mesto); // p_mesto
            if (cisloPopisne != null) cs.setInt(6, cisloPopisne); else cs.setNull(6, Types.NUMERIC); // p_cisloPopisne
            cs.execute();
            return null;
        });
    }

    /**
     * Метод для обновления существующего адреса
     */
    @Transactional(rollbackFor = Exception.class)
    public void updateAddress(Long idAdresy, String ulice, Integer psc, String mesto, Integer cisloPopisne) {
        jdbcTemplate.execute("{call proc_adresa_cud(?, ?, ?, ?, ?, ?)}", (CallableStatementCallback<Void>) cs -> {
            cs.setString(1, "UPDATE"); // p_action
            cs.setLong(2, idAdresy); // p_id_adresy
            cs.setString(3, ulice); // p_ulice
            if (psc != null) cs.setInt(4, psc); else cs.setNull(4, Types.NUMERIC); // p_psc
            cs.setString(5, mesto); // p_mesto
            if (cisloPopisne != null) cs.setInt(6, cisloPopisne); else cs.setNull(6, Types.NUMERIC); // p_cisloPopisne
            cs.execute();
            return null;
        });
    }

    /**
     * Метод для удаления адреса
     */
    @Transactional(rollbackFor = Exception.class)
    public void deleteAddress(Long idAdresy) {
        jdbcTemplate.execute("{call proc_adresa_cud(?, ?, ?, ?, ?, ?)}", (CallableStatementCallback<Void>) cs -> {
            cs.setString(1, "DELETE"); // p_action
            cs.setLong(2, idAdresy); // p_id_adresy
            cs.setNull(3, Types.VARCHAR); // p_ulice
            cs.setNull(4, Types.NUMERIC); // p_psc
            cs.setNull(5, Types.VARCHAR); // p_mesto
            cs.setNull(6, Types.NUMERIC); // p_cisloPopisne
            cs.execute();
            return null;
        });
    }

    /**
     * Метод для получения адреса по ID адреса
     */
    @Transactional(rollbackFor = Exception.class)
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
