USE honkForSublet;

-- Feature 1: Create User / Simple Login
--For checking if a user exists or not:
SELECT * 
FROM User 
WHERE email = 'john.miller@uwaterloo.ca';

--For signup if user does not exist:
INSERT INTO User SET
email = 'bob@uwaterloo.ca',
password = '<encrypted_password_here>',
first_name = 'bob',
last_name = 'jones';


-- Feature 2: Create Posting
-- To check if an address already exists in the DB
SELECT * 
FROM Address 
WHERE street_num = '64' AND postal_code = 'N2J2T4';

-- To insert an address into the DB
INSERT INTO Address SET 
city = 'Waterloo',
street_name = 'Albert Street',
street_num = 392,
postal_code = 'N2L3V1';

-- To insert into the Posting Table
INSERT INTO Posting SET
user_id = 1,
term = 'fall',
start_date = '2021-09-03',
end_date = '2021-12-31',
pop = 0,
price_per_month = '500',
gender_details = 'male',
rooms_available = '4',
total_rooms = '5',
ac = true,
wifi = true,
parking = false,
washrooms = '1',
laundry = 'common',
description = 'nice place to live',
created_at = '2021-06-14 22:40:23',
updated_at = '2021-06-14 22:40:23';

-- To insert into the AddressOf table in the DB
INSERT INTO AddressOf SET 
posting_id = 1,
address_id = 1;


-- Feature 3: Show posting
-- For fetching a single posting with id 1:
SELECT p.*, a.*
FROM Posting AS p
NATURAL JOIN AddressOf AS ao
NATURAL JOIN Address AS a
NATURAL JOIN User AS u
WHERE p.posting_id = 1;


-- For fetching all postings from a user with id 1:
SELECT p.*, a.*
FROM Posting AS p
NATURAL JOIN AddressOf AS ao
NATURAL JOIN Address AS a
NATURAL JOIN User AS u
WHERE p.user_id = 1;

-- Fetching all the photos of a posting with id 2:
SELECT *
FROM PostingPhoto
WHERE posting_id = 2;

-- Feature 4: Search Posting
-- Option 1: search posting using regex patterns
SELECT p.*, a.*, ph.photo_id, ph.url
FROM Posting AS p
NATURAL JOIN AddressOf AS ao
NATURAL JOIN Address AS a
LEFT OUTER JOIN PostingPhoto AS ph
ON p.posting_id = ph.posting_id
WHERE description LIKE '%hydro included%'
OR description LIKE '%parking%'
OR description LIKE '%ensuite%'
LIMIT 10;

-- Option 2 Using fulltext indexes and the SQL MATCH function to do full sentence searches
SELECT 
    posting_id AS id, 
    price_per_month AS price, 
    CONCAT(street_num, " ", street_name, ", ", city) AS address
FROM Posting 
    NATURAL JOIN AddressOf 
    NATURAL JOIN Address
WHERE 
    MATCH (description) AGAINST('RezOne') OR
    MATCH(street_num, street_name, building_name) AGAINST('RezOne')
ORDER BY updated_at DESC
LIMIT 40, 21;

-- Feature 5: Filter/Sort posting
-- filter by term is 'fall', rooms available are 5
--for the page 1
SELECT posting_id AS id, price_per_month AS price, CONCAT(street_num, " ", street_name, ", ",city) AS address
FROM Posting 
NATURAL JOIN AddressOf 
NATURAL JOIN Address
WHERE FIND_IN_SET('fall', term) > 0 AND rooms_available = 5
ORDER BY updated_at DESC
LIMIT 0, 21;


-- sort by popularity
-- for the page 2 as the offeset is 20
SELECT posting_id AS id, price_per_month AS price, CONCAT(street_num, " ", street_name, ", ",city) AS address
FROM Posting 
NATURAL JOIN AddressOf 
NATURAL JOIN Address
ORDER BY pop DESC, updated_at DESC
LIMIT 20, 21;

-- sort and filter combined
-- for the page 1
SELECT posting_id AS id, price_per_month AS price, CONCAT(street_num, " ", street_name, ", ",city) AS address
FROM Posting 
NATURAL JOIN AddressOf 
NATURAL JOIN Address
WHERE FIND_IN_SET('winter', term) > 0 AND rooms_available = 5 AND gender_details = 'co-ed'
ORDER BY price_per_month ASC, updated_at DESC
LIMIT 0, 21;


-- sort by created_at
SELECT p.*, a.*, ph.photo_id, ph.url
FROM Posting AS p
NATURAL JOIN AddressOf AS ao
NATURAL JOIN Address AS a
LEFT OUTER JOIN PostingPhoto AS ph
ON p.posting_id = ph.posting_id 
ORDER BY created_at DESC
LIMIT 10;


-- Feature 6: Posting photos
-- Upload PostingPhoto for a posting
INSERT INTO PostingPhoto SET
posting_id = 1,
url = "https://s3-us-east-2.amazonaws.com/cs348-sublet-content/posting_124_2021-07-05T22:01:54.290Z_image_2.jpg";

-- Getting photo URLs for a posting
SELECT url FROM PostingPhoto WHERE posting_id = 1;


