package com.bdas_dva.backend.Model;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ProduktDodavatelId implements Serializable {

    private Long dodavatelId;
    private Long produktId;

    // Геттеры, сеттеры, equals и hashCode

    public Long getDodavatelId() {
        return dodavatelId;
    }

    public void setDodavatelId(Long dodavatelId) {
        this.dodavatelId = dodavatelId;
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

        ProduktDodavatelId that = (ProduktDodavatelId) o;

        if (!Objects.equals(dodavatelId, that.dodavatelId)) return false;
        return Objects.equals(produktId, that.produktId);
    }

    @Override
    public int hashCode() {
        int result = dodavatelId != null ? dodavatelId.hashCode() : 0;
        result = 31 * result + (produktId != null ? produktId.hashCode() : 0);
        return result;
    }
}
