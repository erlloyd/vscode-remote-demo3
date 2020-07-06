'use strict';

import express from 'express';
import mongodb from 'mongodb';
import getRandomName from './namesgenerator.mjs';

const MongoClient = mongodb.MongoClient;
const url = "mongodb://mongo:27017/";

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
    MongoClient.connect(url, {
        useUnifiedTopology: true
    },
    async (err, client) => {
        if (err){
            console.error(err);
            res.send('Error');
            return;
        }
        const demoDb = client.db('demoDb');
        const cursor = demoDb.collection('names').find({});
        const names = await cursor.toArray();
        client.close();
        res.send(`All current names: ${JSON.stringify(names, null, 2)}`);
    })
});

app.get('/new', (req, res) => {
    MongoClient.connect(url, {
        useUnifiedTopology: true
    },
    async (err, client) => {
        if (err){
            console.error(err);
            res.send('Error');
            return;
        }
        const demoDb = client.db('demoDb');
        const name = getRandomName();
        await demoDb.collection('names').insertOne({
            name,
          });
        client.close();
        res.send(`Added new name to the DB: ${name}`);
    })
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
