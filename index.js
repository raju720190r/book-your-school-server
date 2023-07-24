const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.9k9az0h.mongodb.net/?retryWrites=true&w=majority`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const usersCollection = client.db("BookYourcollege").collection("Users");
    const CollegesCollection = client
      .db("BookYourcollege")
      .collection("Colleges");
    const ReviewCollection = client.db("BookYourcollege").collection("Review");
    const admissionCollection = client
      .db("BookYourcollege")
      .collection("addmission");

    //  users realated api is here
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };

      const excitingUser = await usersCollection.findOne(query);
      console.log("existing User", excitingUser);

      if (excitingUser) {
        return res.send({ message: "user exists" });
      }
      const result = await usersCollection.insertOne(user);
      return res.send(result);
    });

    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      return res.send(result);
    });

    // Assuming you already have the necessary imports and database setup
    app.patch("/users/:id", async (req, res) => {
      const userId = req.params.id;
      const { name, email, university, address } = req.body;

      try {
        // Assuming you have a usersCollection that allows you to update user data
        // Replace this with the actual method to update the user in your database
        await usersCollection.updateMany(
          { _id: new ObjectId(userId) }, // Assuming you are using MongoDB ObjectId
          { $set: { name, email, university, address } }
        );

        return res
          .status(200)
          .json({ message: "User data updated successfully!" });
      } catch (error) {
        console.error("Error updating user data:", error);
        return res.status(500).json({ error: "Server error" });
      }
    });

    //colege relatedApi
    app.get("/colleges", async (req, res) => {
      const result = await CollegesCollection.find().toArray();
      return res.send(result);
    });

    app.get("/colleges/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const options = {
        projection: {
          college_name: 1,
          image_url: 1,
          admission_process: 1,
          events: 1,
          research_works: 1,
          sports_categories: 1,
        },
      };
      const result = await CollegesCollection.findOne(query, options);
      res.send(result);
    });

    //admission Related
    app.get("/admission", async (req, res) => {
      const result = await admissionCollection.find().toArray();
      return res.send(result);
    });

    app.post("/admission", async (req, res) => {
      const formData = req.body;

      const result = await admissionCollection.insertOne(formData);
      return res.send(result);
    });

    //review related
    app.get("/clgreviews", async (req, res) => {
      const result = await ReviewCollection.find().toArray();
      return res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Collage Student is Running");
});
app.listen(port, () => {
  console.log(`Collage Student Is Running on port ${port}`);
});
