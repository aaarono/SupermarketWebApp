package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.Address;
import com.bdas_dva.backend.Service.AddressService;
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

    /**
     * Создание нового адреса
     */
    @PostMapping
    public ResponseEntity<String> createAddress(@RequestBody Address address) {
        try {
            addressService.createAddress(
                    address.getUlice(),
                    address.getPsc() != null ? Integer.parseInt(address.getPsc()) : null,
                    address.getMesto(),
                    address.getCisloPopisne() != null ? Integer.parseInt(address.getCisloPopisne()) : null
            );
            return ResponseEntity.ok("Address created successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating address.");
        }
    }

    /**
     * Обновление существующего адреса
     */
    @PutMapping("/{id}")
    public ResponseEntity<String> updateAddress(
            @PathVariable("id") Long id,
            @RequestBody Address address) {
        try {
            addressService.updateAddress(
                    id,
                    address.getUlice(),
                    address.getPsc() != null ? Integer.parseInt(address.getPsc()) : null,
                    address.getMesto(),
                    address.getCisloPopisne() != null ? Integer.parseInt(address.getCisloPopisne()) : null
            );
            return ResponseEntity.ok("Address updated successfully.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error updating address.");
        }
    }

    /**
     * Удаление адреса по ID
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAddress(@PathVariable("id") Long id) {
        try {
            addressService.deleteAddress(id);
            return ResponseEntity.ok("Address deleted successfully.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error deleting address.");
        }
    }
}
