# Milestone 2 SQL and dataset files #
`./milestone1_data/sample_dataset` contains the dataset that we are using for the app -> we scrape bamboohousing.ca to get sample data <br>
`./milestone1_data/sample_queries_and_data` contains all the output for the sample queries for our 5 features mentioned in the report and also the test-sample.sql which contains all the sql queries for our features <br>
`./server/database/migrations` contains the sql scripts to create the db, create the tables with the proper constraints, create triggers to provide assertion functionality and to drop the db <br>

# Production Dataset for the App #
As of now this is what we are planning to do for the actual datasets to be used in the app:
1. New users and postings will populate the database by filling in details and creating postings.
2. Our scraper script `./server/database/db_pop_sample.js` can be run by following the instructions below. This script will scrape all the paginated postings from https://bamboohousing.ca using https://canadapostalcode.net/ for postal code validation and https://randomuser.me/ for fake user generation.
3. Here are some statistics about the dataset:
    * There are a total of ~100 postings scraped from www.bamboohousing.ca
    * There are ~60 different addresses for those postings.
    * There are ~500 scraped photographs for those postings.

### Instructions for loading the production dataset:
With a fresh db instance (detailed instructions below), you can use the `npm run db_pop_sample.js` script to scrape the real sublet posting data (as desribed in the report).
# Milestone 2 Features implemented #
Features implemented as of now:
1. Login/Signup flow (`http://localhost:3000/`)
2. Create Posting flow (authorized route, so you have to login first) (`http://localhost:3000/CreatePosting`)
3. Index postings with filters and sorting (`http://localhost:3000/Postings`)
4. Index postings with complete sentence searches (`http://localhost:3000/Postings`)
5. Show information for a single posting (`http://localhost:3000/Postings/1`)
6. Supporting images for user postings

### For the features, you can find the corresponding sql queries in these files:
1. `./server/app/models/user.model.js` (contains all user related queries)
2. `./server/app/models/posting.model.js` (contains all posting and address related queries)
3. `./server/app/models/photo.model.js` (contains query for inserting a record into the postingphoto table)


### For the backend endpoint implementations, checkout these files:
1. `./server/app/controllers/user.controller.js`
2. `./server/app/controllers/posting.controller.js`
3. `./server/app/controllers/photo.controller.js`

### And the frontend code exists in these files:
1. `./client/src/components` contains all the different components for the web app.
2. `./client/src/App.js` contains all the routes (private and public) for the app.
### Database config and amazon s3 config files are as follows:
1. MySQL connection: `./server/app/models/db.js`
2. AWS S3 upload to bucket: `./server/app/models/s3.js`

# Getting Started (running the project) #
- Our production database is a MySQL database hosted on an AWS RDS instance, which functions through the user `admin`
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
    2. `npm run db_backup` backs up database instance **OPTIONAL BUT HIGHLY RECOMMENDED**
    2. `npm run db_setup` to get a fresh database instance
    3. `npm run db_migrate_addresses` to migrate Address table from backup database to new database **OPTIONAL BUT HIGHLY RECOMMENDED FOR SCRAPING**
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

# Future work #
## I. Data synthesis plan
1. Generating realistic fake data to increase the size of the prod dataset and load test and optimize performance further.
2. Using this https://thisrentaldoesnotexist.com/ for generating images for the rental apartments.

## II. 

# References #
We used this repository https://github.com/bezkoder/nodejs-express-mysql/tree/d8cef0f9dace78d1a78da58611526e6474cb2a52 for getting the basic project structure and a simple CRUD api for a student data model in the server folder (our backend) for our milestone zero project.
