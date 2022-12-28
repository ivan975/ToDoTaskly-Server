const { MongoClient } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
require('colors');
require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware
app.use(express.json());
app.use(cors());

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.2f4txuh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);


const tasks = client.db('todoTaskly').collection('tasks');
const addTasks = client.db('todoTaskly').collection('addTasks');

app.post('/tasks', async (req, res) => {
    try {
        const result = await tasks.insertOne(req.body);

        if (result.insertedId) {
            res.send({
                success: true,
                message: `Successfully inserted ${result.insertedId}`
            })
        }
    }
    catch (error) {
        console.log(error.name.bgRed, error.message.bold);
        res.send({
            success: false,
            error: error.message,
        });
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const cursor = await tasks.find({}).toArray();
        res.send(cursor);
        console.log(cursor);
    }
    catch (error) {
        console.log(error.name.bgRed, error.message.bold);
        res.send({
            success: false,
            error: error.message,
        });
    }
})
app.post('/addTasks', async (req, res) => {
    try {
        const result = await addTasks.insertOne(req.body);

        if (result.insertedId) {
            res.send({
                success: true,
                message: `Successfully inserted ${result.insertedId}`
            })
        }
    }
    catch (error) {
        console.log(error.name.bgRed, error.message.bold);
        res.send({
            success: false,
            error: error.message,
        });
    }
})

app.get('/addTasks', async (req, res) => {
    try {
        const cursor = await addTasks.find({}).toArray();
        res.send(cursor);
        console.log(cursor);
    }
    catch (error) {
        console.log(error.name.bgRed, error.message.bold);
        res.send({
            success: false,
            error: error.message,
        });
    }
})

async function dbConnection() {
    try {
        await client.connect();
        console.log('Connected to MongoDB'.yellow.bold);
    }
    catch (err) {
        console.log(err.name.bgRed, err.message.bold);
    }
}
dbConnection();

app.get('/', (req, res) => {
    res.send('server started')
})

app.listen(port, (req, res) => {
    console.log(`server listening on port ${port}`);
})