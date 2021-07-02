# Milestone 1 SQL and dataset files #
`./milestone1_data/sample_dataset` contains the dataset that we are using for the app -> we scrape bamboohousing.ca to get sample data <br>
`./milestone1_data/sample_queries_and_data` contains all the output for the sample queries for our 5 features mentioned in the report and also the test-sample.sql which contains all the sql queries for our features <br>
`./server/database/migrations` contains the sql scripts to create the db, create the tables with the proper constraints, create triggers to provide assertion functionality and to drop the db <br>

# Datasets for the App #
As of now this is what we are planning to do for the actual datasets to be used in the app:
1. Using this https://thisrentaldoesnotexist.com/ for generating images for the rental apartments
2. Using this https://thispersondoesnotexist.com for generating profile images for the subtenants
3. New users and postings will populate the database by filling in details and creating postings
4. We have a scraper for getting a sample dataset (`./server/database/db_pop_sample.js`), a WIP scraper to get sample rental images and down the line we also plan to have a generative script to generate realistic data for sublet postings.

# Getting Started #
- Our production database is an AWS RDS instance, which functions through user `admin`
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
4. `cd server` and set up your local database in 2 ways:
  - TIP: to point to local mysql db, set `NODE_ENV` to `dev` and to point to RDS just set it to `prod`. Example:
  `NODE_ENV=dev` or `NODE_ENV=prod` in your `server/.env`
  - ## Sync with production database in RDS **(WILL OVERWRITE DATA)** ##
    1. Set database credentials in `.env` to point to RDS instance
    2. `npm run db_dump <file_path>` to store database dump at `<file_path>` (recommend file name ends in `dump.sql` so that it can be gitignored)
    3. Set database credentials in `.env` to point to local instance
    4. `npm run db_import <file_path>` to import database dump **(MAKE SURE YOU'RE NOT POINTING AT RDS)**
  - ## Fresh local database instance **(WILL DELETE DATA)** ##
    1. Set database credentials in `.env` to point to local instance **(MAKE SURE YOU'RE NOT POINTING AT RDS)**
    2. `npm run db_setup` to get a fresh database instance
    3. `npm run db_pop_sample` to populate the database with scraped sample data
  - ## Lastly, you can execute any SQL script via
    ```
    mysql -h <HOSTNAME> -u <USER> -p < <sql_file>
    ```
    ## or ##
    ```
    npm run db_exec <sql_file>
    ```

3. Install dependencies by running the following in the project root:
`cd server && npm i` <br>
`cd client && npm i`

4. Launch the app by running the following from the server directory:
`npm run dev`

# References #
We used this repository https://github.com/bezkoder/nodejs-express-mysql/tree/d8cef0f9dace78d1a78da58611526e6474cb2a52 for getting the basic project structure and a simple CRUD api for a student data model in the server folder (our backend) for our milestone zero project.
