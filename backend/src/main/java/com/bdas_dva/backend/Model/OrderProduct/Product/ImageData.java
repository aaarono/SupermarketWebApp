// ImageData.java
package com.bdas_dva.backend.Model;

import java.sql.Blob;

public class ImageData {
    private String image;
    private String imageType; // e.g., "image/jpeg"

    // Getters and setters
    public String getImage() {
        return image;
    }
    public void setImage(String image) {
        this.image = image;
    }
    public String getImageType() {
        return imageType;
    }
    public void setImageType(String imageType) {
        this.imageType = imageType;
    }
}
