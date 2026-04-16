UPDATE park_delivery_zones
SET display_policy = 'limited'
WHERE zone_id = 'gangseo-eco-gate';

UPDATE park_delivery_zones
SET display_policy = 'ops_only'
WHERE zone_id = 'jamsil-eco-garden-gate';

UPDATE delivery_zones
SET
    display_policy = 'limited',
    confidence_score = 45
WHERE id = 'gangseo-eco-gate';

UPDATE delivery_zones
SET
    display_policy = 'ops_only',
    confidence_score = 35
WHERE id = 'jamsil-eco-garden-gate';

UPDATE delivery_zone_evidences
SET evidence_score = 45
WHERE delivery_zone_id = 'gangseo-eco-gate';

UPDATE delivery_zone_evidences
SET evidence_score = 35
WHERE delivery_zone_id = 'jamsil-eco-garden-gate';

UPDATE zone_reviews
SET result_confidence_score = 45
WHERE delivery_zone_id = 'gangseo-eco-gate';

UPDATE zone_reviews
SET result_confidence_score = 35
WHERE delivery_zone_id = 'jamsil-eco-garden-gate';
