CREATE TABLE delivery_zones (
    id VARCHAR(50) PRIMARY KEY,
    park_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    description VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    source_type VARCHAR(30) NOT NULL,
    verification_status VARCHAR(30) NOT NULL,
    source_label VARCHAR(100) NOT NULL,
    source_url VARCHAR(500) NOT NULL,
    source_checked_at DATE NOT NULL,
    coordinate_source VARCHAR(30) NOT NULL,
    display_policy VARCHAR(30) NOT NULL,
    confidence_score INTEGER NOT NULL,
    is_official BOOLEAN NOT NULL,
    CONSTRAINT fk_delivery_zones_park
        FOREIGN KEY (park_id) REFERENCES parks(id)
);

CREATE INDEX idx_delivery_zones_park ON delivery_zones(park_id);
CREATE INDEX idx_delivery_zones_visibility ON delivery_zones(park_id, display_policy, verification_status);
CREATE INDEX idx_delivery_zones_source ON delivery_zones(source_type, verification_status);

CREATE TABLE delivery_zone_evidences (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    delivery_zone_id VARCHAR(50) NOT NULL,
    source_type VARCHAR(30) NOT NULL,
    source_label VARCHAR(100) NOT NULL,
    source_url VARCHAR(500) NOT NULL,
    source_excerpt TEXT,
    checked_at DATE NOT NULL,
    evidence_score INTEGER NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_delivery_zone_evidences_zone
        FOREIGN KEY (delivery_zone_id) REFERENCES delivery_zones(id)
);

CREATE INDEX idx_delivery_zone_evidences_zone ON delivery_zone_evidences(delivery_zone_id, is_primary);
CREATE INDEX idx_delivery_zone_evidences_checked_at ON delivery_zone_evidences(delivery_zone_id, checked_at);

CREATE TABLE zone_reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    delivery_zone_id VARCHAR(50) NOT NULL,
    review_status VARCHAR(30) NOT NULL,
    review_note VARCHAR(500),
    reviewed_by VARCHAR(50) NOT NULL,
    reviewed_at TIMESTAMP NOT NULL,
    result_confidence_score INTEGER,
    CONSTRAINT fk_zone_reviews_zone
        FOREIGN KEY (delivery_zone_id) REFERENCES delivery_zones(id)
);

CREATE INDEX idx_zone_reviews_zone ON zone_reviews(delivery_zone_id, reviewed_at);

CREATE TABLE park_access_points (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    park_id VARCHAR(50) NOT NULL,
    type VARCHAR(30) NOT NULL,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    address VARCHAR(255),
    note VARCHAR(255),
    CONSTRAINT fk_park_access_points_park
        FOREIGN KEY (park_id) REFERENCES parks(id)
);

CREATE INDEX idx_park_access_points_park ON park_access_points(park_id);
