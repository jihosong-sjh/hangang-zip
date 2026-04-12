CREATE TABLE parks (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    primary_tag VARCHAR(30) NOT NULL,
    description TEXT NOT NULL,
    running_score INTEGER NOT NULL,
    picnic_score INTEGER NOT NULL,
    quiet_score INTEGER NOT NULL,
    night_score INTEGER NOT NULL,
    family_score INTEGER NOT NULL,
    recommendation VARCHAR(255) NOT NULL
);

CREATE TABLE park_tags (
    park_id VARCHAR(50) NOT NULL,
    tag VARCHAR(30) NOT NULL,
    CONSTRAINT fk_park_tags_park
        FOREIGN KEY (park_id) REFERENCES parks(id),
    CONSTRAINT uk_park_tags UNIQUE (park_id, tag)
);

CREATE TABLE park_amenities (
    park_id VARCHAR(50) NOT NULL,
    amenity_type VARCHAR(50) NOT NULL,
    CONSTRAINT fk_park_amenities_park
        FOREIGN KEY (park_id) REFERENCES parks(id),
    CONSTRAINT uk_park_amenities UNIQUE (park_id, amenity_type)
);

CREATE INDEX idx_park_tags_tag ON park_tags(tag);
CREATE INDEX idx_park_amenities_type ON park_amenities(amenity_type);
