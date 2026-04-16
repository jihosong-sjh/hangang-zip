INSERT INTO delivery_zone_evidences (
    delivery_zone_id,
    source_type,
    source_label,
    source_url,
    source_excerpt,
    checked_at,
    evidence_score,
    is_primary
)
SELECT
    zone_id,
    source_type,
    source_label,
    source_url,
    NULL AS source_excerpt,
    source_checked_at,
    CASE
        WHEN source_type = 'official' AND verification_status = 'verified' THEN 95
        WHEN source_type = 'community_verified' THEN 75
        WHEN verification_status = 'rejected' THEN 10
        ELSE 45
    END AS evidence_score,
    TRUE AS is_primary
FROM park_delivery_zones;
