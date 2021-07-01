USE honkForSublet;

CREATE FULLTEXT INDEX description
ON Posting(description);

CREATE FULLTEXT INDEX address
on Address(street_name, building_name);
