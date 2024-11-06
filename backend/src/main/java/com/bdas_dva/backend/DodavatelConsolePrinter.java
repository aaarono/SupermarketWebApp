package com.bdas_dva.backend;

import com.bdas_dva.backend.Service.DodavatelService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
public class DodavatelConsolePrinter {

    private final DodavatelService dodavatelService;

    public DodavatelConsolePrinter(DodavatelService dodavatelService) {
        this.dodavatelService = dodavatelService;
    }

    @Bean
    public CommandLineRunner printDodavatele() {
        return args -> {
            dodavatelService.getAllDodavatele().forEach(dodavatel ->
                    System.out.println("ID: " + dodavatel.getIdDodavatele() +
                            ", Název: " + dodavatel.getNazev() +
                            ", Kontaktní osoba: " + dodavatel.getKontaktniOsoba() +
                            ", Telefon: " + dodavatel.getTelefon() +
                            ", Email: " + dodavatel.getEmail()));
        };
    }
}
