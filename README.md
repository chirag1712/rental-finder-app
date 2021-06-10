# For the sake of this demo we will be using table "student" to perform simple crud functionality to showcase that our chosen platforms are working #
We have created a sample "student" Table with the DB hosted on AWS RDS. For now, using the current UI, we can add a student record to the DB and see all the added records listed on the webpage.

The "student" record currently accepts a "name" for the student and also a waterloo/laurier school "email" address.

# Datasets for the App #
As of now this is what we are planning to do for the actual datasets to be used in the app:
1. Using this https://thisrentaldoesnotexist.com/ for creating fake images for the rental apartments that the fake tenants will post
2. Using this https://thispersondoesnotexist.com for fake profile images for the subtenants
3. New users and postings will populate the database by filling in details, or randomly generated details from the above sites
4. We are still considering further datasets to create any random address to aide the testing off the app with sample data

# Database Scripts #
The `server/database/` directory houses useful Bash scripts for interacting with the database.

**They can only be run in the `server/database/` directory.**

In this directory we have:
- `migrations/` houses SQL scripts and database dumps
- `mysql_local.sh` wraps the `mysql` command with hardcoded local database credentials **(you should modify this file to reflect your system)**
- `local_db_setup.sh` creates a fresh new local database instance using the scripts in `migrations/` **(will delete data)**
- `local_db_dump.sh` dumps the local database `honkForSublet` to `migrations/local_dump.sql`
- `local_db_import.sh` imports a database dump from a user specified path into the local database **(will delete data)**

# Getting Started #
1. Set up your local database using the database scripts above

2. Install dependencies by running the following in the project root:
`cd server && npm i` <br>
`cd client && npm i`

2. Use `server/.sample-env` file as a template to fill in the DB credentials at your copy of the `server/.env` file

3. Launch the app by running the following from the server directory:
`npm run dev`

# References #
We used this repository https://github.com/bezkoder/nodejs-express-mysql/tree/d8cef0f9dace78d1a78da58611526e6474cb2a52 for getting the basic project structure and a simple CRUD api for a student data model in the server folder (our backend) for our milestone zero project.
