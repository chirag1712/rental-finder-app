USE honkForSublet;

CREATE FULLTEXT INDEX description
ON Posting(description);

CREATE FULLTEXT INDEX address
ON Address(street_num, street_name, building_name);

CREATE INDEX update_date
ON Posting(updated_at DESC);

CREATE INDEX popularity
ON Posting(pop DESC, updated_at DESC);

CREATE INDEX price
ON Posting(price_per_month ASC, updated_at DESC);

CREATE INDEX rooms
ON Posting(rooms_available);

CREATE INDEX gender
ON Posting(gender_details);
