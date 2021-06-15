USE honkForSublet;

-- Feature 1:
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

-- Feature 2:
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



-- Feature 3:
-- Get posting with posting_id 1
SELECT * FROM Posting WHERE posting_id = 1;
-- Get posting photos of posting_id 1
SELECT * FROM PostingPhoto WHERE posting_id = 1; 

-- Feature 4:

-- Feature 5:
