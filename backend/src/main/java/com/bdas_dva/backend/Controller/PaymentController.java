package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    /**
     * Получение всех платежей
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllPayments() {
        List<Map<String, Object>> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    /**
     * Фильтрация платежей
     */
    @GetMapping("/filter")
    public ResponseEntity<List<Map<String, Object>>> getPaymentsByFilters(
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "minAmount", required = false) Double minAmount,
            @RequestParam(value = "maxAmount", required = false) Double maxAmount
    ) {
        List<Map<String, Object>> payments = paymentService.getPaymentsByFilters(type, date, minAmount, maxAmount);
        return ResponseEntity.ok(payments);
    }

    /**
     * Получение платежа по ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getPaymentById(@PathVariable("id") Long id) {
        try {
            Map<String, Object> payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
