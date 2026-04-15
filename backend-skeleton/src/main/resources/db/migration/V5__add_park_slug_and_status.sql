ALTER TABLE parks ADD COLUMN slug VARCHAR(80);
ALTER TABLE parks ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'active';

UPDATE parks
SET slug = id
WHERE slug IS NULL;

CREATE UNIQUE INDEX uk_parks_slug ON parks(slug);
