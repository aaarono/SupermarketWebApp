package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.CallableStatementCallback;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Регистрация нового пользователя (Create)
    public void createUser(User user) {
        jdbcTemplate.update((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_user_cud(?, ?, ?, ?, ?, ?, ?, ?)}");
            cs.setString(1, "INSERT");
            cs.setObject(2, null); // p_id_user
            cs.setString(3, user.getJmeno());
            cs.setString(4, user.getPrijmeni());
            cs.setString(5, user.getEmail());
            cs.setString(6, user.getPassword()); // Пароль должен быть хеширован
            cs.setLong(7, user.getRoleIdRole());
            cs.setObject(8, user.getZakaznikIdZakazniku());
            cs.setObject(9, user.getZamnestnanecIdZamnestnance());
            return cs;
        });
    }

    // Обновление существующего пользователя (Update)
    public void updateUser(User user) throws ResourceNotFoundException {
        if (user.getIdUser() == null) {
            throw new IllegalArgumentException("ID пользователя не может быть null для обновления.");
        }

        jdbcTemplate.update((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_user_cud(?, ?, ?, ?, ?, ?, ?, ?)}");
            cs.setString(1, "UPDATE");
            cs.setLong(2, user.getIdUser());
            cs.setString(3, user.getJmeno());
            cs.setString(4, user.getPrijmeni());
            cs.setString(5, user.getEmail());
            cs.setString(6, user.getPassword());
            cs.setLong(7, user.getRoleIdRole());
            cs.setObject(8, user.getZakaznikIdZakazniku());
            cs.setObject(9, user.getZamnestnanecIdZamnestnance());
            return cs;
        });
    }

    // Удаление пользователя (Delete)
    public void deleteUser(Long idUser) throws ResourceNotFoundException {
        if (idUser == null) {
            throw new IllegalArgumentException("ID пользователя не может быть null для удаления.");
        }

        jdbcTemplate.update((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_user_cud(?, ?, ?, ?, ?, ?, ?, ?)}");
            cs.setString(1, "DELETE");
            cs.setLong(2, idUser);
            cs.setNull(3, Types.VARCHAR); // p_jmeno
            cs.setNull(4, Types.VARCHAR); // p_prijmeni
            cs.setNull(5, Types.VARCHAR); // p_email
            cs.setNull(6, Types.VARCHAR); // p_password
            cs.setNull(7, Types.NUMERIC); // p_role_id_role
            cs.setNull(8, Types.NUMERIC); // p_zakaznik_id_zakazniku
            cs.setNull(9, Types.NUMERIC); // p_zamnestnanec_id_zamnestnance
            return cs;
        });
    }

    // Получение пользователя по email
    public User getUserByEmail(String email) throws ResourceNotFoundException {
        List<User> users = jdbcTemplate.execute("{call proc_user_r(?, ?, ?)}",
                (CallableStatementCallback<List<User>>) cs -> {
                    cs.setObject(1, null); // p_id_user
                    cs.setObject(2, null); // p_limit
                    cs.registerOutParameter(3, Types.REF_CURSOR);
                    cs.execute();
                    ResultSet rs = (ResultSet) cs.getObject(3);
                    List<User> list = new ArrayList<>();
                    while (rs.next()) {
                        User user = mapRowToUser(rs);
                        list.add(user);
                    }
                    return list;
                });

        for (User user : users) {
            if (user.getEmail().equalsIgnoreCase(email)) {
                return user;
            }
        }
        throw new ResourceNotFoundException("Пользователь с таким email не найден.", "email", email);
    }

    // Получение пользователя по ID
    public User getUserById(Long idUser) throws ResourceNotFoundException {
        List<User> users = jdbcTemplate.execute("{call proc_user_r(?, ?, ?)}",
                (CallableStatementCallback<List<User>>) cs -> {
                    cs.setLong(1, idUser); // p_id_user
                    cs.setObject(2, null); // p_limit
                    cs.registerOutParameter(3, Types.REF_CURSOR);
                    cs.execute();
                    ResultSet rs = (ResultSet) cs.getObject(3);
                    List<User> list = new ArrayList<>();
                    while (rs.next()) {
                        User user = mapRowToUser(rs);
                        list.add(user);
                    }
                    return list;
                });

        if (users.isEmpty()) {
            throw new ResourceNotFoundException("Пользователь с ID " + idUser + " не найден.", "idUser", idUser.toString());
        }

        return users.get(0);
    }

    // Получение всех пользователей с ограничением
    public List<User> getAllUsers(Long startingId, Integer limit) {
        return jdbcTemplate.execute("{call proc_user_r(?, ?, ?)}",
                (CallableStatementCallback<List<User>>) cs -> {
                    if (startingId != null) {
                        cs.setLong(1, startingId); // p_id_user
                    } else {
                        cs.setNull(1, Types.NUMERIC); // p_id_user
                    }

                    if (limit != null) {
                        cs.setInt(2, limit); // p_limit
                    } else {
                        cs.setNull(2, Types.NUMERIC); // p_limit
                    }

                    cs.registerOutParameter(3, Types.REF_CURSOR);
                    cs.execute();
                    ResultSet rs = (ResultSet) cs.getObject(3);
                    List<User> list = new ArrayList<>();
                    while (rs.next()) {
                        User user = mapRowToUser(rs);
                        list.add(user);
                    }
                    return list;
                });
    }

    // Логин пользователя
    public User loginUser(String email, String password) throws ResourceNotFoundException {
        User user = getUserByEmail(email);
        return user;
    }

    // Метод для маппинга строки ResultSet в объект User
    private User mapRowToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setIdUser(rs.getLong("id_user"));
        user.setJmeno(rs.getString("jmeno"));
        user.setPrijmeni(rs.getString("prijmeni"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setRoleIdRole(rs.getLong("role_id_role"));
        user.setZakaznikIdZakazniku(rs.getLong("zakaznik_id_zakazniku"));
        user.setZamnestnanecIdZamnestnance(rs.getLong("zamnestnanec_id_zamnestnance"));
        return user;
    }
}
