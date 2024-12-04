// ProductService.java
package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.ImageData;
import com.bdas_dva.backend.Model.Product;
import org.hibernate.dialect.OracleTypes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.*;

@Service
public class ProductService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // Getting the list of products
    public List<Product> getProducts(String searchQuery, String category) {
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

    // Adding a new product
    public void addProduct(String name, Double price, String description, Integer categoryId, Integer warehouseId) {
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
        inParams.put("p_nazev", name);
        inParams.put("p_cena", price);
        inParams.put("p_popis", description);
        inParams.put("p_kat_prod_id_kategorie", categoryId);
        inParams.put("p_sklad_id_skladu", warehouseId);

        jdbcCall.execute(inParams);
    }

    // Updating an existing product
    public void updateProduct(Long productId, String name, Double price, String description, Integer categoryId, Integer warehouseId) {
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
        inParams.put("p_sklad_id_skladu", warehouseId);

        jdbcCall.execute(inParams);
    }

    // Deleting a product
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

        jdbcCall.execute(inParams);
    }

    // Method to retrieve image data for a product
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
        product.setDescription(rs.getString("description"));
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
