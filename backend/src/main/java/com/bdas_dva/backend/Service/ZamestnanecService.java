package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.Zamestnanec;
import com.bdas_dva.backend.Model.ZamestnanecRequest;
import com.bdas_dva.backend.Model.ZamestnanecResponse;
import com.bdas_dva.backend.Model.ZamestnanecUserLinkRequest;
import com.bdas_dva.backend.Model.ZamestnanecRegisterRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Transactional;
import java.sql.Date;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ZamestnanecService {

    private static final Logger logger = LoggerFactory.getLogger(ZamestnanecService.class);

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    public ZamestnanecService(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    @Transactional(rollbackFor = Exception.class)
    public List<ZamestnanecResponse> getAllZamestnanci() throws Exception {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_zamnestnanec_r")
                .returningResultSet("p_cursor", new ZamestnanecRowMapper());

        logger.info("Calling procedure proc_zamnestnanec_r to fetch all employees.");

        // Вызов процедуры без входных параметров
        Map<String, Object> out = jdbcCall.execute();

        @SuppressWarnings("unchecked")
        List<ZamestnanecResponse> zamestnanci = (List<ZamestnanecResponse>) out.get("p_cursor");

        if (zamestnanci == null || zamestnanci.isEmpty()) {
            logger.warn("No employees returned by procedure.");
            return Collections.emptyList();
        }

        logger.info("Procedure returned {} employees.", zamestnanci.size());
        return zamestnanci;
    }

    /**
     * Získá seznam zaměstnanců s možností filtrování.
     *
     * @param request Filtrační parametry.
     * @return Seznam zaměstnanců.
     * @throws Exception V případě chyby při volání procedury nebo mapování dat.
     */
    @Transactional(rollbackFor = Exception.class)
    public List<ZamestnanecResponse> getZamestnanciFiltered(ZamestnanecRequest request) throws Exception {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_zamnestnanec_r")
                .returningResultSet("p_cursor", new ZamestnanecRowMapper())
                .declareParameters(
                        new SqlParameter("p_id_zamnestnance", Types.NUMERIC),
                        new SqlParameter("p_jmeno", Types.VARCHAR),
                        new SqlParameter("p_prijmeni", Types.VARCHAR),
                        new SqlParameter("p_supermarket_id_supermarketu", Types.NUMERIC),
                        new SqlParameter("p_sklad_id_skladu", Types.NUMERIC),
                        new SqlParameter("p_pozice_id_pozice", Types.NUMERIC),
                        new SqlParameter("p_manager_flag", Types.NUMERIC),
                        new SqlParameter("p_limit", Types.NUMERIC),
                        new SqlOutParameter("p_cursor", Types.REF_CURSOR)
                );

        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_id_zamnestnance", request.getIdZamestnance())
                .addValue("p_jmeno", request.getJmeno())
                .addValue("p_prijmeni", request.getPrijmeni())
                .addValue("p_supermarket_id_supermarketu",
                        request.getSupermarketIdSupermarketu() != null && request.getSupermarketIdSupermarketu() != 0
                                ? request.getSupermarketIdSupermarketu()
                                : null)
                .addValue("p_sklad_id_skladu",
                        request.getSkladIdSkladu() != null && request.getSkladIdSkladu() != 0
                                ? request.getSkladIdSkladu()
                                : null)
                .addValue("p_pozice_id_pozice", request.getPoziceIdPozice())
                .addValue("p_manager_flag", request.getPoziceIdPozice() != null &&
                        (request.getPoziceIdPozice() == 2 || request.getPoziceIdPozice() == 3) ? 1 : 0)
                .addValue("p_limit", request.getPracovnidoba() != null ? request.getPracovnidoba() : null);

        logger.info("Calling procedure proc_zamnestnanec_r with parameters: {}", inParams);

        Map<String, Object> out = jdbcCall.execute(inParams);

        @SuppressWarnings("unchecked")
        List<ZamestnanecResponse> zamestnanci = (List<ZamestnanecResponse>) out.get("p_cursor");

        // Логирование ID сотрудников
        List<Long> ids = new ArrayList<>();
        if (zamestnanci != null) {
            for (ZamestnanecResponse zamestnanec : zamestnanci) {
                ids.add(zamestnanec.getIdZamestnance());
            }
        }

        logger.info("Returned employee IDs: {}", ids);

        if (zamestnanci == null || zamestnanci.isEmpty()) {
            logger.warn("No employees returned by procedure.");
            return Collections.emptyList();
        }

        logger.info("Procedure returned {} employees.", zamestnanci.size());
        return zamestnanci;
    }

    private static class ZamestnanecRowMapper implements RowMapper<ZamestnanecResponse> {
        @Override
        public ZamestnanecResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
            ZamestnanecResponse zamestnanec = new ZamestnanecResponse();
            zamestnanec.setIdZamestnance(rs.getLong("ID_ZAMNESTNANCE"));
            zamestnanec.setDatumZamestnani(rs.getDate("DATUMZAMESTNANI"));
            zamestnanec.setPracovnidoba(rs.getInt("PRACOVNIDOBA"));
            zamestnanec.setSupermarketIdSupermarketu(rs.getObject("SUPERMARKET_ID_SUPERMARKETU", Long.class));
            zamestnanec.setSkladIdSkladu(rs.getObject("SKLAD_ID_SKLADU", Long.class));
            zamestnanec.setZamestnanecIdZamestnance(
                    rs.getObject("ZAMNESTNANEC_ID_ZAMNESTNANCE", Long.class) != null
                            ? rs.getLong("ZAMNESTNANEC_ID_ZAMNESTNANCE")
                            : null);
            zamestnanec.setAdresaIdAdresy(rs.getObject("ADRESA_ID_ADRESY", Long.class));
            zamestnanec.setJmeno(rs.getString("JMENO") != null ? rs.getString("JMENO") : "Не указано");
            zamestnanec.setPrijmeni(rs.getString("PRIJMENI") != null ? rs.getString("PRIJMENI") : "Не указано");
            zamestnanec.setMzda(rs.getDouble("MZDA"));
            zamestnanec.setPoziceIdPozice(rs.getLong("POZICE_ID_POZICE"));
            return zamestnanec;
        }
    }

    @Transactional(readOnly = true)
    public List<Zamestnanec> getEmployeeHierarchy(Long idEmployee) throws Exception {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("P_SHOW_HIERARCHY_BY_ID")
                .declareParameters(
                        new SqlParameter("P_ID_EMPLOYEE", Types.NUMERIC),
                        new SqlOutParameter("OUT_CURSOR", Types.REF_CURSOR)
                );

        // Параметры для процедуры
        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("P_ID_EMPLOYEE", idEmployee);

        logger.info("Calling procedure P_SHOW_HIERARCHY_BY_ID with parameter: {}", idEmployee);

        // Вызов процедуры
        Map<String, Object> out = jdbcCall.execute(inParams);

        // Получаем результат в виде списка карт
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> hierarchy = (List<Map<String, Object>>) out.get("OUT_CURSOR");

        if (hierarchy == null || hierarchy.isEmpty()) {
            logger.warn("No hierarchy found for employee with ID: {}", idEmployee);
            return Collections.emptyList();
        }

        logger.info("Procedure returned {} hierarchy entries.", hierarchy.size());

        // Маппинг результата на объекты Zamestnanec
        List<Zamestnanec> result = hierarchy.stream().map(this::mapToZamestnanec).collect(Collectors.toList());
        return result;
    }

    private Zamestnanec mapToZamestnanec(Map<String, Object> row) {
        Zamestnanec zamestnanec = new Zamestnanec();

        // Основные поля
        zamestnanec.setLevel(((Number) row.get("V_LEVEL")).intValue()); // Уровень иерархии
        zamestnanec.setEmployeeName((String) row.get("V_EMPLOYEE_NAME")); // Полное имя сотрудника
        zamestnanec.setIdZamestnance(((Number) row.get("ID_ZAMNESTNANCE")).longValue()); // ID сотрудника

        // Новые поля
        zamestnanec.setPoziceIdPozice(row.get("POZICE_ID_POZICE") != null ? ((Number) row.get("POZICE_ID_POZICE")).longValue() : null); // ID позиции
        zamestnanec.setMzda(row.get("MZDA") != null ? ((Number) row.get("MZDA")).doubleValue() : null); // Зарплата
        zamestnanec.setSupermarketIdSupermarketu(row.get("SUPERMARKET_ID_SUPERMARKETU") != null ? ((Number) row.get("SUPERMARKET_ID_SUPERMARKETU")).longValue() : null); // ID супермаркета
        zamestnanec.setSkladIdSkladu(row.get("SKLAD_ID_SKLADU") != null ? ((Number) row.get("SKLAD_ID_SKLADU")).longValue() : null); // ID склада
        zamestnanec.setPracovnidoba(row.get("PRACOVNIDOBA") != null ? ((Number) row.get("PRACOVNIDOBA")).intValue() : null); // Рабочие часы
        zamestnanec.setZamestnanecIdZamestnance(row.get("ZAMNESTNANEC_ID_ZAMNESTNANCE") != null ? ((Number) row.get("ZAMNESTNANEC_ID_ZAMNESTNANCE")).longValue() : null); // ID супермаркета

        return zamestnanec;
    }

    /**
     * Vytvoří nového zaměstnance.
     *
     * @param request Data pro vytvoření zaměstnance.
     * @throws Exception V případě chyby při volání procedury.
     */
    @Transactional(rollbackFor = Exception.class)
    public void createZamestnanec(ZamestnanecRequest request) throws Exception {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("PROC_ZAMNESTNANEC_CUD")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_zamnestnance", Types.NUMERIC),
                        new SqlParameter("p_datumzamestnani", Types.DATE),
                        new SqlParameter("p_pracovnidoba", Types.NUMERIC),
                        new SqlParameter("p_supermarket_id_supermarketu", Types.NUMERIC),
                        new SqlParameter("p_sklad_id_skladu", Types.NUMERIC),
                        new SqlParameter("p_zamnestnanec_id_zamnestnance", Types.NUMERIC),
                        new SqlParameter("p_adresa_id_adresy", Types.NUMERIC),
                        new SqlParameter("p_jmeno", Types.VARCHAR),
                        new SqlParameter("p_prijmeni", Types.VARCHAR),
                        new SqlParameter("p_mzda", Types.NUMERIC),
                        new SqlParameter("p_manager_flag", Types.BOOLEAN)
                );

        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_action", "INSERT")
                .addValue("p_id_zamnestnance", null)
                .addValue("p_datumzamestnani", request.getDatumZamestnani())
                .addValue("p_pracovnidoba", request.getPracovnidoba())
                .addValue("p_supermarket_id_supermarketu", request.getSupermarketIdSupermarketu())
                .addValue("p_sklad_id_skladu", request.getSkladIdSkladu())
                .addValue("p_zamnestnanec_id_zamnestnance", request.getZamestnanecIdZamestnance())
                .addValue("p_adresa_id_adresy", request.getAdresaIdAdresy())
                .addValue("p_jmeno", request.getJmeno())
                .addValue("p_prijmeni", request.getPrijmeni())
                .addValue("p_mzda", BigDecimal.valueOf(request.getMzda()))
                .addValue("p_manager_flag", request.getPoziceIdPozice() != null && (request.getPoziceIdPozice() == 2 || request.getPoziceIdPozice() == 3));

        logger.info("Вызов процедуры PROC_ZAMNESTNANEC_CUD с параметрами: {}", inParams);
        jdbcCall.execute(inParams);
    }

    /**
     * Aktualizuje existujícího zaměstnance.
     *
     * @param idZamestnance ID zaměstnance k aktualizaci.
     * @param request Data pro aktualizaci zaměstnance.
     * @throws Exception V případě chyby při volání procedury.
     */
    @Transactional(rollbackFor = Exception.class)
    public void updateZamestnanec(Long idZamestnance, ZamestnanecRequest request) throws Exception {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_zamnestnanec_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_zamnestnance", Types.NUMERIC),
                        new SqlParameter("p_datumzamestnani", Types.DATE),
                        new SqlParameter("p_pracovnidoba", Types.NUMERIC),
                        new SqlParameter("p_supermarket_id_supermarketu", Types.NUMERIC),
                        new SqlParameter("p_sklad_id_skladu", Types.NUMERIC),
                        new SqlParameter("p_zamnestnanec_id_zamnestnance", Types.NUMERIC),
                        new SqlParameter("p_adresa_id_adresy", Types.NUMERIC),
                        new SqlParameter("p_jmeno", Types.VARCHAR),
                        new SqlParameter("p_prijmeni", Types.VARCHAR),
                        new SqlParameter("p_mzda", Types.NUMERIC),
                        new SqlParameter("p_manager_flag", Types.NUMERIC) // Используем NUMERIC
                );

        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_action", "UPDATE")
                .addValue("p_id_zamnestnance", idZamestnance)
                .addValue("p_datumzamestnani", request.getDatumZamestnani() != null ? new Date(request.getDatumZamestnani().getTime()) : null) // Преобразование в java.sql.Date
                .addValue("p_pracovnidoba", request.getPracovnidoba())
                .addValue("p_supermarket_id_supermarketu", request.getSupermarketIdSupermarketu() != null && request.getSupermarketIdSupermarketu() != 0 ? request.getSupermarketIdSupermarketu() : null)
                .addValue("p_sklad_id_skladu", request.getSkladIdSkladu() != null && request.getSkladIdSkladu() != 0 ? request.getSkladIdSkladu() : null)
                .addValue("p_zamnestnanec_id_zamnestnance", request.getZamestnanecIdZamestnance() != null && request.getZamestnanecIdZamestnance() != 0 ? request.getZamestnanecIdZamestnance() : null)
                .addValue("p_adresa_id_adresy", request.getAdresaIdAdresy() != null && request.getAdresaIdAdresy() != 0 ? request.getAdresaIdAdresy() : null)
                .addValue("p_jmeno", request.getJmeno())
                .addValue("p_prijmeni", request.getPrijmeni())
                .addValue("p_mzda", request.getMzda())
                .addValue("p_manager_flag", request.getPoziceIdPozice() != null && (request.getPoziceIdPozice() == 2 || request.getPoziceIdPozice() == 3) ? 1 : 0); // 1 = manager, 0 = not
        logger.info("Volání procedury proc_zamnestnanec_cud pro UPDATE s parametry: {}", inParams);

        jdbcCall.execute(inParams);
    }

    /**
     * Propojí zaměstnance s uživatelským účtem.
     *
     * @param request Data pro propojení.
     * @throws Exception V případě chyby při volání procedury.
     */
    @Transactional(rollbackFor = Exception.class)
    public void linkZamestnanecUser(ZamestnanecUserLinkRequest request) throws Exception {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_zamestnanec_user_link")
                .declareParameters(
                        new SqlParameter("p_id_zamestnance", Types.NUMERIC),
                        new SqlParameter("p_id_user", Types.NUMERIC)
                );

        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_id_zamestnance", request.getIdZamestnance())
                .addValue("p_id_user", request.getIdUser());

        logger.info("Volání procedury proc_zamestnanec_user_link s parametry: {}", inParams);

        jdbcCall.execute(inParams);
    }

    /**
     * Registruje nového zaměstnance tím, že vytvoří uživatelský účet, zaměstnance a propojí je.
     *
     * @param request Data pro registraci.
     * @return ID uživatele a ID zaměstnance.
     * @throws Exception V případě chyby při volání procedury.
     */
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Long> registerZamestnanec(ZamestnanecRegisterRequest request) throws Exception {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_zamestnanec_register")
                .declareParameters(
                        new SqlParameter("p_jmeno", Types.VARCHAR),
                        new SqlParameter("p_prijmeni", Types.VARCHAR),
                        new SqlParameter("p_email", Types.VARCHAR),
                        new SqlParameter("p_password", Types.VARCHAR),
                        new SqlParameter("p_role_id", Types.NUMERIC),
                        new SqlParameter("p_datumzamestnani", Types.DATE),
                        new SqlParameter("p_pracovnidoba", Types.NUMERIC),
                        new SqlParameter("p_supermarket_id_supermarketu", Types.NUMERIC),
                        new SqlParameter("p_sklad_id_skladu", Types.NUMERIC),
                        new SqlParameter("p_adresa_id_adresy", Types.NUMERIC),
                        new SqlParameter("p_mzda", Types.NUMERIC),
                        new SqlParameter("p_pozice_id_pozice", Types.NUMERIC),
                        new SqlOutParameter("p_id_user", Types.NUMERIC),
                        new SqlOutParameter("p_id_zamestnance", Types.NUMERIC)
                );

        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_jmeno", request.getJmeno())
                .addValue("p_prijmeni", request.getPrijmeni())
                .addValue("p_email", request.getEmail())
                .addValue("p_password", request.getPassword())
                .addValue("p_role_id", request.getRoleId())
                .addValue("p_datumzamestnani", request.getDatumZamestnani())
                .addValue("p_pracovnidoba", request.getPracovnidoba())
                .addValue("p_supermarket_id_supermarketu", request.getSupermarketIdSupermarketu())
                .addValue("p_sklad_id_skladu", request.getSkladIdSkladu())
                .addValue("p_adresa_id_adresy", request.getAdresaIdAdresy())
                .addValue("p_mzda", request.getMzda())
                .addValue("p_pozice_id_pozice", request.getPoziceIdPozice());

        logger.info("Volání procedury proc_zamestnanec_register s parametry: {}", inParams);

        Map<String, Object> out = jdbcCall.execute(inParams);

        Number idUserNumber = (Number) out.get("p_id_user");
        Number idZamestnanceNumber = (Number) out.get("p_id_zamestnance");

        if (idUserNumber == null || idZamestnanceNumber == null) {
            throw new Exception("Registrace zaměstnance selhala: chybí ID uživatele nebo ID zaměstnance.");
        }

        Long idUser = idUserNumber.longValue();
        Long idZamestnance = idZamestnanceNumber.longValue();

        Map<String, Long> result = new HashMap<>();
        result.put("idUser", idUser);
        result.put("idZamestnance", idZamestnance);

        logger.info("Zaměstnanec registrován s ID_USER: {} a ID_ZAMESTNANCENE: {}", idUser, idZamestnance);

        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllPozice() {
        String sql = "SELECT ID_POZICE, NAZEV FROM POZICE";
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Вызов процедуры для получения средней зарплаты подчиненных.
     *
     * @param idZamestnance ID сотрудника.
     * @return Средняя зарплата подчиненных.
     * @throws Exception При ошибке выполнения процедуры.
     */
    public Double getAverageSubordinateSalary(Long idZamestnance) throws Exception {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_average_subordinate_salary")
                .declareParameters(
                        new SqlParameter("p_id_zamnestnance", Types.NUMERIC),
                        new SqlOutParameter("p_average_salary", Types.NUMERIC)
                );

        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_id_zamnestnance", idZamestnance);

        Map<String, Object> out = jdbcCall.execute(inParams);

        // Получаем результат из параметра OUT
        Number averageSalary = (Number) out.get("p_average_salary");
        if (averageSalary != null) {
            return averageSalary.doubleValue();
        } else {
            return null; // Если данных нет, возвращаем null
        }
    }

    @Transactional(readOnly = true)
    public Double getAverageSubordinateSalaryProcedure(Long idZamestnance) throws Exception {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_average_subordinate_salary")
                .declareParameters(
                        new SqlParameter("p_id_zamnestnance", Types.NUMERIC),
                        new SqlOutParameter("p_average_salary", Types.NUMERIC)
                );

        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_id_zamnestnance", idZamestnance);

        Map<String, Object> out = jdbcCall.execute(inParams);

        Number averageSalary = (Number) out.get("p_average_salary");
        return averageSalary != null ? averageSalary.doubleValue() : null;
    }

    public String applySalaryIndexationProcedure(Double minPercentage, Double maxPercentage) throws Exception {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_apply_salary_indexation")
                .declareParameters(
                        new SqlParameter("p_min_percentage", Types.NUMERIC),
                        new SqlParameter("p_max_percentage", Types.NUMERIC)
                );

        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_min_percentage", minPercentage)
                .addValue("p_max_percentage", maxPercentage);

        jdbcCall.execute(inParams);
        return "Salary indexation applied successfully.";
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllEmployeesFromView() {
        String sql = "SELECT * FROM vw_employee_details";
        return jdbcTemplate.queryForList(sql);
    }

//
//    /**
//     * RowMapper pro mapování řádků z CURSOR na ZamestnanecResponse.
//     */
//    private static class ZamestnanecRowMapper implements RowMapper<ZamestnanecResponse> {
//        @Override
//        public ZamestnanecResponse mapRow(ResultSet rs, int rowNum) throws SQLException {
//            ZamestnanecResponse zamestnanec = new ZamestnanecResponse();
//            zamestnanec.setIdZamestnance(rs.getLong("ID_ZAMNESTNANCE"));
//            zamestnanec.setDatumZamestnani(rs.getDate("DATUMZAMESTNANI"));
//            zamestnanec.setPracovnidoba(rs.getInt("PRACOVNIDOBA"));
//            zamestnanec.setSupermarketIdSupermarketu(rs.getLong("SUPERMARKET_ID_SUPERMARKETU"));
//            zamestnanec.setSkladIdSkladu(rs.getLong("SKLAD_ID_SKLADU"));
//            zamestnanec.setZamestnanecIdZamestnance(rs.getLong("ZAMNESTNANEC_ID_ZAMNESTNANCE"));
//            zamestnanec.setAdresaIdAdresy(rs.getLong("ADRESA_ID_ADRESY"));
//            zamestnanec.setJmeno(rs.getString("JMENO"));
//            zamestnanec.setPrijmeni(rs.getString("PRIJMENI"));
//            zamestnanec.setMzda(rs.getDouble("MZDA"));
//            zamestnanec.setPoziceIdPozice(rs.getLong("POZICE_ID_POZICE"));
//            return zamestnanec;
//        }
//    }
}
