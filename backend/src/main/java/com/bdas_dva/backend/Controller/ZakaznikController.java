package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Exception.ResourceNotFoundException;
import com.bdas_dva.backend.Model.Zakaznik;
import com.bdas_dva.backend.Service.ZakaznikService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/zakaznik")
@CrossOrigin(origins = "http://localhost:3000")
public class ZakaznikController {

    @Autowired
    private ZakaznikService zakaznikService;

    /**
     * Получить всех пользователей.
     */
    @GetMapping("/all")
    public List<Map<String, Object>> getAllUsers() {
        return zakaznikService.getAllUsers();
    }

    /**
     * Создание нового заказчика.
     */
    @PostMapping("/create")
    public ResponseEntity<?> createZakaznik(@RequestBody Zakaznik zakaznik) {
        try {
            Long generatedId = zakaznikService.createZakaznik(zakaznik);
            return ResponseEntity.ok("Заказчик успешно создан с ID: " + generatedId);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при создании заказчика: " + e.getMessage());
        }
    }
    @PutMapping("/update")
    public ResponseEntity<?> updateZakaznik(@RequestBody Map<String, Object> requestBody) {
        try {
            Long idZakazniku = Integer.toUnsignedLong((Integer) requestBody.get("ID_ZAKAZNIKU")); // Получаем ID заказчика
            Long telefon = Long.parseLong(requestBody.get("TELEFON").toString()); // Получаем телефон
            Long idAdresy = Integer.toUnsignedLong((Integer)requestBody.get("ID_ADRESY")); // Получаем ID адреса

            Zakaznik zakaznik = new Zakaznik();
            zakaznik.setIdZakazniku(idZakazniku); // Устанавливаем ID заказчика
            zakaznik.setTelefon(telefon); // Устанавливаем телефон
            zakaznik.setAdresaIdAdresy(idAdresy); // Устанавливаем ID адреса

            zakaznikService.updateZakaznik(zakaznik); // Обновляем заказчика
            return ResponseEntity.ok("Заказчик успешно обновлен");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body("Заказчик не найден для обновления: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при обновлении заказчика: " + e.getMessage());
        }
    }
    /**
     * Удаление заказчика.
     */
    @DeleteMapping("/delete/{idZakazniku}")
    public ResponseEntity<?> deleteZakaznik(@PathVariable Long idZakazniku) {
        try {
            zakaznikService.deleteZakaznik(idZakazniku);
            return ResponseEntity.ok("Заказчик успешно удален");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body("Заказчик не найден для удаления: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при удалении заказчика: " + e.getMessage());
        }
    }
}
