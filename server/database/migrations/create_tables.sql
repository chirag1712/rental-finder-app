USE honkForSublet;

CREATE TABLE User(
  user_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  password CHAR(64) NOT NULL,
  first_name VARCHAR(20),
  last_name VARCHAR(20),
  phone_num VARCHAR(20),
  avatar TEXT
);

CREATE TABLE Posting(
  posting_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL REFERENCES User(user_id) ON DELETE CASCADE,
  term SET('fall', 'winter', 'spring'),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pop INTEGER,
  price_per_month DECIMAL(6, 2) NOT NULL CONSTRAINT price_positive CHECK(price_per_month >= 0),
  gender_details ENUM('male', 'female', 'co-ed'),
  rooms_available TINYINT CONSTRAINT rooms_positive CHECK(rooms_available >= 0),
  total_rooms TINYINT CONSTRAINT total_rooms_positive CHECK(total_rooms >= 0),
  ac BOOLEAN,
  washrooms TINYINT CONSTRAINT washrooms_positive CHECK(washrooms >= 0),
  wifi BOOLEAN,
  parking BOOLEAN,
  laundry ENUM('ensuite', 'same-floor', 'common','unavailable'),
  description TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  CONSTRAINT rooms_available_less_than_total_rooms CHECK(rooms_available <= total_rooms),
  CONSTRAINT end_date_after_start_date CHECK(end_date >= start_date),
  CONSTRAINT updated_at_after_created_at CHECK(updated_at >= created_at)
) DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE PostingPhoto(
  photo_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  posting_id INTEGER NOT NULL REFERENCES Posting(posting_id) ON DELETE SET NULL,
  url TEXT NOT NULL
);

CREATE TABLE Address(
  address_id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  city VARCHAR(20) NOT NULL,
  street_name VARCHAR(20) NOT NULL,
  street_num SMALLINT NOT NULL,
  postal_code CHAR(6) NOT NULL,
  building_name VARCHAR(20)
);

CREATE TABLE AddressOf(
  posting_id INTEGER NOT NULL REFERENCES Posting(posting_id) ON DELETE CASCADE,
  address_id INTEGER NOT NULL REFERENCES Address(address_id) ON DELETE CASCADE,
  PRIMARY KEY(posting_id, address_id)
);
