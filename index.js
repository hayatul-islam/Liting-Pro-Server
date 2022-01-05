const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const app = express();
const port = process.env.PORT || 4040;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r9gms.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("listingPro");
        const brandCollection = database.collection("brands");
        const listingCollection = database.collection("listing");
        const subCategoryCollection = database.collection("subCategory");

        // post brand
        app.post('/addBrand', async (req, res) => {
            const result = await brandCollection.insertOne(req.body);
            res.json(result);
        });

        // get brands
        app.get('/brands', async (req, res) => {
            const brands = await brandCollection.find({}).toArray();
            res.send(brands);
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

        // post category
        app.post('/addSubCategory', async (req, res) => {
            const result = await subCategoryCollection.insertOne(req.body);
            res.json(result);
        });

        // get subCategory
        app.get('/subCategory', async (req, res) => {
            const result = await subCategoryCollection.find({}).toArray();
            res.send(result);
        })

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