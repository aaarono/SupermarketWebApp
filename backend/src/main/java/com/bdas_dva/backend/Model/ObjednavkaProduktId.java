package com.bdas_dva.backend.Model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ObjednavkaProduktId implements Serializable {

    private Long objednavkaId;
    private Long produktId;

    // Геттеры, сеттеры, equals и hashCode

    public Long getObjednavkaId() {
        return objednavkaId;
    }

    public void setObjednavkaId(Long objednavkaId) {
        this.objednavkaId = objednavkaId;
    }

    public Long getProduktId() {
        return produktId;
    }

    public void setProduktId(Long produktId) {
        this.produktId = produktId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        ObjednavkaProduktId that = (ObjednavkaProduktId) o;

        if (!Objects.equals(objednavkaId, that.objednavkaId)) return false;
        return Objects.equals(produktId, that.produktId);
    }

    @Override
    public int hashCode() {
        int result = objednavkaId != null ? objednavkaId.hashCode() : 0;
        result = 31 * result + (produktId != null ? produktId.hashCode() : 0);
        return result;
    }
}
