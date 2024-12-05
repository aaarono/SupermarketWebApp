// ProductService.java
package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.ImageData;
import com.bdas_dva.backend.Model.Product;
import org.hibernate.dialect.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.*;
import java.util.*;

@Service
public class ProductService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional(rollbackFor = Exception.class)
    public List<Product> getProductsImage(String searchQuery, String category) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_product_r")
                .declareParameters(
                        new SqlParameter("p_search_query", Types.VARCHAR),
                        new SqlParameter("p_category", Types.VARCHAR),
                        new SqlOutParameter("p_products", OracleTypes.CURSOR)
                )
                .returningResultSet("p_products", productRowMapper);

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_search_query", searchQuery != null && !searchQuery.isEmpty() ? searchQuery : null);
        inParams.put("p_category", category != null && !category.isEmpty() ? category : null);

        Map<String, Object> out = jdbcCall.execute(inParams);

        @SuppressWarnings("unchecked")
        List<Product> products = (List<Product>) out.get("p_products");

        return products;
    }

    // Получение всех продуктов из таблицы PRODUKT
    @Transactional(rollbackFor = Exception.class)
    public List<Product> getProducts(String searchQuery, String category) {
        String sql = "SELECT ID_PRODUKTU, NAZEV, CENA, POPIS, KAT_PROD_ID_KATEGORIE, SKLAD_ID_SKLADU FROM PRODUKT";

        List<Object> params = new ArrayList<>();
        List<Integer> paramTypes = new ArrayList<>();

        if (searchQuery != null && !searchQuery.isEmpty()) {
            sql += " WHERE LOWER(NAZEV) LIKE LOWER(?)";
            params.add("%" + searchQuery + "%");
            paramTypes.add(Types.VARCHAR);
        }

        if (category != null && !category.equals("all")) {
            sql += params.isEmpty() ? " WHERE " : " AND ";
            sql += "KAT_PROD_ID_KATEGORIE = ?";
            params.add(Integer.parseInt(category));
            paramTypes.add(Types.NUMERIC);
        }

        return jdbcTemplate.query(sql, params.toArray(), (rs, rowNum) -> {
            Product product = new Product();
            product.setId(rs.getLong("ID_PRODUKTU"));
            product.setName(rs.getString("NAZEV"));
            product.setPrice(rs.getDouble("CENA"));
            product.setCategoryId(rs.getLong("KAT_PROD_ID_KATEGORIE"));
            product.setSkladId(rs.getLong("SKLAD_ID_SKLADU"));
            return product;
        });
    }



    // Adding a new product
    @Transactional(rollbackFor = Exception.class)
    public void addProduct(String name, Double price, String description, Integer categoryId, Integer skladId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_produkt_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_produktu", Types.NUMERIC),
                        new SqlParameter("p_nazev", Types.VARCHAR),
                        new SqlParameter("p_cena", Types.NUMERIC),
                        new SqlParameter("p_popis", Types.CLOB),
                        new SqlParameter("p_kat_prod_id_kategorie", Types.NUMERIC),
                        new SqlParameter("p_sklad_id_skladu", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "INSERT");
        inParams.put("p_id_produktu", null);
        inParams.put("p_nazev", name);
        inParams.put("p_cena", price);
        inParams.put("p_popis", description);
        inParams.put("p_kat_prod_id_kategorie", categoryId);
        inParams.put("p_sklad_id_skladu", skladId);

        jdbcCall.execute(inParams);
    }

    // Updating an existing product
    @Transactional(rollbackFor = Exception.class)
    public void updateProduct(Long productId, String name, Double price, String description, Integer categoryId, Integer skladId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_produkt_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_produktu", Types.NUMERIC),
                        new SqlParameter("p_nazev", Types.VARCHAR),
                        new SqlParameter("p_cena", Types.NUMERIC),
                        new SqlParameter("p_popis", Types.CLOB),
                        new SqlParameter("p_kat_prod_id_kategorie", Types.NUMERIC),
                        new SqlParameter("p_sklad_id_skladu", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "UPDATE");
        inParams.put("p_id_produktu", productId);
        inParams.put("p_nazev", name);
        inParams.put("p_cena", price);
        inParams.put("p_popis", description);
        inParams.put("p_kat_prod_id_kategorie", categoryId);
        inParams.put("p_sklad_id_skladu", skladId);

        jdbcCall.execute(inParams);
    }

    // Deleting a product
    @Transactional(rollbackFor = Exception.class)
    public void deleteProduct(Long productId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_produkt_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_produktu", Types.NUMERIC),
                        new SqlParameter("p_nazev", Types.VARCHAR),
                        new SqlParameter("p_cena", Types.NUMERIC),
                        new SqlParameter("p_popis", Types.CLOB),
                        new SqlParameter("p_kat_prod_id_kategorie", Types.NUMERIC),
                        new SqlParameter("p_sklad_id_skladu", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "DELETE");
        inParams.put("p_id_produktu", productId);
        inParams.put("p_nazev", null);
        inParams.put("p_cena", null);
        inParams.put("p_popis", null);
        inParams.put("p_kat_prod_id_kategorie", null);
        inParams.put("p_sklad_id_skladu", null);

        jdbcCall.execute(inParams);
    }

    // Method to retrieve image data for a product
    @Transactional(rollbackFor = Exception.class)
    public ImageData getProductImage(Long productId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_obrazek_r")
                .declareParameters(
                        new SqlParameter("p_produkt_id_produktu", Types.NUMERIC),
                        new SqlOutParameter("p_cursor", OracleTypes.CURSOR)
                )
                .returningResultSet("p_cursor", (rs, rowNum) -> {
                    Blob imageBlob = rs.getBlob("OBRAZEK");
                    String imageType = rs.getString("TYP"); // Assuming TYP stores the MIME type
                    ImageData imageData = new ImageData();
                    if (imageBlob != null) {
                        byte[] imageBytes = imageBlob.getBytes(1, (int) imageBlob.length());
                        String base64Image = java.util.Base64.getEncoder().encodeToString(imageBytes);
                        imageData.setImage(base64Image);
                    }
                    imageData.setImageType(imageType);
                    return imageData;
                });

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_produkt_id_produktu", productId);

        Map<String, Object> out = jdbcCall.execute(inParams);

        @SuppressWarnings("unchecked")
        List<ImageData> images = (List<ImageData>) out.get("p_cursor");

        if (images != null && !images.isEmpty()) {
            return images.get(0);
        } else {
            return null;
        }
    }

    // Adding a new image
    @Transactional(rollbackFor = Exception.class)
    public void addProductImage(Long productId, byte[] imageBytes, String name, String type, Integer formatId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_obrazek_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_obrazku", Types.NUMERIC),
                        new SqlParameter("p_obrazek", Types.BLOB),
                        new SqlParameter("p_nazev", Types.VARCHAR),
                        new SqlParameter("p_typ", Types.VARCHAR),
                        new SqlParameter("p_format_id_formatu", Types.NUMERIC),
                        new SqlParameter("p_produkt_id_produktu", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "CREATE");
        inParams.put("p_obrazek", imageBytes);
        inParams.put("p_nazev", name);
        inParams.put("p_typ", type);
        inParams.put("p_format_id_formatu", formatId);
        inParams.put("p_produkt_id_produktu", productId);

        jdbcCall.execute(inParams);
    }

    // Updating an existing image
    @Transactional(rollbackFor = Exception.class)
    public void updateProductImage(Long productId, byte[] imageBytes, String name, String type, Integer formatId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_obrazek_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_obrazku", Types.NUMERIC),
                        new SqlParameter("p_obrazek", Types.BLOB),
                        new SqlParameter("p_nazev", Types.VARCHAR),
                        new SqlParameter("p_typ", Types.VARCHAR),
                        new SqlParameter("p_format_id_formatu", Types.NUMERIC),
                        new SqlParameter("p_produkt_id_produktu", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "UPDATE");
        inParams.put("p_obrazek", imageBytes);
        inParams.put("p_nazev", name);
        inParams.put("p_typ", type);
        inParams.put("p_format_id_formatu", formatId);
        inParams.put("p_produkt_id_produktu", productId);

        jdbcCall.execute(inParams);
    }

    // Deleting an image
    @Transactional(rollbackFor = Exception.class)
    public void deleteProductImage(Long productId) {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_obrazek_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_obrazku", Types.NUMERIC),
                        new SqlParameter("p_obrazek", Types.BLOB),
                        new SqlParameter("p_nazev", Types.VARCHAR),
                        new SqlParameter("p_typ", Types.VARCHAR),
                        new SqlParameter("p_format_id_formatu", Types.NUMERIC),
                        new SqlParameter("p_produkt_id_produktu", Types.NUMERIC)
                );

        Map<String, Object> inParams = new HashMap<>();
        inParams.put("p_action", "DELETE");
        inParams.put("p_produkt_id_produktu", productId);

        jdbcCall.execute(inParams);
    }

    private RowMapper<Product> productRowMapper = (rs, rowNum) -> {
        Product product = new Product();
        product.setId(rs.getLong("id"));
        product.setName(rs.getString("name"));
        product.setPrice(rs.getDouble("price"));
        product.setCategory(rs.getString("category"));

        // Handling the image
        Blob imageBlob = rs.getBlob("image");
        if (imageBlob != null) {
            byte[] imageBytes = imageBlob.getBytes(1, (int) imageBlob.length());
            String base64Image = java.util.Base64.getEncoder().encodeToString(imageBytes);
            product.setImage(base64Image);
        } else {
            product.setImage(null);
        }

        return product;
    };
}
