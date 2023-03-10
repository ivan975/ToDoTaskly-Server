const { MongoClient, ObjectId } = require('mongodb');
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
app.get('/tasks/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const service = await tasks.findOne(query);
        res.send(service)
    }
    catch (err) {
        console.log(err.name.bgRed, err.message.bold);
        res.send({
            success: false,
            error: err.message,
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

// delete
app.delete('/tasks/:taskId', async (req, res) => {
    const id = req.params.taskId;
    const query = { _id: ObjectId(id) };
    const result = await tasks.deleteOne(query);
    res.send(result);
})

app.patch("/tasks/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await tasks.updateOne({ _id: ObjectId(id) }, { $set: req.body });

        if (result.matchedCount > 0) {
            res.send({
                success: true,
                message: `successfully updated the task`,
            });
        } else {
            res.send({
                success: false,
                error: "Couldn't update  the task",
            });
        }
    } catch (error) {
        res.send({
            success: false,
            error: error.message,
        });
    }
});

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