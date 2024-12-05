package com.bdas_dva.backend.Controller;

import com.bdas_dva.backend.Model.Zamestnanec;
import com.bdas_dva.backend.Model.ZamestnanecRequest;
import com.bdas_dva.backend.Model.ZamestnanecResponse;
import com.bdas_dva.backend.Model.ZamestnanecUserLinkRequest;
import com.bdas_dva.backend.Model.ZamestnanecRegisterRequest;
import com.bdas_dva.backend.Service.ZamestnanecService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataAccessException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/zamestnanci")
public class ZamestnanecController {

    @Autowired
    private ZamestnanecService zamestnanecService;

    /**
     * Získá seznam zaměstnanců s možností filtrování.
     *
     * @param idZamestnance ID zaměstnance (volitelný).
     * @param jmeno         Jméno zaměstnance (volitelné, částečné shody).
     * @param prijmeni      Příjmení zaměstnance (volitelné, částečné shody).
     * @param supermarketId Supermarket ID (volitelné).
     * @param skladId       Sklad ID (volitelné).
     * @param poziceId      Pozice ID (volitelné).
     * @param managerFlag   Flag pro manažera (1 = ano, 0 = ne, volitelné).
     * @param limit         Limita počtu výsledků (volitelná).
     * @return Seznam zaměstnanců ve formátu JSON.
     */
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getZamestnanci(
            @RequestParam(required = false) Long idZamestnance,
            @RequestParam(required = false) String jmeno,
            @RequestParam(required = false) String prijmeni,
            @RequestParam(required = false) Long supermarketId,
            @RequestParam(required = false) Long skladId,
            @RequestParam(required = false) Long poziceId,
            @RequestParam(required = false) Integer managerFlag,
            @RequestParam(required = false) Integer limit
    ) {
        try {
            ZamestnanecRequest request = new ZamestnanecRequest();
            request.setIdZamestnance(idZamestnance);
            request.setJmeno(jmeno);
            request.setPrijmeni(prijmeni);
            request.setSupermarketIdSupermarketu(supermarketId);
            request.setSkladIdSkladu(skladId);
            request.setPoziceIdPozice(poziceId);
            request.setPracovnidoba(managerFlag); // Použití pracovnidoba pro manager_flag
            request.setPracovnidoba(limit); // Překrytí pracovnidoba s limitem

            List<ZamestnanecResponse> zamestnanci = zamestnanecService.getZamestnanci(request);
            return ResponseEntity.ok(zamestnanci);
        } catch (DataAccessException dae) {
            dae.printStackTrace();
            return ResponseEntity.status(500).body("Databázová chyba při získávání zaměstnanců.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Chyba při získávání zaměstnanců: " + e.getMessage());
        }
    }

    /**
     * Vytvoří nového zaměstnance.
     *
     * @param request Data pro vytvoření zaměstnance.
     * @return Odpověď s potvrzením.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createZamestnanec(@RequestBody ZamestnanecRequest request) {
        try {
            zamestnanecService.createZamestnanec(request);
            return ResponseEntity.ok("Zaměstnanec byl úspěšně vytvořen.");
        } catch (DataAccessException dae) {
            dae.printStackTrace();
            return ResponseEntity.status(500).body("Databázová chyba při vytváření zaměstnance.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Chyba při vytváření zaměstnance: " + e.getMessage());
        }
    }

    /**
     * Aktualizuje existujícího zaměstnance.
     *
     * @param idZamestnance ID zaměstnance k aktualizaci.
     * @param request        Data pro aktualizaci.
     * @return Odpověď s potvrzením.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{idZamestnance}")
    public ResponseEntity<?> updateZamestnanec(
            @PathVariable Long idZamestnance,
            @RequestBody ZamestnanecRequest request
    ) {
        try {
            zamestnanecService.updateZamestnanec(idZamestnance, request);
            return ResponseEntity.ok("Zaměstnanec byl úspěšně aktualizován.");
        } catch (DataAccessException dae) {
            dae.printStackTrace();
            return ResponseEntity.status(500).body("Databázová chyba při aktualizaci zaměstnance.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Chyba při aktualizaci zaměstnance: " + e.getMessage());
        }
    }

    /**
     * Propojí zaměstnance s uživatelským účtem.
     *
     * @param request Data pro propojení.
     * @return Odpověď s potvrzením.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/link")
    public ResponseEntity<?> linkZamestnanecUser(@RequestBody ZamestnanecUserLinkRequest request) {
        try {
            zamestnanecService.linkZamestnanecUser(request);
            return ResponseEntity.ok("Zaměstnanec byl úspěšně propojen s uživatelským účtem.");
        } catch (DataAccessException dae) {
            dae.printStackTrace();
            return ResponseEntity.status(500).body("Databázová chyba při propojení zaměstnance s uživatelem.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Chyba při propojení zaměstnance s uživatelem: " + e.getMessage());
        }
    }

    /**
     * Registruje nového zaměstnance (vytvoří uživatele, zaměstnance a propojí je).
     *
     * @param request Data pro registraci.
     * @return Odpověď s ID uživatele a ID zaměstnance.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/register")
    public ResponseEntity<?> registerZamestnanec(@RequestBody ZamestnanecRegisterRequest request) {
        try {
            Map<String, Long> result = zamestnanecService.registerZamestnanec(request);
            return ResponseEntity.ok(result);
        } catch (DataAccessException dae) {
            dae.printStackTrace();
            return ResponseEntity.status(500).body("Databázová chyba při registraci zaměstnance.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Chyba při registraci zaměstnance: " + e.getMessage());
        }
    }

    /**
     * Получение списка всех позиций (pozice).
     *
     * @return Список позиций.
     */
    @GetMapping("/pozice")
    public ResponseEntity<?> getAllPozice() {
        try {
            List<Map<String, Object>> pozice = zamestnanecService.getAllPozice();
            return ResponseEntity.ok(pozice);
        } catch (DataAccessException dae) {
            dae.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка базы данных при получении списка позиций.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка при получении списка позиций: " + e.getMessage());
        }
    }
}
