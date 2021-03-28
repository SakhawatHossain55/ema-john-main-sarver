const express = require('express')
const bodyParser = require('body-parser')

const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0hcik.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()


app.use(cors())
app.use(bodyParser.json())
const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
    
  app.post('/addProduct', (req, res) => {
        const products = req.body;
        // console.log(product);
        productsCollection.insertOne(products)
        .then(result => {
            // console.log(result);
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })
    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    ////////////// second step
    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })
    app.post('/productsByKeys', (req, res) =>{
        const productskeys = req.body;
        productsCollection.find({key: {$in: productskeys}})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

  //   console.log('database connected');
//   client.close();
});




// console.log(process.env.DB_USER);
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(process.env.PORT || port)