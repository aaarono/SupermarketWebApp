package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.Supermarket;
import java.util.List;

public interface ISupermarketService {
    Supermarket createSupermarket(Supermarket supermarket);
    Supermarket getSupermarketById(Long id);
    List<Supermarket> getAllSupermarkets();
    Supermarket updateSupermarket(Long id, Supermarket supermarketDetails);
    void deleteSupermarket(Long id);
}
