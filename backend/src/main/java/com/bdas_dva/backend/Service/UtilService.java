// UtilService.java
package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.Log;
import com.bdas_dva.backend.Model.Zamestnanec.Pozice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataAccessException;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.sql.CallableStatement;
import java.sql.Connection;

import org.springframework.transaction.annotation.Transactional;

@Service
public class UtilService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Получить все объекты для владельца.
     * @param owner Имя владельца.
     * @return Список объектов и их типов.
     */
    public List<Map<String, Object>> getObjectsByOwner(String owner) {
        String query = "SELECT object_name, object_type FROM all_objects WHERE OWNER = ?";

        try {
            // Выполнение запроса с параметром owner
            return jdbcTemplate.queryForList(query, owner);
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw new RuntimeException("Ошибка при выполнении запроса: " + e.getMessage());
        }
    }

    /**
     * Получить все роли из таблицы ROLE.
     * @return Список ролей.
     */
    public List<Map<String, Object>> getAllRoles() {
        String query = "SELECT * FROM ROLE";

        try {
            // Выполнение запроса для получения всех ролей
            return jdbcTemplate.queryForList(query);
        } catch (DataAccessException e) {
            e.printStackTrace();
            throw new RuntimeException("Ошибка при получении ролей: " + e.getMessage());
        }
    }

    /**
     * Вызвать хранимую процедуру proc_pozice_cud для выполнения CRUD операций.
     * @param action Действие: 'INSERT', 'UPDATE', 'DELETE'.
     * @param pozice Объект Pozice. Для INSERT достаточно поля 'nazev'. Для UPDATE и DELETE требуется 'idPozice'.
     */
    @Transactional
    public void executePoziceCUD(String action, Pozice pozice) {
        jdbcTemplate.execute((Connection connection) -> {
            CallableStatement callableStatement = connection.prepareCall("{call proc_pozice_cud(?, ?, ?)}");
            callableStatement.setString(1, action);
            if (pozice.getIdPozice() != null) {
                callableStatement.setLong(2, pozice.getIdPozice());
            } else {
                callableStatement.setNull(2, java.sql.Types.NUMERIC);
            }
            if (pozice.getNazev() != null) {
                callableStatement.setString(3, pozice.getNazev());
            } else {
                callableStatement.setNull(3, java.sql.Types.VARCHAR);
            }
            callableStatement.execute();
            return null;
        });
    }


    /**
     * Вызвать хранимую процедуру proc_role_cud для выполнения CRUD операций с таблицей ROLE.
     * @param action Действие: 'INSERT', 'UPDATE', 'DELETE'.
     * @param idRole ID роли. Для INSERT можно оставить null.
     * @param roleName Название роли.
     */
    @Transactional
    public void executeRoleCUD(String action, Long idRole, String roleName) {
        jdbcTemplate.execute((Connection connection) -> {
            CallableStatement callableStatement = connection.prepareCall("{call proc_role_cud(?, ?, ?)}");
            callableStatement.setString(1, action);
            if (idRole != null) {
                callableStatement.setLong(2, idRole);
            } else {
                callableStatement.setNull(2, java.sql.Types.NUMERIC);
            }
            if (roleName != null) {
                callableStatement.setString(3, roleName);
            } else {
                callableStatement.setNull(3, java.sql.Types.VARCHAR);
            }
            callableStatement.execute();
            return null;
        });
    }

    /**
     * Вызвать хранимую процедуру proc_log_r для получения логов.
     * @param idLogu ID лога, который нужно получить. Может быть null.
     * @param limit Количество записей, которые нужно получить. Может быть null.
     * @return Список логов.
     */
    public List<Log> getLogs(Long idLogu, Integer limit) {
        return jdbcTemplate.execute((Connection connection) -> {
            CallableStatement callableStatement = connection.prepareCall("{call proc_log_r(?, ?, ?)}");
            callableStatement.setObject(1, idLogu, java.sql.Types.NUMERIC);
            callableStatement.setObject(2, limit, java.sql.Types.NUMERIC);
            callableStatement.registerOutParameter(3, java.sql.Types.REF_CURSOR);
            callableStatement.execute();

            // Получение курсора с результатами
            ResultSet rs = (ResultSet) callableStatement.getObject(3);
            List<Log> logs = new ArrayList<>();

            // Маппинг результатов в объекты Log
            while (rs.next()) {
                Log log = new Log();
                log.setIdLogu(rs.getLong("id_logu"));
                log.setOperace(rs.getString("operace"));
                log.setNazevTabulky(rs.getString("nazevtabulky"));
                log.setDatumModifikace(rs.getString("datummodifikace"));
                log.setOldValues(rs.getString("oldvalues"));
                log.setNewValues(rs.getString("newvalues"));
                logs.add(log);
            }
            return logs;
        });
    }

}
