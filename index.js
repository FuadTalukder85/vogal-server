const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const stripe = require("stripe")(
  "sk_test_51NFcc9HiKihjMle8rCLUT2Q6zMYMsJtx5ShlfHvPwYwfQrCPzH1sAFr0aSICfUuaPtb2jYqQLCLFKwKJNdDXM0zs00yjZd0NY4"
);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.az94fyn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const db = client.db("dataSolution");
    const collection = db.collection("userCollection");
    const product = db.collection("productCollection");
    const carts = db.collection("carts");
    const paymentCollection = db.collection("payment");

    // User Registration
    app.post("/api/v1/register", async (req, res) => {
      const { firstName, lastName, email, password } = req.body;

      // Check if email already exists
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user into the database
      await collection.insertOne({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        success: true,
        message: "User registered successfully",
      });
    });

    // User Login
    app.post("/api/v1/login", async (req, res) => {
      const { email, password } = req.body;

      // Find user by email
      const user = await collection.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRES_IN,
      });

      res.json({
        success: true,
        message: "Login successful",
        token,
      });
    });
    //get all users
    app.get("/users", async (req, res) => {
      const result = await collection.find().toArray();
      res.send(result);
    });

    //post product
    app.post("/create-product", async (req, res) => {
      const addProduct = req.body;
      const result = await product.insertOne(addProduct);
      res.send(result);
    });

    //get all products
    app.get("/products", async (req, res) => {
      const result = await product.find().toArray();
      res.send(result);
    });

    //get single product item by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await product.findOne(query);
      res.send(result);
    });

    // Update product by id
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updateProduct = req.body;

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const productData = {
        $set: {
          title: updateProduct.title,
          tag: updateProduct.tag,
          firstImg: updateProduct.firstImg,
          secondImg: updateProduct.secondImg,
          price: updateProduct.price,
          discount: updateProduct.discount,
          description: updateProduct.description,
        },
      };
      try {
        const result = await product.updateOne(filter, productData, options);

        // Check if the update was successful and respond accordingly
        if (result.modifiedCount === 1 || result.upsertedCount === 1) {
          res.status(200).json({ message: "product updated successfully" });
        } else {
          res.status(404).json({ error: "product not found" });
        }
      } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // delete product by id
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await product.deleteOne(query);
      res.send(result);
    });

    // post carts item
    app.post("/create-carts", async (req, res) => {
      const addCarts = req.body;
      const result = await carts.insertOne(addCarts);
      res.send(result);
    });

    // get carts
    app.get("/carts", async (req, res) => {
      const result = await carts.find().toArray();
      res.send(result);
    });
    // get cart by loggedin user
    app.get("/cart", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        res.send([]);
      }
      const query = { email: email };
      const result = await carts.find(query).toArray();
      res.send(result);
    });

    // delete cart by id
    app.delete("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carts.deleteOne(query);
      res.send(result);
    });

    // payment
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;

      if (!price || price < 0.5) {
        return res.status(400).send({
          error: "The price must be greater than or equal to 0.50 USD.",
        });
      }

      const amount = Math.round(price * 100); // Ensure amount is an integer in cents
      console.log(price, amount);

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types: ["card"],
        });

        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send({
          error: error.message,
        });
      }
    });

    // payment api
    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const insertResult = await paymentCollection.insertOne(payment);
      //
      const query = {
        _id: { $in: payment.cartsId.map((id) => new ObjectId(id)) },
      };
      const deleteResult = await carts.deleteMany(query);

      console.log(payment);

      res.send({ insertResult, deleteResult });
    });

    // Get total payment
    app.get("/payments", async (req, res) => {
      const result = await paymentCollection.find().toArray();
      res.send(result);
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
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

  // Test route
  app.get("/", (req, res) => {
    const serverStatus = {
      message: "Server is running smoothly",
    };
    res.json(serverStatus);
  });
}
run().catch(console.dir);
