USE honkForSublet;

-- Feature 1: Create User / Simple Login
--For checking if a user exists or not:
SELECT * 
FROM User 
WHERE email = 'phoebe.cooper@uwaterloo.ca';

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
WHERE street_num = '330' AND postal_code = 'N6F5P6';

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
description = 'nice place to live',
created_at = '2021-06-14 22:40:23',
updated_at = '2021-06-14 22:40:23';

-- To insert into the AddressOf table in the DB
INSERT INTO AddressOf SET 
posting_id = 1,
user_id = 1;


-- Feature 3: Show posting
--For fetching a single posting:
SELECT p.*, a.*, ph.photo_id, ph.url
FROM Posting AS p
NATURAL JOIN AddressOf AS ao
NATURAL JOIN Address AS a
LEFT OUTER JOIN PostingPhoto AS ph
ON p.posting_id = ph.posting_id
NATURAL JOIN User AS u
WHERE p.posting_id = 1;

--For fetching all postings from a user:
SELECT p.*, a.*, ph.photo_id, ph.url
FROM Posting AS p
NATURAL JOIN AddressOf AS ao
NATURAL JOIN Address AS a
LEFT OUTER JOIN PostingPhoto AS ph
ON p.posting_id = ph.posting_id
NATURAL JOIN User AS u
WHERE p.user_id = 1;


-- Feature 4: Search Posting
--search posting using a keyword
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


-- Feature 5: Filter/Sort posting
-- filter by term
SELECT p.*, a.*, ph.photo_id, ph.url
FROM Posting AS p
NATURAL JOIN AddressOf AS ao
NATURAL JOIN Address AS a
LEFT OUTER JOIN PostingPhoto AS ph
ON p.posting_id = ph.posting_id
WHERE term LIKE '%winter%' 
LIMIT 10;

-- sort by created_at
SELECT p.*, a.*, ph.photo_id, ph.url
FROM Posting AS p
NATURAL JOIN AddressOf AS ao
NATURAL JOIN Address AS a
LEFT OUTER JOIN PostingPhoto AS ph
ON p.posting_id = ph.posting_id 
ORDER BY created_at DESC
LIMIT 10;

-- sort and filter combined
SELECT p.*, a.*, ph.photo_id, ph.url
FROM Posting AS p
NATURAL JOIN AddressOf AS ao
NATURAL JOIN Address AS a
LEFT OUTER JOIN PostingPhoto AS ph
ON p.posting_id = ph.posting_id 
WHERE term LIKE '%winter%' OR term LIKE '%spring%' 
ORDER BY price_per_month 
LIMIT 10;

