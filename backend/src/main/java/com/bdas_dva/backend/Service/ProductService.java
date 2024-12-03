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
