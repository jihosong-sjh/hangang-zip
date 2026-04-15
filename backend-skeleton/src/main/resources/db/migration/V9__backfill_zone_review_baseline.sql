INSERT INTO zone_reviews (
    delivery_zone_id,
    review_status,
    review_note,
    reviewed_by,
    reviewed_at,
    result_confidence_score
)
SELECT
    zone_id,
    CASE
        WHEN verification_status = 'verified' THEN 'approved'
        WHEN verification_status = 'rejected' THEN 'rejected'
        ELSE 'pending'
    END AS review_status,
    'Migrated from legacy park_delivery_zones metadata' AS review_note,
    'system_migration' AS reviewed_by,
    CURRENT_TIMESTAMP AS reviewed_at,
    CASE
        WHEN source_type = 'official' AND verification_status = 'verified' THEN 95
        WHEN source_type = 'community_verified' THEN 75
        WHEN verification_status = 'rejected' THEN 10
        ELSE 45
    END AS result_confidence_score
FROM park_delivery_zones;
