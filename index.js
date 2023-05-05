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

var uri = `mongodb+srv://firstnet:Tiger720@cluster0.wfg9xnd.mongodb.net/test`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("fastnet-database");
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

    //get user 
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await users.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.send({ admin: isAdmin });
    })

     // add admin
     app.put('/users/admin', async(req, res) => {
      const user = req.body;
      const filter = {email: user.email};
      const update = {$set: {role: 'admin'}};
      const result = await users.updateOne(filter, update);
      res.send(result)
    })

    // post order data
    app.post('/orders', async (req, res) => {
      const data = req.body;
      const result = await orders.insertOne(data);
      res.send(result);
      console.log('posted data');
    })

    //get order data
    app.get('/orders', async (req, res) => {
      const result = await orders.find({}).toArray();
      res.send(result);
    })

    // delete order
    app.delete('/deleteOrder/:id', async (req, res) => {
      const result = await orders.deleteOne({ _id: ObjectId(req.params.id) })
      res.send(result);
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

module.exports = app;