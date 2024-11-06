package com.bdas_dva.backend.Service;

import com.bdas_dva.backend.Model.Sklad;
import java.util.List;

public interface ISkladService {
    Sklad createSklad(Sklad sklad);
    Sklad getSkladById(Long id);
    List<Sklad> getAllSklads();
    Sklad updateSklad(Long id, Sklad skladDetails);
    void deleteSklad(Long id);
}
