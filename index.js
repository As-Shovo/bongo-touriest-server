const express = require ('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();


// middle ware 
app.use(cors());
app.use(express.json());


// mongo server 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.anxgc.mongodb.net/bongoTour?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri);

async function run (){
    try{
        await client.connect();
        const database = client.db('bongoTour');
        const tourCollection = database.collection('tourSpot');
        const tourGuidCollection = database.collection('tourGuid');
        const tourUserCollection = database.collection('tourUser');


        // POST API
        app.post('/tourService', async(req, res)=>{
            const services = req.body;
            const result = await tourCollection.insertOne(services)
            res.json(result);
        })


        // GET API
        app.get('/tourService', async(req, res)=>{
            const cursor = tourCollection.find({});

            const result = await cursor.toArray();
            res.send(result);
        })


        // Get API Guid

        app.get('/tourGuid', async(req, res)=>{
            const cursor = tourGuidCollection.find({});

            const result = await cursor.toArray();
            res.send(result);
        })

        // single data API
        
        app.get('/tourService/:id', async (req, res)=>{
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)};
            const result = await tourCollection.findOne(query);
            res.send(result);
        })


        // APP API manage order 

        app.post('/tourManage', async (req, res)=>{
            const cursor = req.body;
            const result = await tourUserCollection.insertOne(cursor);

            res.send(result);
        })

        // ALL USER ORDER 
        app.get('/tourManage', async (req, res)=>{
            const cursor = tourUserCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // DELETE API Manage Users
        app.delete('/tourManage/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await tourUserCollection.deleteOne(query);
            res.send(result);
        })

        
    }
    finally{

    }
}

run().catch(console.dir());






// server 
// get method

app.get('/', (req, res)=>{
    res.send('i am from Server');
})

app.listen(port, ()=>{
    console.log('server is running ', port);
})