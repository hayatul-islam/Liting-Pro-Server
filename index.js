const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 4040;

app.use(cors());
app.use(express.json());

// image upload
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 1000000, limit: '500mb' }));


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r9gms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("listingPro");
        const listingCollection = database.collection("listing");
        const categoryCollection = database.collection("category");

        // post category
        app.post('/addCategory', async (req, res) => {
            const result = await categoryCollection.insertOne(req.body);
            res.json(result);
        });

        // get category
        app.get('/category', async (req, res) => {
            const result = await categoryCollection.find({}).toArray();
            res.send(result);
        });

        // get listing
        app.get('/listing', async (req, res) => {
            const listing = await listingCollection.find({}).toArray();
            res.send(listing);
        });

        //  post addListing 
        app.post('/addListing', async (req, res) => {
            const addListing = await listingCollection.insertOne(req.body);
            res.json(addListing);
        });



    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})