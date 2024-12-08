package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.*;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataAccessException;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Collections;
/**
 * Služba pro zpracování objednávek a plateb.
 * Všechny operace jsou prováděny v rámci jedné transakce.
 */
@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final JdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    @Autowired
    private ImageService imageService;

    /**
     * Konstruktor pro injektování závislostí.
     *
     * @param jdbcTemplate  JdbcTemplate pro přístup k databázi.
     * @param objectMapper  ObjectMapper pro serializaci objektů do JSON.
     */
    @Autowired
    public OrderService(JdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    /**
     * Метод для создания, обновления или удаления заказа
     *
     * @param operation       Операция (INSERT, UPDATE, DELETE)
     * @param orderData       Данные для заказа в виде Map
     * @return ID созданного заказа для INSERT, или ответ для других операций
     */
    @Transactional
    public Map<String, Object> handleOrderCUD(String operation, Map<String, Object> orderData) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Вызов процедуры proc_objednavka_cud
            Map<String, Object> params = new HashMap<>();
            params.put("p_operation", operation);
            params.put("p_id_objednavky", orderData.get("idObjednavky"));
            params.put("p_datum", orderData.get("datum"));
            params.put("p_status_id", orderData.get("statusId"));
            params.put("p_supermarket_id", orderData.get("supermarketId"));
            params.put("p_zakaznik_id", orderData.get("zakaznikId"));

            // Вызов хранимой процедуры
            jdbcTemplate.call((CallableStatementCreator) conn -> {
                CallableStatement cs = conn.prepareCall("{call proc_objednavka_cud(?, ?, ?, ?, ?, ?)}");
                cs.setString(1, (String) params.get("p_operation"));
                cs.setObject(2, params.get("p_id_objednavky"));
                cs.setObject(3, params.get("p_datum"));
                cs.setObject(4, params.get("p_status_id"));
                cs.setObject(5, params.get("p_supermarket_id"));
                cs.setObject(6, params.get("p_zakaznik_id"));
                return cs;
            }, (List<SqlParameter>) params);

            response.put("message", operation + " operation completed successfully.");
            response.put("id_objednavky", params.get("p_id_objednavky"));
        } catch (DataAccessException e) {
            response.put("message", "Error executing CUD operation: " + e.getMessage());
            e.printStackTrace();
        }
        return response;
    }

    /**
     * Получить всех пользователей из USER_VIEW.
     */
    public List<Map<String, Object>> getAllObjednavky() {
        String query = "SELECT * FROM OBJEDNAVKA";
        return jdbcTemplate.queryForList(query);
    }


    public List<Map<String, Object>> filterOrders(String name, String phone, String email, Long statusId) throws Exception {
        String query = "SELECT * FROM ORDER_DETAILS_VIEW WHERE " +
                "(:name IS NULL OR UPPER(CUSTOMER_NAME) LIKE UPPER('%' || :name || '%')) AND " +
                "(:phone IS NULL OR CUSTOMER_PHONE = :phone) AND " +
                "(:email IS NULL OR UPPER(CUSTOMER_EMAIL) LIKE UPPER('%' || :email || '%')) AND " +
                "(:statusId IS NULL OR STATUS_ID = :statusId)";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("name", name)
                .addValue("phone", phone)
                .addValue("email", email)
                .addValue("statusId", statusId);

        // Используем NamedParameterJdbcTemplate для выполнения запроса и возврата результата в виде списка карт
        return new NamedParameterJdbcTemplate(jdbcTemplate).queryForList(query, params);
    }


    public List<Order> getUserOrders(Long userId, Long zakaznikId) throws Exception {
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_list_user_orders_explicit")
                .returningResultSet("p_orders", (rs, rowNum) -> {
                    Order order = new Order();
                    order.setIdObjednavky(rs.getLong("ID_OBJEDNAVKY"));
                    order.setDatum(rs.getDate("DATUM"));
                    order.setStav(rs.getString("STAV"));
                    order.setMnozstviProduktu(rs.getInt("TOTAL_COST"));
                    order.setZakaznikId(rs.getLong("ZAKAZNIK_ID_ZAKAZNIKU"));

                    Address address = new Address();
                    address.setIdAdresy(rs.getLong("ADRESA_ID_ADRESY"));
                    address.setUlice(rs.getString("ULICE"));
                    address.setCisloPopisne(rs.getString("CISLOPOPISNE"));
                    address.setPsc(rs.getString("PSC"));
                    address.setMesto(rs.getString("MESTO"));
                    order.setAddress(address);

                    Customer customer = new Customer();
                    customer.setJmeno(rs.getString("JMENO"));
                    customer.setPrijmeni(rs.getString("PRIJMENI"));
                    customer.setTelefon(rs.getLong("TELEFON"));
                    order.setCustomer(customer);

                    Payment payment = new Payment();
                    payment.setTyp(rs.getString("TYP"));
                    payment.setSuma(rs.getDouble("TOTAL_COST"));
                    payment.setDatum(rs.getDate("DATUM"));
                    order.setPayment(payment);

                    String productsJson = rs.getString("PRODUCTS");
                    if (productsJson != null) {
                        ObjectMapper objectMapper = new ObjectMapper();
                        List<Product> products = null;
                        try {
                            products = objectMapper.readValue(
                                    productsJson,
                                    new TypeReference<List<Product>>() {}
                            );
                        } catch (JsonProcessingException e) {
                            throw new RuntimeException(e);
                        }
                        order.setProducts(products);
                    }

                    return order;
                });

        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_user_id", userId)
                .addValue("p_zakaznik_id", zakaznikId);

        Map<String, Object> result = jdbcCall.execute(inParams);

        List<Order> orders = (List<Order>) result.get("p_orders");
        return orders != null ? orders : Collections.emptyList();
    }


    /**
     * Vytvoří objednávku a zpracuje platbu.
     * Celý proces je transakční - v případě chyby se všechny změny vrátí zpět.
     *
     * @param orderRequest Data objednávky.
     * @throws Exception V případě chyby při vytváření objednávky nebo zpracování platby.
     */
    @Transactional(rollbackFor = Exception.class)
    public void createOrder(OrderRequest orderRequest) throws Exception {
        try {
            // Převod seznamu produktů do JSON formátu
            String productsJson = objectMapper.writeValueAsString(orderRequest.getProducts());
            logger.info("Produkty v JSON formátu: {}", productsJson);

            // Krok 1: Zpracování objednávky a aktualizace dat zákazníka
            Long orderId = processOrder(orderRequest, productsJson);

            // Krok 2: Zpracování platby
            processPayment(orderRequest, orderId);

            logger.info("Objednávka úspěšně vytvořena. ID objednávky: {}", orderId);
        } catch (DataAccessException dae) {
            // Logování chyby spojené s přístupem k datům a přehazování výjimky pro rollback transakce
            logger.error("DataAccessException při vytváření objednávky: {}", dae.getMessage(), dae);
            throw new Exception("Chyba při vytváření objednávky: " + dae.getMessage(), dae);
        } catch (Exception e) {
            // Logování obecné chyby a přehazování výjimky pro rollback transakce
            logger.error("Exception při vytváření objednávky: {}", e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Zpracuje vytvoření objednávky voláním uložené procedury `proc_process_order`.
     *
     * @param orderRequest Data objednávky.
     * @param productsJson JSON reprezentace seznamu produktů.
     * @return ID vytvořené objednávky.
     * @throws Exception V případě chyby při volání procedury.
     */
    private Long processOrder(OrderRequest orderRequest, String productsJson) throws Exception {
        // Konfigurace volání uložené procedury `proc_process_order`
        SimpleJdbcCall jdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_process_order")
                .declareParameters(
                        new SqlParameter("p_customer_id", Types.NUMERIC),
                        new SqlParameter("p_first_name", Types.VARCHAR),
                        new SqlParameter("p_last_name", Types.VARCHAR),
                        new SqlParameter("p_email", Types.VARCHAR),
                        new SqlParameter("p_new_phone", Types.VARCHAR),
                        new SqlParameter("p_new_street", Types.VARCHAR),
                        new SqlParameter("p_new_street_number", Types.VARCHAR),
                        new SqlParameter("p_new_post_code", Types.VARCHAR),
                        new SqlParameter("p_new_city", Types.VARCHAR),
                        new SqlParameter("p_products_json", Types.CLOB),
                        new SqlOutParameter("p_order_id", Types.NUMERIC)
                );

        // Příprava vstupních parametrů pro proceduru
        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_customer_id", orderRequest.getCustomerId())
                .addValue("p_first_name", orderRequest.getFirstName())
                .addValue("p_last_name", orderRequest.getLastName())
                .addValue("p_email", orderRequest.getEmail())
                .addValue("p_new_phone", orderRequest.getPhone())
                .addValue("p_new_street", orderRequest.getStreet())
                .addValue("p_new_street_number", orderRequest.getStreetNumber())
                .addValue("p_new_post_code", orderRequest.getPostCode())
                .addValue("p_new_city", orderRequest.getCity())
                .addValue("p_products_json", productsJson);

        logger.info("Volání procedury proc_process_order s parametry: customerId={}, firstName={}, lastName={}, email={}, phone={}, street={}, streetNumber={}, postCode={}, city={}, productsJson={}",
                orderRequest.getCustomerId(),
                orderRequest.getFirstName(),
                orderRequest.getLastName(),
                orderRequest.getEmail(),
                orderRequest.getPhone(),
                orderRequest.getStreet(),
                orderRequest.getStreetNumber(),
                orderRequest.getPostCode(),
                orderRequest.getCity(),
                productsJson
        );

        // Volání procedury
        Map<String, Object> out = jdbcCall.execute(inParams);

        // Extrakce ID objednávky z výstupních parametrů
        Number orderIdNumber = (Number) out.get("p_order_id");
        if (orderIdNumber == null) {
            logger.error("Nepodařilo se získat ID objednávky po volání procedury.");
            throw new Exception("Nepodařilo se získat ID objednávky po volání procedury.");
        }

        Long orderId = orderIdNumber.longValue();
        logger.info("Objednávka vytvořena s ID: {}", orderId);
        return orderId;
    }

    /**
     * Zpracuje platbu objednávky voláním uložené procedury `proc_platba_cud` a dalších procedur pro specifické typy platby.
     *
     * @param orderRequest Data objednávky.
     * @param orderId      ID vytvořené objednávky.
     * @throws Exception V případě chyby při zpracování platby.
     */
    private void processPayment(OrderRequest orderRequest, Long orderId) throws Exception {
        // Výpočet celkové částky objednávky
        Double totalAmount = calculateTotalAmount(orderRequest);
        logger.info("Celková částka pro objednávku ID {}: {}", orderId, totalAmount);

        // Volání procedury `proc_platba_cud` pro vložení nové platby
        Long paymentId = insertPayment("INSERT", totalAmount, orderId, orderRequest.getPaymentType());

        // Vkládání detailů platby do odpovídající tabulky na základě typu platby
        switch (orderRequest.getPaymentType().toLowerCase()) {
            case "cash":
                insertCashPayment(paymentId, orderRequest, totalAmount);
                break;
            case "card":
                insertCardPayment(paymentId, orderRequest);
                break;
            case "invoice":
                insertInvoicePayment(paymentId, orderRequest);
                break;
            default:
                logger.error("Neznámý typ platby: {}", orderRequest.getPaymentType());
                throw new Exception("Neznámý typ platby: " + orderRequest.getPaymentType());
        }

        logger.info("Zpracování platby dokončeno úspěšně pro platbu ID: {}", paymentId);
    }

    /**
     * Vloží záznam platby do tabulky `platba` voláním uložené procedury `proc_platba_cud`.
     *
     * @param action      Akce: 'INSERT', 'UPDATE', 'DELETE'.
     * @param totalAmount Částka platby.
     * @param orderId     ID objednávky.
     * @param paymentType Typ platby.
     * @return ID vytvořené platby.
     * @throws Exception V případě chyby při volání procedury.
     */
    private Long insertPayment(String action, Double totalAmount, Long orderId, String paymentType) throws Exception {
        ZonedDateTime currentTime = ZonedDateTime.now();
        System.out.println("Aktuální čas backendu: " + currentTime);

        ZoneId currentZone = ZoneId.systemDefault();
        System.out.println("Časové pásmo backendu: " + currentZone);
        SimpleJdbcCall paymentCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_platba_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlInOutParameter("p_id_platby", Types.NUMERIC),
                        new SqlParameter("p_suma", Types.NUMERIC),
                        new SqlParameter("p_datum", Types.TIMESTAMP),
                        new SqlParameter("p_typ", Types.VARCHAR),
                        new SqlParameter("p_objednavka_id_objednavky", Types.NUMERIC)
                );

        // Použití aktuálního data a času
        Timestamp currentTimestamp = new Timestamp(System.currentTimeMillis() - 1000);

        // Příprava vstupních parametrů
        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_action", action)
                .addValue("p_id_platby", null) // Pro vložení nového záznamu předáváme null
                .addValue("p_suma", totalAmount)
                .addValue("p_datum", currentTimestamp)
                .addValue("p_typ", getPaymentTypeCode(paymentType))
                .addValue("p_objednavka_id_objednavky", orderId);

        logger.info("Volání procedury proc_platba_cud s parametry: action={}, suma={}, datum={}, typ={}, objednavka_id_objednavky={}",
                action, totalAmount, currentTimestamp, getPaymentTypeCode(paymentType), orderId);

        // Volání procedury
        Map<String, Object> out = paymentCall.execute(inParams);

        // Extrakce ID platby z výstupních parametrů
        Number paymentIdNumber = (Number) out.get("p_id_platby");
        if (paymentIdNumber == null) {
            logger.error("Nepodařilo se získat ID platby po volání procedury.");
            throw new Exception("Nepodařilo se získat ID platby po volání procedury.");
        }

        Long paymentId = paymentIdNumber.longValue();
        logger.info("Platba vytvořena s ID: {}", paymentId);
        return paymentId;
    }

    /**
     * Vloží detaily platby v hotovosti voláním uložené procedury `proc_hotovost_cud`.
     *
     * @param paymentId    ID platby.
     * @param orderRequest Data objednávky.
     * @param totalAmount  Částka platby.
     * @throws Exception V případě chyby při volání procedury.
     */
    private void insertCashPayment(Long paymentId, OrderRequest orderRequest, Double totalAmount) throws Exception {
        // Konfigurace volání uložené procedury `proc_hotovost_cud`
        SimpleJdbcCall cashCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_hotovost_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_platby", Types.NUMERIC),
                        new SqlParameter("p_prijato", Types.NUMERIC),
                        new SqlParameter("p_vraceno", Types.NUMERIC)
                );

        // Získání částky přijatých peněz
        Double cashReceived = orderRequest.getCashAmount();
        if (cashReceived == null) {
            logger.error("Částka přijatých hotovosti nemůže být null.");
            throw new Exception("Částka přijatých hotovosti nemůže být null.");
        }

        // Výpočet vrácené změny
        Double change = cashReceived - totalAmount;
        if (change < 0) {
            logger.error("Přijatá částka je menší než celková částka objednávky. Přijato: {}, Celkem: {}", cashReceived, totalAmount);
            throw new Exception("Přijatá částka je menší než celková částka objednávky.");
        }

        // Příprava vstupních parametrů
        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_action", "INSERT")
                .addValue("p_id_platby", paymentId)
                .addValue("p_prijato", cashReceived)
                .addValue("p_vraceno", change);

        logger.info("Volání procedury proc_hotovost_cud s parametry: action=INSERT, id_platby={}, prijato={}, vraceno={}",
                paymentId, cashReceived, change);

        // Volání procedury
        cashCall.execute(inParams);

        logger.info("Platba v hotovosti úspěšně přidána pro platbu ID: {}", paymentId);
    }

    /**
     * Vloží detaily platby kartou voláním uložené procedury `proc_karta_cud`.
     *
     * @param paymentId    ID platby.
     * @param orderRequest Data objednávky.
     * @throws Exception V případě chyby při volání procedury.
     */
    private void insertCardPayment(Long paymentId, OrderRequest orderRequest) throws Exception {
        // Konfigurace volání uložené procedury `proc_karta_cud`
        SimpleJdbcCall cardCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_karta_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_platby", Types.NUMERIC),
                        new SqlParameter("p_cislo_karty", Types.VARCHAR)
                );

        // Získání čísla karty
        String cardNumber = orderRequest.getCardNumber();
        if (cardNumber == null || cardNumber.trim().isEmpty()) {
            logger.error("Číslo karty nemůže být prázdné.");
            throw new Exception("Číslo karty nemůže být prázdné.");
        }

        // Příprava vstupních parametrů
        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_action", "INSERT")
                .addValue("p_id_platby", paymentId)
                .addValue("p_cislo_karty", cardNumber);

        logger.info("Volání procedury proc_karta_cud s parametry: action=INSERT, id_platby={}, cislo_karty={}",
                paymentId, cardNumber);

        // Volání procedury
        cardCall.execute(inParams);

        logger.info("Platba kartou úspěšně přidána pro platbu ID: {}", paymentId);
    }

    /**
     * Vloží detaily platby fakturou voláním uložené procedury `proc_faktura_cud`.
     *
     * @param paymentId    ID platby.
     * @param orderRequest Data objednávky.
     * @throws Exception V případě chyby při volání procedury.
     */
    private void insertInvoicePayment(Long paymentId, OrderRequest orderRequest) throws Exception {
        // Kontrola existence potřebných údajů
        String bankAccountNumber = orderRequest.getBankAccountNumber();
        if (bankAccountNumber == null || bankAccountNumber.trim().isEmpty()) {
            logger.error("Číslo bankovního účtu nemůže být prázdné.");
            throw new Exception("Číslo bankovního účtu nemůže být prázdné.");
        }

        // Výpočet data splatnosti faktury (např. 14 dní od aktuálního data)
        Timestamp dueDate = calculateDueDate();
        logger.info("Vypočítané datum splatnosti faktury: {}", dueDate);

        // Konfigurace volání uložené procedury `proc_faktura_cud`
        SimpleJdbcCall invoiceCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("proc_faktura_cud")
                .declareParameters(
                        new SqlParameter("p_action", Types.VARCHAR),
                        new SqlParameter("p_id_platby", Types.NUMERIC),
                        new SqlParameter("p_cislo_uctu", Types.VARCHAR),
                        new SqlParameter("p_datum_splatnosti", Types.TIMESTAMP)
                );

        // Příprava vstupních parametrů
        MapSqlParameterSource inParams = new MapSqlParameterSource()
                .addValue("p_action", "INSERT")
                .addValue("p_id_platby", paymentId)
                .addValue("p_cislo_uctu", bankAccountNumber)
                .addValue("p_datum_splatnosti", dueDate);

        logger.info("Volání procedury proc_faktura_cud s parametry: action=INSERT, id_platby={}, cislo_uctu={}, datum_splatnosti={}",
                paymentId, bankAccountNumber, dueDate);

        // Volání procedury
        invoiceCall.execute(inParams);

        logger.info("Platba fakturou úspěšně přidána pro platbu ID: {}", paymentId);
    }

    /**
     * Vypočítá datum splatnosti faktury (např. 14 dní od aktuálního data).
     *
     * @return Datum splatnosti faktury jako Timestamp.
     */
    private Timestamp calculateDueDate() {
        java.util.Calendar calendar = java.util.Calendar.getInstance();
        calendar.add(java.util.Calendar.DAY_OF_MONTH, 14); // Přidání 14 dní
        Timestamp dueDate = new Timestamp(calendar.getTimeInMillis());
        logger.info("Vypočítané datum splatnosti: {}", dueDate);
        return dueDate;
    }

    /**
     * Vrátí kód typu platby na základě vstupního řetězce.
     *
     * @param paymentType Typ platby jako řetězec.
     * @return Kód typu platby nebo null, pokud je typ neznámý.
     */
    private String getPaymentTypeCode(String paymentType) {
        if (paymentType == null) {
            logger.warn("Typ platby je null.");
            return null;
        }
        switch (paymentType.toLowerCase()) {
            case "cash":
                return "hp"; // hotovostní platba
            case "card":
                return "cc"; // platba kartou
            case "invoice":
                return "fp"; // faktura
            default:
                logger.warn("Neznámý typ platby: {}", paymentType);
                return null;
        }
    }

    /**
     * Vypočítá celkovou částku objednávky na základě seznamu produktů.
     *
     * @param orderRequest Data objednávky.
     * @return Celková částka objednávky.
     */
    private Double calculateTotalAmount(OrderRequest orderRequest) {
        Double total = orderRequest.getProducts().stream()
                .mapToDouble(p -> p.getPrice() * p.getQuantity())
                .sum();
        logger.info("Vypočítaná celková částka: {}", total);
        return total;
    }

    public List<Product> getProductsByOrderId(Long orderId) {
        String query = "SELECT " +
                "P.ID_PRODUKTU AS id, " +
                "P.NAZEV AS name, " +
                "P.CENA AS price, " +
                "P.POPIS AS description, " +
                "P.KAT_PROD_ID_KATEGORIE AS categoryId, " +
                "P.SKLAD_ID_SKLADU AS skladId, " +
                "(SELECT NAZEV FROM OBRAZEK WHERE PRODUKT_ID_PRODUKTU = P.ID_PRODUKTU AND ROWNUM = 1) AS image, " +
                "OP.QUANTITY AS quantity " +
                "FROM OBJEDNAVKA_PRODUKT OP " +
                "JOIN PRODUKT P ON OP.PRODUKT_ID_PRODUKTU = P.ID_PRODUKTU " +
                "WHERE OP.OBJEDNAVKA_ID_OBJEDNAVKY = ?";

        return jdbcTemplate.query(query, new Object[]{orderId}, (rs, rowNum) -> {
            Product product = new Product();
            product.setId(rs.getLong("id"));
            product.setName(rs.getString("name"));
            product.setPrice(rs.getDouble("price"));
            product.setCategoryId(rs.getLong("categoryId"));
            product.setSkladId(rs.getLong("skladId"));
            product.setImage(rs.getString("image"));
            product.setQuantity(rs.getInt("quantity"));
            return product;
        });
    }
}
