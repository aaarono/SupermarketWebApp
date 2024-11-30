package com.bdas_dva.backend.Repository;

import com.bdas_dva.backend.Model.Product;
import java.util.List;

public interface ProductRepository {
    List<Product> findByNameContainingIgnoreCase(String name);
    List<Product> findByNameContainingIgnoreCaseAndCategory(String name, String category);
}
