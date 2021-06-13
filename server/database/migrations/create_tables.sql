USE honkForSublet;

CREATE TABLE User(
    user_id INTEGER NOT NULL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password CHAR(64) NOT NULL, -- SHA-256
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    phone_num VARCHAR(20),
    avatar TEXT
);

CREATE TABLE Posting(
    posting_id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES User(user_id) ON DELETE CASCADE,
    term SET('fall', 'winter', 'spring'),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pop INTEGER,
    price_per_month SMALLINT NOT NULL,
    gender_details ENUM('male', 'female', 'co-ed'),
    rooms_available TINYINT,
    total_rooms TINYINT,
    description TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE TABLE PostingPhoto(
    photo_id INTEGER NOT NULL PRIMARY KEY,
    posting_id INTEGER NOT NULL REFERENCES Posting(posting_id) ON DELETE SET NULL,
    url TEXT NOT NULL
);

CREATE TABLE Address(
    address_id INTEGER NOT NULL PRIMARY KEY,
    city VARCHAR(20) NOT NULL,
    street_name VARCHAR(20) NOT NULL,
    street_num SMALLINT NOT NULL,
    postal_code CHAR(6) NOT NULL UNIQUE,
    building_name VARCHAR(20)
);

CREATE TABLE AddressOf(
    posting_id INTEGER NOT NULL REFERENCES Posting(posting_id) ON DELETE CASCADE,
    address_id INTEGER NOT NULL REFERENCES Address(address_id) ON DELETE CASCADE,
    PRIMARY KEY(posting_id, address_id)
);

DELIMITER //
CREATE TRIGGER UserPostingUpperBound BEFORE INSERT ON Posting
FOR EACH ROW
BEGIN
    IF
        (SELECT COUNT(*)
        FROM Posting AS p
        WHERE p.user_id = NEW.user_id) >= 3
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Exceeded number of postings per user (3)';
    END IF;
END;//
DELIMITER ;

DELIMITER //
CREATE TRIGGER PostingPhotoUpperBound BEFORE INSERT ON PostingPhoto
FOR EACH ROW
BEGIN
    IF
        (SELECT COUNT(*)
        FROM PostingPhoto AS ph
        WHERE ph.posting_id = NEW.posting_id) >= 10
    THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Exceeded number of photos per posting (10)';
    END IF;
END;//
DELIMITER ;