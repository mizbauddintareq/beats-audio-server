const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.taxrqnn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const categoriesCollection = client
      .db("beatsAudio")
      .collection("catagories");
    const usersCollection = client.db("beatsAudio").collection("users");
    const productsCollection = client.db("beatsAudio").collection("products");
    const ordersCollection = client.db("beatsAudio").collection("orders");

    // Post User API
    app.post("/users", async (req, res) => {
      const user = req.body;

      const email = user.email;
      const query = { email: email };
      const savedUser = await usersCollection.findOne(query);
      if (savedUser) {
        return;
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

    // Get All Sellers API
    app.get("/users/sellers", async (req, res) => {
      const query = { role: "seller" };
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    // Get All Buyers API
    app.get("/users/buyers", async (req, res) => {
      const query = { role: "buyer" };
      const users = await usersCollection.find(query).toArray();
      res.send(users);
    });

    // Delete User API
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = await usersCollection.deleteOne(filter);
      res.send(user);
    });

    // Check User Role
    app.get("/users/role", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };

      const user = await usersCollection.findOne(query);
      res.send(user);
    });

    // Get All Categories API
    app.get("/categories", async (req, res) => {
      const categories = await categoriesCollection.find({}).toArray();
      res.send(categories);
    });

    // Post Product API
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });
    // Delete product API
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const product = await productsCollection.deleteOne(filter);
      res.send(product);
    });

    // Get Products By Category
    app.get("/products/category/:name", async (req, res) => {
      const name = req.params.name;
      const query = { category: name };
      const products = await productsCollection.find(query).toArray();

      res.send(products);
    });

    // Post Bookings API
    app.post("/bookings", async (req, res) => {
      const bookings = req.body;
      const results = await ordersCollection.insertOne(bookings);
      res.send(results);
    });

    // Get My Orders API
    app.get("/my-orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const myOrders = await ordersCollection.find(query).toArray();
      res.send(myOrders);
    });

    // Get My Product API
    app.get("/my-products", async (req, res) => {
      const email = req.query.email;
      const query = { seller: email };
      const myProduct = await productsCollection.find(query).toArray();
      res.send(myProduct);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Beats Audio app listening on port ${port}`);
});
