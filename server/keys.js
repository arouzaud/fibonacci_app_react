// The file houses some of the variables needed to connect to running instances of PostGres and Redis

module.exports = {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    pgUser: process.env.PGUSER, // the same of the user we are going to use to login to PostGres
    pgHost: process.env.PGHOST,
    pgDatabase: process.env.PGDATABASE,
    pgPassword: process.env.PGPASSWORD,
    pgPort: process.env.PGPORT,
};