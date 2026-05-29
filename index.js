const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.LARAVA_URI;
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    await client.connect();

    const db = client.db('laranaDB');
    const doctorsCollection = db.collection('doctors');
    const featuredDoctors = db.collection('featured-doctors');
    const appointmentsCollection = db.collection('appointments');

    app.get("/doctors", async (req, res) => {
      const result = await doctorsCollection.find().toArray();
      res.send(result);
    });

    app.get("/featured-doctors", async (req, res) => {
      const result = await featuredDoctors.find().toArray();
      res.send(result);
    });

    app.get("/doctors/:id", async (req, res) => {
      const { id } = req.params;
      const result = await doctorsCollection.findOne({ id: id });
      res.send(result);
    });

    app.post("/appointments", async (req, res) => {
      const result = await appointmentsCollection.insertOne(req.body);
      res.send(result);
    });

    app.get("/appointments", async (req, res) => {
      const result = await appointmentsCollection.find().toArray();
      res.send(result);
    });



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
  res.send("Server is running for Larana!");
});

