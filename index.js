const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // This allows parsing JSON from request body

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASSWORD}@basicsexploring.cgr22.mongodb.net/?retryWrites=true&w=majority&appName=basicsExploring`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect to MongoDB
    await client.connect();
    const craftCollection = client.db("craftDB").collection("crafts");

    app.get("/craftItem", async (req, res) => {
        const cursor = craftCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

    // POST route to add items
    app.post("/craftItem", async (req, res) => {
      const newCraftItem = req.body;
      console.log("New Craft Item:", newCraftItem);
      const result = await craftCollection.insertOne(newCraftItem); // Insert item into MongoDB
      res.send(result); // Return result to frontend
    });

    // This just verifies that MongoDB is connected
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");

  } catch (err) {
    console.error(err);
  }
}

run().catch(console.dir);

// Start the Express server

app.get("/", (req, res) => {
    res.send("Starlight Artistry Server is Running");
  });
  
  app.listen(port, () => {
    console.log(`Starlight Artistry Server is listening on ${port}`);
  });