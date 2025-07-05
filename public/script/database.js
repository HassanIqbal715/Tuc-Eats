require('dotenv').config();
const {Client} = require('pg');

let client;

function connectClient() {
    client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    });

    client.connect();
}

function getData(query, callback) {
    client.query(query, (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, res.rows);
        }
    });       
}

function getDataByValue(query, value, callback) {
    client.query(query, [value], (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            callback (null, res.rows);
        }
    });
}

function getDataByValueArray(query, valueArray, callback) {
    client.query(query, valueArray, (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            callback (null, res.rows);
        }
    });
}

async function insertData(query, valuesArray) {
    const result = await client.query(query, valuesArray);
    return result;
}

async function deleteDataByValue(query, value) {
    const result = await client.query(query, value);
    return result;
}

async function updateDataByValue(query, value) {
    const result = await client.query(query, value);
    return result;
}

process.on('SIGINT', async () => {
    console.log("shutting down...");
    await client.end();
    console.log("Disconnected from database");
    process.exit(0);
});

module.exports = { 
    connectClient, 
    getData,
    getDataByValue,
    getDataByValueArray,
    insertData,
    deleteDataByValue,
    updateDataByValue
};