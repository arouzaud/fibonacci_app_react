
const keys = require('./keys');

// Express App Setup
const express = require('express'); // require/import the express library
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express(); // Create a new express application, an object that will receive and answer to any HTTP request coming to the React Application
app.use(cors()); // CORS is short for Cross-Origin-Resource-Sharing, allows us to make requests from one domain that the React application is running on to a different domain or diff port in this case that the Express API is hosted on
app.use(bodyParser.json()) // parse the incoming request from the React App and turns the body of the post request into a JSON value for the Express API

// PostGre Client Setup (communicate to Express)
const { Pool } = require("pg");
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

// Error listener for PG + create a table to house the info of the values submitted
pgClient.on("connect", (client) => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch((err) => console.error(err));
});

// Redis Client Setup to communicate with Redis
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000 // if loose connection, try to connect every 1000 seconds
});
const redisPublisher = redisClient.duplicate(); // we are making this duplicate redis connection because according to doc, because a connection setup for listening or other thing cannot do something else

// Express route handlers

// test route to make sure the app is working as expected
app.get('/', (req, res) => {
    res.send('Hi there! /api/ is the endpoint path root, add current or all to get values');
}); // this is called with a request and a response. Anytime someone makes a request to the root route of our app, we send back 'Hi!' 

// Another route used to query or run PG instance and return all values every submitted and stored to PS
app.get('/values/all', async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows) // rows make sure we return only info contained in the DB, not info about the query
});

// Route for Redis retrieval
app.get("/values/current", async (req, res) => {
    redisClient.hgetall("values", (err, values) => { // get all values from Redis with hash key 'values'
        res.send(values);
    });
});

// Route Handler for POST requests to the /values endpoint
app.post("/values", async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status('422', 'Index too high');
    }
    redisClient.hset("values', index, 'Nothing yet!"); // put the value in our Redis Datastore
    redisPublisher.publish('insert', index); // send a message to the Worker Process and say it's time to compute the Fibonacci value
    pgClient.query('INSERT INTO values(number) VALUES ($1)', [index]);

    res.send({ working: true });
});

app.listen(5000, (err) => {
    console.log('Listening on port 5000');
}
);