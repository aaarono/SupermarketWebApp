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
import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class AddressService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private static final Logger LOGGER = Logger.getLogger(AddressService.class.getName());

    @Transactional(rollbackFor = Exception.class)
    public List<Address> getFilteredAddresses(String ulice, String psc, String mesto, String cisloPopisne) {
        try {
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
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error fetching filtered addresses: ", e);
            throw new RuntimeException("Failed to fetch filtered addresses", e);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void createAddress(String ulice, Integer psc, String mesto, Integer cisloPopisne) {
        try {
            jdbcTemplate.execute("{call proc_adresa_cud(?, ?, ?, ?, ?, ?)}", (CallableStatementCallback<Void>) cs -> {
                cs.setString(1, "INSERT");
                cs.setNull(2, Types.NUMERIC);
                cs.setString(3, ulice);
                if (psc != null) cs.setInt(4, psc); else cs.setNull(4, Types.NUMERIC);
                cs.setString(5, mesto);
                if (cisloPopisne != null) cs.setInt(6, cisloPopisne); else cs.setNull(6, Types.NUMERIC);
                cs.execute();
                return null;
            });
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error creating address: ", e);
            throw new RuntimeException("Failed to create address", e);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateAddress(Long idAdresy, String ulice, Integer psc, String mesto, Integer cisloPopisne) {
        try {
            jdbcTemplate.execute("{call proc_adresa_cud(?, ?, ?, ?, ?, ?)}", (CallableStatementCallback<Void>) cs -> {
                cs.setString(1, "UPDATE");
                cs.setLong(2, idAdresy);
                cs.setString(3, ulice);
                if (psc != null) cs.setInt(4, psc); else cs.setNull(4, Types.NUMERIC);
                cs.setString(5, mesto);
                if (cisloPopisne != null) cs.setInt(6, cisloPopisne); else cs.setNull(6, Types.NUMERIC);
                cs.execute();
                return null;
            });
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error updating address: ", e);
            throw new RuntimeException("Failed to update address", e);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public void deleteAddress(Long idAdresy) {
        try {
            jdbcTemplate.execute("{call proc_adresa_cud(?, ?, ?, ?, ?, ?)}", (CallableStatementCallback<Void>) cs -> {
                cs.setString(1, "DELETE");
                cs.setLong(2, idAdresy);
                cs.setNull(3, Types.VARCHAR);
                cs.setNull(4, Types.NUMERIC);
                cs.setNull(5, Types.VARCHAR);
                cs.setNull(6, Types.NUMERIC);
                cs.execute();
                return null;
            });
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error deleting address: ", e);
            throw new RuntimeException("Failed to delete address", e);
        }
    }

    @Transactional(rollbackFor = Exception.class)
    public Address getAddressById(Long idAdresy) throws ResourceNotFoundException {
        try {
            List<Address> addresses = jdbcTemplate.execute("{call proc_adresa_r(?, ?, ?)}",
                    (CallableStatementCallback<List<Address>>) cs -> {
                        cs.setLong(1, idAdresy);
                        cs.setNull(2, Types.NUMERIC);
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
        } catch (ResourceNotFoundException e) {
            LOGGER.log(Level.WARNING, "Address not found: ", e);
            throw e;
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error fetching address by ID: ", e);
            throw new RuntimeException("Failed to fetch address by ID", e);
        }
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
