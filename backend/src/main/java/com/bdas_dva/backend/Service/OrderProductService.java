// src/main/java/com/bdas_dva/backend/Service/OrderProductService.java

package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.OrderProduct.OrderProduct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.*;
import java.util.List;

@Service
public class OrderProductService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Создание новой связи заказ-продукт (Create)
    @Transactional(rollbackFor = Exception.class)
    public void createOrderProduct(OrderProduct orderProduct) {
        jdbcTemplate.update((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_order_product_cud(?, ?, ?, ?)}"); // 4 параметра
            cs.setString(1, "INSERT");
            cs.setLong(2, orderProduct.getOrderId());
            cs.setLong(3, orderProduct.getProductId());
            cs.setInt(4, orderProduct.getQuantity());
            return cs;
        });
    }

    // Обновление существующей связи заказ-продукт (Update)
    @Transactional(rollbackFor = Exception.class)
    public void updateOrderProduct(OrderProduct orderProduct) throws ResourceNotFoundException {
        if (orderProduct.getOrderId() == null || orderProduct.getProductId() == null) {
            throw new IllegalArgumentException("ID заказа и ID продукта не могут быть null для обновления.");
        }

        jdbcTemplate.update((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_order_product_cud(?, ?, ?, ?)}"); // 4 параметра
            cs.setString(1, "UPDATE");
            cs.setLong(2, orderProduct.getOrderId());
            cs.setLong(3, orderProduct.getProductId());
            cs.setInt(4, orderProduct.getQuantity());
            return cs;
        });
    }

    // Удаление связи заказ-продукт (Delete)
    @Transactional(rollbackFor = Exception.class)
    public void deleteOrderProduct(Long objednavkaIdObjednavky, Long produktIdProduktu) throws ResourceNotFoundException {
        if (objednavkaIdObjednavky == null || produktIdProduktu == null) {
            throw new IllegalArgumentException("ID заказа и ID продукта не могут быть null для удаления.");
        }

        jdbcTemplate.update((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{call proc_order_product_cud(?, ?, ?, ?)}"); // 4 параметра
            cs.setString(1, "DELETE");
            cs.setLong(2, objednavkaIdObjednavky);
            cs.setLong(3, produktIdProduktu);
            cs.setNull(4, Types.INTEGER); // p_quantity не требуется для удаления
            return cs;
        });
    }

    // Получение всех связей заказ-продукт (Read)
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public List<OrderProduct> getAllOrderProducts() {
        String query = "SELECT objednavka_id_objednavky, produkt_id_produktu, quantity FROM objednavka_produkt";
        return jdbcTemplate.query(query, (rs, rowNum) -> mapRowToOrderProduct(rs));
    }

    // Получение связи заказ-продукт по составному ключу (Read)
    @Transactional(readOnly = true, rollbackFor = Exception.class)
    public OrderProduct getOrderProductByIds(Long objednavkaIdObjednavky, Long produktIdProduktu) throws ResourceNotFoundException {
        String query = "SELECT objednavka_id_objednavky, produkt_id_produktu, quantity FROM objednavka_produkt WHERE objednavka_id_objednavky = ? AND produkt_id_produktu = ?";
        List<OrderProduct> orderProducts = jdbcTemplate.query(query, new Object[]{objednavkaIdObjednavky, produktIdProduktu},
                (rs, rowNum) -> mapRowToOrderProduct(rs));

        if (orderProducts.isEmpty()) {
            throw new ResourceNotFoundException("Связь заказ-продукт не найдена.", "objednavkaIdObjednavky", objednavkaIdObjednavky.toString());
        }

        return orderProducts.get(0);
    }

    // Метод маппинга строки ResultSet в объект OrderProduct
    private OrderProduct mapRowToOrderProduct(ResultSet rs) throws SQLException {
        OrderProduct op = new OrderProduct();
        op.setOrderId(rs.getLong("objednavka_id_objednavky"));
        op.setProductId(rs.getLong("produkt_id_produktu"));
        op.setQuantity(rs.getInt("quantity"));
        return op;
    }
}
