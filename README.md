# HonkForSublet - Rental Finder App
This proejct is a sublet finder application where tenants and potential subtenants can easily find each other through user friendly filters to find their perfect match! The targetted users of our application are students in the KW region who attend the University of Waterloo and Wilfrid Laurier University. Users will be able to create their own accounts to upload postings, view postings, as well as search by keywords, filter by term, rooms, and gender to sort through available sublets that are currently in the system!
# Supported Functionality
1. Secure Login/Signup flow using state-of-hart salting and hashing using `bcrypt`
2. Creating multimedia postings for authorized users
3. Index postings with intuitive filtering and sorting capibilities
4. Index postings with complete sentence searches based on score based text matching
5. Show information for a single posting and supporting images for user postings using AWS S3

# Sample dataset for the App
We support scraping of all the paginated postings from https://bamboohousing.ca using https://canadapostalcode.net/ for postal code validation and https://randomuser.me/ for user generation.

Here are some statistics about the dataset:
  * There are a total of ~100 postings scraped from www.bamboohousing.ca
  * There are ~60 different addresses for those postings.
  * There are ~500 scraped photographs for those postings.

### Instructions for loading the sample dataset:
With a fresh db instance (detailed instructions below), you can use the `npm run db_pop_sample.js` script to scrape the real sublet posting data (as desribed in the report).
### Backend endpoints can be found in these files:
1. `./server/app/controllers/user.controller.js`
2. `./server/app/controllers/posting.controller.js`
3. `./server/app/controllers/photo.controller.js`

### Frontend code exists in these files:
1. `./client/src/components` contains all the different components for the web app.
2. `./client/src/App.js` contains all the routes (private and public) for the app.
### Database config and amazon s3 config files are as follows:
1. MySQL connection: `./server/app/models/db.js`
2. AWS S3 upload to bucket: `./server/app/models/s3.js`

# Getting Started (setting up the project)
- Our production database uses MySQL & is hosted on an AWS RDS instance, which functions through the user `admin`
- `admin` is a super user which allows them to create triggers
1. Install MySQL locally and run sql:
  ```sql
  CREATE USER 'admin'@'%' IDENTIFIED BY 'rds_password_here'
  ```
2. Make `admin` a super user by running:
  ```sql
  GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%';
  FLUSH PRIVILEGES;
  ```
3. Use `server/.sample-env` file as a template to create your own `server/.env` file
4. Install dependencies by running the following in the project root: `cd server && npm i` and `cd client && npm i`
5. Setting up the db - `cd server` and you can set up your local database in 2 ways:
  - FYI: to point to the local mysql db you need to set `NODE_ENV` to `dev` and to point to RDS just set it to `prod` in the `server/.env` (`NODE_ENV=dev` or `NODE_ENV=prod` in your `server/.env`)
### Option I. Sync with production database in RDS (WILL OVERWRITE DATA)
1. Set database credentials in `.env` to point to RDS instance
2. `npm run db_dump <file_path>` to store database dump at `<file_path>` (recommend file name ends in `dump.sql` so that it can be gitignored)
3. Set database credentials in `.env` to point to local instance
4. `npm run db_import <file_path>` to import database dump 
**(MAKE SURE YOU'RE NOT POINTING AT RDS)**
### Option 2. Fresh local database instance (WILL DELETE LOCAL DATA)
1. Set database credentials in `.env` to point to local instance 
**(MAKE SURE YOU'RE NOT POINTING AT RDS)**
2. (__optional__, but **highly recommended**) `npm run db_backup` to back up local database instance
3. `npm run db_setup` to get a fresh database instance
4. (__optional__, but **highly recommended**) `npm run db_migrate_addresses` to migrate `Address` table from the backup database to new database
5. (__optional__) `npm run db_pop_sample` to populate the database with scraped sample data

# Launching the app
Run the following `npm run dev` from the `server` directory to launch the backend and the frontend for the app.

# (Extra) Running custom SQL scripts
You can run any SQL script using one of these two ways:
```bash
mysql -h <HOSTNAME> -u <USER> -p < <sql_file>
# or
npm run db_exec <sql_file>
```
# References
Used this repository: https://github.com/bezkoder/nodejs-express-mysql/tree/d8cef0f9dace78d1a78da58611526e6474cb2a52 to set the project structure and a simple CRUD api.
