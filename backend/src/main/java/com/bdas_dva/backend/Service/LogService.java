package com.bdas_dva.backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class LogService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Получение всех записей логов
     */
    public List<Map<String, Object>> getAllLogs() {
        String sql = "SELECT ID_LOGU, OPERACE, NAZEVTABULKY, DATUMMODIFIKACE, OLDVALUES, NEWVALUES FROM LOG";
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Получение записи лога по ID
     */
    public Map<String, Object> getLogById(Long logId) {
        String sql = "SELECT ID_LOGU, OPERACE, NAZEVTABULKY, DATUMMODIFIKACE, OLDVALUES, NEWVALUES FROM LOG WHERE ID_LOGU = ?";
        return jdbcTemplate.queryForMap(sql, logId);
    }

    /**
     * Фильтрация записей логов
     */
    public List<Map<String, Object>> getLogsByFilters(String operation, String tableName, String modificationDate) {
        StringBuilder sqlBuilder = new StringBuilder(
                "SELECT ID_LOGU, OPERACE, NAZEVTABULKY, DATUMMODIFIKACE, OLDVALUES, NEWVALUES FROM LOG WHERE 1=1"
        );

        List<Object> params = new ArrayList<>();
        if (operation != null && !operation.isEmpty()) {
            sqlBuilder.append(" AND OPERACE = ?");
            params.add(operation);
        }
        if (tableName != null && !tableName.isEmpty()) {
            sqlBuilder.append(" AND NAZEVTABULKY = ?");
            params.add(tableName);
        }
        if (modificationDate != null && !modificationDate.isEmpty()) {
            sqlBuilder.append(" AND TO_CHAR(DATUMMODIFIKACE, 'YYYY-MM-DD') = ?");
            params.add(modificationDate);
        }

        return jdbcTemplate.queryForList(sqlBuilder.toString(), params.toArray());
    }
}
