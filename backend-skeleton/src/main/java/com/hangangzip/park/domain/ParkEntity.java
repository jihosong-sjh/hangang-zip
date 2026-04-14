package com.hangangzip.park.domain;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "parks")
public class ParkEntity {

    @Id
    @Column(name = "id", nullable = false, length = 50)
    private String id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "latitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false, precision = 10, scale = 7)
    private BigDecimal longitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "primary_tag", nullable = false, length = 30)
    private ParkTag primaryTag;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "running_score", nullable = false)
    private Integer runningScore;

    @Column(name = "picnic_score", nullable = false)
    private Integer picnicScore;

    @Column(name = "quiet_score", nullable = false)
    private Integer quietScore;

    @Column(name = "night_score", nullable = false)
    private Integer nightScore;

    @Column(name = "family_score", nullable = false)
    private Integer familyScore;

    @Column(name = "recommendation", nullable = false, length = 255)
    private String recommendation;

    @ElementCollection(targetClass = ParkTag.class)
    @CollectionTable(name = "park_tags", joinColumns = @JoinColumn(name = "park_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "tag", nullable = false, length = 30)
    private Set<ParkTag> tags = new LinkedHashSet<>();

    @ElementCollection(targetClass = AmenityType.class)
    @CollectionTable(name = "park_amenities", joinColumns = @JoinColumn(name = "park_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "amenity_type", nullable = false, length = 50)
    private Set<AmenityType> amenities = new LinkedHashSet<>();

    @ElementCollection
    @CollectionTable(name = "park_delivery_zones", joinColumns = @JoinColumn(name = "park_id"))
    private Set<ParkDeliveryZoneEmbeddable> deliveryZones = new LinkedHashSet<>();

    public ParkEntity() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public ParkTag getPrimaryTag() {
        return primaryTag;
    }

    public void setPrimaryTag(ParkTag primaryTag) {
        this.primaryTag = primaryTag;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getRunningScore() {
        return runningScore;
    }

    public void setRunningScore(Integer runningScore) {
        this.runningScore = runningScore;
    }

    public Integer getPicnicScore() {
        return picnicScore;
    }

    public void setPicnicScore(Integer picnicScore) {
        this.picnicScore = picnicScore;
    }

    public Integer getQuietScore() {
        return quietScore;
    }

    public void setQuietScore(Integer quietScore) {
        this.quietScore = quietScore;
    }

    public Integer getNightScore() {
        return nightScore;
    }

    public void setNightScore(Integer nightScore) {
        this.nightScore = nightScore;
    }

    public Integer getFamilyScore() {
        return familyScore;
    }

    public void setFamilyScore(Integer familyScore) {
        this.familyScore = familyScore;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    public Set<ParkTag> getTags() {
        return tags;
    }

    public void setTags(Set<ParkTag> tags) {
        this.tags = tags;
    }

    public Set<AmenityType> getAmenities() {
        return amenities;
    }

    public void setAmenities(Set<AmenityType> amenities) {
        this.amenities = amenities;
    }

    public Set<ParkDeliveryZoneEmbeddable> getDeliveryZones() {
        return deliveryZones;
    }

    public void setDeliveryZones(Set<ParkDeliveryZoneEmbeddable> deliveryZones) {
        this.deliveryZones = deliveryZones;
    }
}
