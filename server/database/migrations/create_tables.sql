USE honkForSublet;

CREATE TABLE User(
    user_id INTEGER NOT NULL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password CHAR(64), -- SHA-256
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    phone_num VARCHAR(20),
    avatar TEXT
);

CREATE TABLE Posting(
    posting_id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES User(user_id),
    term SET('fall', 'winter', 'spring'),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    pop DECIMAL(6, 2),
    price_per_month DECIMAL(6, 2) NOT NULL,
    gender_details ENUM('male', 'female', 'co-ed'),
    rooms_available TINYINT,
    total_rooms TINYINT,
    description TEXT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE TABLE PostingPhoto(
    posting_photo_id INTEGER NOT NULL PRIMARY KEY,
    posting_id INTEGER NOT NULL REFERENCES Posting(posting_id),
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
    posting_id INTEGER NOT NULL REFERENCES Posting(posting_id),
    address_id INTEGER NOT NULL REFERENCES Address(address_id)
);