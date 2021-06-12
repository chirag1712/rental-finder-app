# For the sake of this demo we will be using table "student" to perform simple crud functionality to showcase that our chosen platforms are working #
We have created a sample "student" Table with the DB hosted on AWS RDS. For now, using the current UI, we can add a student record to the DB and see all the added records listed on the webpage.

The "student" record currently accepts a "name" for the student and also a waterloo/laurier school "email" address.

# Datasets for the App #
As of now this is what we are planning to do for the actual datasets to be used in the app:
1. Using this https://thisrentaldoesnotexist.com/ for creating fake images for the rental apartments that the fake tenants will post
2. Using this https://thispersondoesnotexist.com for fake profile images for the subtenants
3. New users and postings will populate the database by filling in details, or randomly generated details from the above sites
4. We are still considering further datasets to create any random address to aide the testing off the app with sample data

# Getting Started #
1. Use `server/.sample-env` file as a template to create your own `server/.env` file

2. `cd server` and set up your local database in 2 ways:
  - ## Sync with production database in RDS **(WILL OVERWRITE DATA)** ##
    1. Set database credentials in `.env` to point to RDS instance
    2. `npm run db_dump <file_path>` to store database dump at `<file_path>` (recommend file name ends in `dump.sql` so that it can be gitignored)
    3. Set database credentials in `.env` to point to local instance
    4. `npm run db_import <file_path>` to import database dump **(MAKE SURE YOU'RE NOT POINTING AT RDS)**
  - ## Fresh local database instance **(WILL DELETE DATA)** ##
    1. Set database credentials in `.env` to point to local instance **(MAKE SURE YOU'RE NOT POINTING AT RDS)**
    2. `npm run db_setup` to get a fresh database instance
  - ## Lastly, you can execute any SQL script via `mysql -h <HOSTNAME> -u <USER> -p < <sql_file>` or `npm run db_exec <sql_file>` which refers to the DB in your `.env` ##

3. Install dependencies by running the following in the project root:
`cd server && npm i` <br>
`cd client && npm i`

4. Launch the app by running the following from the server directory:
`npm run dev`

# References #
We used this repository https://github.com/bezkoder/nodejs-express-mysql/tree/d8cef0f9dace78d1a78da58611526e6474cb2a52 for getting the basic project structure and a simple CRUD api for a student data model in the server folder (our backend) for our milestone zero project.
