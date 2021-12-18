const express = require('express')
var MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.u39pp.mongodb.net:27017,cluster0-shard-00-01.u39pp.mongodb.net:27017,cluster0-shard-00-02.u39pp.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-8558zv-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("firstnet");
    const services = database.collection("services");
    const users = database.collection("users");
    const orders = database.collection("orders");

    // get services
    app.get('/services', async (req, res) => {
      const result = await services.find({}).toArray();
      res.send(result);
    })

    // get single service using query
    app.get('/singleService/:id', async (req, res) => {
      const result = await services.findOne({ _id: ObjectId(req.params.id) });
      res.send(result);
    })

    // add user to database
    app.post('/users', async (req, res) => {
      const data = req.body;
      const result = await users.insertOne(data);
      res.send(result);
      console.log('insert users');
    })
    app.get('/users', async (req, res) => {
      const result = await users.find({}).toArray;
      res.send(result);
   
    })

    // post order data
    app.post('/orders', async (req, res) => {
      const data = req.body;
      const result = await orders.insertOne(data);
      res.send(result);
      console.log('posted data');
    })

  }
  finally {
    //await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`Example my app listening at http://localhost:${port}`)
})