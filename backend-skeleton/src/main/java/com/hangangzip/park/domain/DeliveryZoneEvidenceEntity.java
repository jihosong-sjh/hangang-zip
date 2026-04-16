package com.hangangzip.park.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "delivery_zone_evidences")
public class DeliveryZoneEvidenceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "delivery_zone_id", nullable = false)
    private DeliveryZoneEntity deliveryZone;

    @Column(name = "source_type", nullable = false, length = 30)
    private String sourceType;

    @Column(name = "source_label", nullable = false, length = 100)
    private String sourceLabel;

    @Column(name = "source_url", nullable = false, length = 500)
    private String sourceUrl;

    @Column(name = "source_excerpt")
    private String sourceExcerpt;

    @Column(name = "checked_at", nullable = false)
    private LocalDate checkedAt;

    @Column(name = "evidence_score", nullable = false)
    private Integer evidenceScore;

    @Column(name = "is_primary", nullable = false)
    private Boolean isPrimary;

    public DeliveryZoneEvidenceEntity() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public DeliveryZoneEntity getDeliveryZone() {
        return deliveryZone;
    }

    public void setDeliveryZone(DeliveryZoneEntity deliveryZone) {
        this.deliveryZone = deliveryZone;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
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

    public String getSourceExcerpt() {
        return sourceExcerpt;
    }

    public void setSourceExcerpt(String sourceExcerpt) {
        this.sourceExcerpt = sourceExcerpt;
    }

    public LocalDate getCheckedAt() {
        return checkedAt;
    }

    public void setCheckedAt(LocalDate checkedAt) {
        this.checkedAt = checkedAt;
    }

    public Integer getEvidenceScore() {
        return evidenceScore;
    }

    public void setEvidenceScore(Integer evidenceScore) {
        this.evidenceScore = evidenceScore;
    }

    public Boolean getIsPrimary() {
        return isPrimary;
    }

    public void setIsPrimary(Boolean isPrimary) {
        this.isPrimary = isPrimary;
    }
}
