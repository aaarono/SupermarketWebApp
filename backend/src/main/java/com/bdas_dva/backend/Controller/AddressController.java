package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.Address;
import com.bdas_dva.backend.Service.AddressService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    /**
     * Получение всех адресов с фильтрацией по параметрам
     * @param ulice - Улица
     * @param psc - Почтовый индекс (PSC)
     * @param mesto - Город
     * @param cisloPopisne - Число описное
     * @return Список адресов
     */
    @GetMapping
    public ResponseEntity<List<Address>> getAddresses(
            @RequestParam(value = "ulice", required = false) String ulice,
            @RequestParam(value = "psc", required = false) String psc,
            @RequestParam(value = "mesto", required = false) String mesto,
            @RequestParam(value = "cisloPopisne", required = false) String cisloPopisne) {

        List<Address> addresses = addressService.getFilteredAddresses(ulice, psc, mesto, cisloPopisne);
        return ResponseEntity.ok(addresses);
    }

    /**
     * Получение адреса по ID
     * @param id - ID адреса
     * @return Адрес
     */
    @GetMapping("/{id}")
    public ResponseEntity<Address> getAddressById(@PathVariable("id") Long id) {
        try {
            Address address = addressService.getAddressById(id);
            return ResponseEntity.ok(address);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
