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
import java.time.LocalDateTime;

@Entity
@Table(name = "zone_reviews")
public class ZoneReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "delivery_zone_id", nullable = false)
    private DeliveryZoneEntity deliveryZone;

    @Column(name = "review_status", nullable = false, length = 30)
    private String reviewStatus;

    @Column(name = "review_note", length = 500)
    private String reviewNote;

    @Column(name = "reviewed_by", nullable = false, length = 50)
    private String reviewedBy;

    @Column(name = "reviewed_at", nullable = false)
    private LocalDateTime reviewedAt;

    @Column(name = "result_confidence_score")
    private Integer resultConfidenceScore;

    public ZoneReviewEntity() {
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

    public String getReviewStatus() {
        return reviewStatus;
    }

    public void setReviewStatus(String reviewStatus) {
        this.reviewStatus = reviewStatus;
    }

    public String getReviewNote() {
        return reviewNote;
    }

    public void setReviewNote(String reviewNote) {
        this.reviewNote = reviewNote;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public Integer getResultConfidenceScore() {
        return resultConfidenceScore;
    }

    public void setResultConfidenceScore(Integer resultConfidenceScore) {
        this.resultConfidenceScore = resultConfidenceScore;
    }
}
