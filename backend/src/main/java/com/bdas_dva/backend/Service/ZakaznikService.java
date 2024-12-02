package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.Zakaznik;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class ZakaznikService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Long createZakaznik(Zakaznik zakaznik) {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_zakaznik_cud(?, ?, ?, ?)}"); // 4 параметра
            cs.setString(1, "INSERT");
            cs.registerOutParameter(2, Types.NUMERIC); // p_id_zakazniku OUT
            cs.setLong(3, zakaznik.getTelefon());
            cs.setObject(4, zakaznik.getAdresaIdAdresy() != 0L ? zakaznik.getAdresaIdAdresy() : null);
            cs.execute();
            System.out.println("GOOL");
            // Получаем сгенерированный ID
            Long generatedId = cs.getLong(2); // Получаем значение из выходного параметра p_id_zakazniku
            // Проверяем, не является ли полученное значение null
            if (cs.wasNull()) {
                throw new SQLException("Не удалось получить ID созданного заказчика.");
            }

            return generatedId;
        });
    }

    // Обновление существующего заказчика (Update)
    public void updateZakaznik(Zakaznik zakaznik) throws ResourceNotFoundException {
        if (zakaznik.getIdZakazniku() == null) {
            throw new IllegalArgumentException("ID заказчика не может быть null для обновления.");
        }

        jdbcTemplate.update((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_zakaznik_cud(?, ?, ?, ?)}"); // 4 параметра
            cs.setString(1, "UPDATE");
            cs.setLong(2, zakaznik.getIdZakazniku());
            cs.setLong(3, zakaznik.getTelefon());
            cs.setObject(4, zakaznik.getAdresaIdAdresy() != 0L ? zakaznik.getAdresaIdAdresy() : null);
            return cs;
        });
    }

    // Удаление заказчика (Delete)
    public void deleteZakaznik(Long idZakazniku) throws ResourceNotFoundException {
        if (idZakazniku == null) {
            throw new IllegalArgumentException("ID заказчика не может быть null для удаления.");
        }

        jdbcTemplate.update((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_zakaznik_cud(?, ?, ?, ?)}"); // 4 параметра
            cs.setString(1, "DELETE");
            cs.setLong(2, idZakazniku);
            cs.setNull(3, Types.NUMERIC); // p_telefon
            cs.setNull(4, Types.NUMERIC); // p_adresa_id_adresy
            return cs;
        });
    }

    // Получение заказчика по ID
    public Zakaznik getZakaznikById(Long idZakazniku) throws ResourceNotFoundException {
        List<Zakaznik> zakaznikList = jdbcTemplate.execute("{call proc_zakaznik_r(?, ?, ?)}",
                (CallableStatementCallback<List<Zakaznik>>) cs -> {
                    cs.setLong(1, idZakazniku); // p_id_zakazniku
                    cs.setNull(2, Types.NUMERIC); // p_telefon
                    cs.registerOutParameter(3, Types.REF_CURSOR);
                    cs.execute();
                    ResultSet rs = (ResultSet) cs.getObject(3);
                    List<Zakaznik> list = new ArrayList<>();
                    while (rs.next()) {
                        Zakaznik zakaznik = mapRowToZakaznik(rs);
                        list.add(zakaznik);
                    }
                    return list;
                });

        if (zakaznikList.isEmpty()) {
            throw new ResourceNotFoundException("Заказчик с ID " + idZakazniku + " не найден.", "idZakazniku", idZakazniku.toString());
        }

        return zakaznikList.get(0);
    }

    public Zakaznik getZakaznikByTelefon(Long telefon) throws ResourceNotFoundException {
        List<Zakaznik> zakaznikList = jdbcTemplate.execute("{call proc_zakaznik_r(?, ?, ?, ?)}",
                (CallableStatementCallback<List<Zakaznik>>) cs -> {
                    cs.setNull(1, Types.NUMERIC); // p_id_zakazniku
                    cs.setLong(2, telefon); // p_telefon
                    cs.setNull(3, Types.NUMERIC); // p_limit
                    cs.registerOutParameter(4, Types.REF_CURSOR);
                    cs.execute();
                    ResultSet rs = (ResultSet) cs.getObject(4);
                    List<Zakaznik> list = new ArrayList<>();
                    while (rs.next()) {
                        Zakaznik zakaznik = mapRowToZakaznik(rs);
                        list.add(zakaznik);
                    }
                    return list;
                });

        if (zakaznikList.isEmpty()) {
            throw new ResourceNotFoundException("Заказчик с телефоном " + telefon + " не найден.", "telefon", telefon.toString());
        }

        return zakaznikList.get(0);
    }

    // Получение ограниченного количества заказчиков
    public List<Zakaznik> getZakaznikWithLimit(Integer limit) {
        return jdbcTemplate.execute("{call proc_zakaznik_r(?, ?, ?)}",
                (CallableStatementCallback<List<Zakaznik>>) cs -> {
                    cs.setNull(1, Types.NUMERIC); // p_id_zakazniku
                    cs.setNull(2, Types.NUMERIC); // p_telefon
                    if (limit != null) {
                        cs.setInt(3, limit); // p_limit
                    } else {
                        cs.setNull(3, Types.NUMERIC); // p_limit
                    }
                    cs.registerOutParameter(3, Types.REF_CURSOR);
                    cs.execute();
                    ResultSet rs = (ResultSet) cs.getObject(3);
                    List<Zakaznik> list = new ArrayList<>();
                    while (rs.next()) {
                        Zakaznik zakaznik = mapRowToZakaznik(rs);
                        list.add(zakaznik);
                    }
                    return list;
                });
    }

    // Получение всех заказчиков
    public List<Zakaznik> getAllZakaznik() {
        return jdbcTemplate.execute("{call proc_zakaznik_r(?, ?, ?)}",
                (CallableStatementCallback<List<Zakaznik>>) cs -> {
                    cs.setNull(1, Types.NUMERIC); // p_id_zakazniku
                    cs.setNull(2, Types.NUMERIC); // p_telefon
                    cs.setNull(3, Types.NUMERIC); // p_limit
                    cs.registerOutParameter(3, Types.REF_CURSOR);
                    cs.execute();
                    ResultSet rs = (ResultSet) cs.getObject(3);
                    List<Zakaznik> list = new ArrayList<>();
                    while (rs.next()) {
                        Zakaznik zakaznik = mapRowToZakaznik(rs);
                        list.add(zakaznik);
                    }
                    return list;
                });
    }

    // Метод для маппинга строки ResultSet в объект Zakaznik
    private Zakaznik mapRowToZakaznik(ResultSet rs) throws SQLException {
        Zakaznik zakaznik = new Zakaznik();
        zakaznik.setIdZakazniku(rs.getLong("id_zakazniku"));
        zakaznik.setTelefon(rs.getLong("telefon"));
        zakaznik.setAdresaIdAdresy(rs.getLong("adresa_id_adresy"));
        return zakaznik;
    }
}
