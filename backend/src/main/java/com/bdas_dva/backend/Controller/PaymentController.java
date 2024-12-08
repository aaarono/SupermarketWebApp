package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.bdas_dva.backend.Model.OrderProduct.Platba.Payment;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    // Получение всех платежей
    @GetMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<List<Payment>> getPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return ResponseEntity.ok(payments);
    }

    // Добавление нового платежа
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addPayment(@RequestBody Map<String, Object> paymentDTO) {
        try {
            Double suma = paymentDTO.get("suma") != null ? Double.parseDouble(paymentDTO.get("suma").toString()) : null;
            String datumStr = (String) paymentDTO.get("datum");
            LocalDate datum = null;
            if (datumStr != null && !datumStr.isEmpty()) {
                datum = LocalDate.parse(datumStr, DateTimeFormatter.ISO_DATE);
            }
            String typ = (String) paymentDTO.get("typ");
            Long objednavkaId = paymentDTO.get("objednavkaId") != null ? Long.parseLong(paymentDTO.get("objednavkaId").toString()) : null;

            Long id = paymentService.addPayment(suma, java.sql.Date.valueOf(datum), typ, objednavkaId);
            return ResponseEntity.ok("Платеж успешно добавлен. ID: " + id);
        } catch (DateTimeParseException e) {
            logger.error("Некорректный формат даты: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Некорректный формат даты.");
        } catch (Exception e) {
            logger.error("Ошибка при добавлении платежа: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ошибка при добавлении платежа.");
        }
    }

    // Обновление платежа
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updatePayment(@PathVariable("id") Long id, @RequestBody Map<String, Object> paymentDTO) {
        try {
            Double suma = paymentDTO.get("suma") != null ? Double.parseDouble(paymentDTO.get("suma").toString()) : null;
            String datumStr = (String) paymentDTO.get("datum");
            LocalDate datum = null;
            if (datumStr != null && !datumStr.isEmpty()) {
                datum = LocalDate.parse(datumStr, DateTimeFormatter.ISO_DATE);
            }
            String typ = (String) paymentDTO.get("typ");
            Long objednavkaId = paymentDTO.get("objednavkaId") != null ? Long.parseLong(paymentDTO.get("objednavkaId").toString()) : null;

            paymentService.updatePayment(id, suma, java.sql.Date.valueOf(datum), typ, objednavkaId);
            return ResponseEntity.ok("Платеж успешно обновлен.");
        } catch (DateTimeParseException e) {
            logger.error("Некорректный формат даты: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Некорректный формат даты.");
        } catch (Exception e) {
            logger.error("Ошибка при обновлении платежа: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ошибка при обновлении платежа.");
        }
    }

    // Удаление платежа
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePayment(@PathVariable("id") Long id) {
        try {
            paymentService.deletePayment(id);
            return ResponseEntity.ok("Платеж успешно удален.");
        } catch (Exception e) {
            logger.error("Ошибка при удалении платежа: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка при удалении платежа.");
        }
    }

    /**
     * Фильтрация платежей
     */
    @GetMapping("/filter")
    @PreAuthorize("hasRole('USER') or hasRole('EMPLOYEE') or hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('USER') or hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPaymentById(@PathVariable("id") Long id) {
        try {
            Map<String, Object> payment = paymentService.getPaymentById(id);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
