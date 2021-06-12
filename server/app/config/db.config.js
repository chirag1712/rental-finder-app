module.exports = (() => {
    switch(process.env.NODE_ENV){
        case 'dev':
            return {
                HOST: process.env.LOCAL_DB_HOST,
                USER: process.env.LOCAL_DB_USER,
                PASSWORD: process.env.LOCAL_DB_PASSWORD,
                DB: process.env.DB_NAME
            };
        case 'prod':
            return {
                HOST: process.env.RDS_DB_HOST,
                USER: process.env.RDS_DB_USER,
                PASSWORD: process.env.RDS_DB_PASSWORD,
                DB: process.env.DB_NAME
            };
        default:
            throw "Please set NODE_ENV in server/.env correctly"
    }
})();