package com.hangangzip.park.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "delivery_zones")
public class DeliveryZoneEntity {

    @Id
    @Column(name = "id", nullable = false, length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "park_id", nullable = false)
    private ParkEntity park;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "latitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "address", length = 255)
    private String address;

    @Column(name = "source_type", nullable = false, length = 30)
    private String sourceType;

    @Column(name = "verification_status", nullable = false, length = 30)
    private String verificationStatus;

    @Column(name = "source_label", nullable = false, length = 100)
    private String sourceLabel;

    @Column(name = "source_url", nullable = false, length = 500)
    private String sourceUrl;

    @Column(name = "source_checked_at", nullable = false)
    private LocalDate sourceCheckedAt;

    @Column(name = "coordinate_source", nullable = false, length = 30)
    private String coordinateSource;

    @Column(name = "display_policy", nullable = false, length = 30)
    private String displayPolicy;

    @Column(name = "confidence_score", nullable = false)
    private Integer confidenceScore;

    @Column(name = "is_official", nullable = false)
    private Boolean isOfficial;

    public DeliveryZoneEntity() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public ParkEntity getPark() {
        return park;
    }

    public void setPark(ParkEntity park) {
        this.park = park;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getSourceLabel() {
        return sourceLabel;
    }

    public void setSourceLabel(String sourceLabel) {
        this.sourceLabel = sourceLabel;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public LocalDate getSourceCheckedAt() {
        return sourceCheckedAt;
    }

    public void setSourceCheckedAt(LocalDate sourceCheckedAt) {
        this.sourceCheckedAt = sourceCheckedAt;
    }

    public String getCoordinateSource() {
        return coordinateSource;
    }

    public void setCoordinateSource(String coordinateSource) {
        this.coordinateSource = coordinateSource;
    }

    public String getDisplayPolicy() {
        return displayPolicy;
    }

    public void setDisplayPolicy(String displayPolicy) {
        this.displayPolicy = displayPolicy;
    }

    public Integer getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Integer confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public Boolean getIsOfficial() {
        return isOfficial;
    }

    public void setIsOfficial(Boolean isOfficial) {
        this.isOfficial = isOfficial;
    }
}
