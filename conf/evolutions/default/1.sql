# --- !Downs
DROP TABLE IF EXISTS mobile_food_facility;
DROP TYPE IF EXISTS facility_type;
DROP TYPE IF EXISTS permit_status;
# --- !Ups
CREATE TYPE facility_type AS ENUM ('Push Cart', 'Truck');
CREATE TYPE permit_status AS ENUM ('APPROVED', 'REQUESTED', 'POSTAPPROVED','EXPIRED', 'ONHOLD', 'SUSPEND');
CREATE TABLE mobile_food_facility (
    location_id BIGINT PRIMARY KEY,
    applicant VARCHAR NOT NULL,
    facility_type facility_type,
    location_description VARCHAR NOT NULL,
    address VARCHAR,
    permit_id VARCHAR NOT NULL,
    permit_status permit_status NOT NULL,
    food_items varchar,
    location GEOMETRY(POINT,4326)
);