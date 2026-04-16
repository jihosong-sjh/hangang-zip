INSERT INTO delivery_zones (
    id,
    park_id,
    name,
    latitude,
    longitude,
    description,
    address,
    source_type,
    verification_status,
    source_label,
    source_url,
    source_checked_at,
    coordinate_source,
    display_policy,
    confidence_score,
    is_official
)
SELECT
    zone_id,
    park_id,
    name,
    latitude,
    longitude,
    description,
    address,
    source_type,
    verification_status,
    source_label,
    source_url,
    source_checked_at,
    coordinate_source,
    display_policy,
    CASE
        WHEN source_type = 'official' AND verification_status = 'verified' THEN 95
        WHEN source_type = 'community_verified' THEN 75
        WHEN verification_status = 'rejected' THEN 10
        ELSE 45
    END AS confidence_score,
    CASE
        WHEN source_type = 'official' THEN TRUE
        ELSE FALSE
    END AS is_official
FROM park_delivery_zones;
