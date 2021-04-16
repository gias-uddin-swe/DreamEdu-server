const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jqsch.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const port = 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

client.connect((err) => {
  const confirmApplyCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("confirmApply");
  const reviewCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("review");
  const adminCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("admin");
  const universityCollection = client
    .db(`${process.env.DB_NAME}`)
    .collection("allUniversity");

  app.post("/addService", (req, res) => {
    console.log(req.body);
    universityCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
      console.log(result.insertedCount > 0);
    });
  });
  app.post("/addReview", (req, res) => {
    console.log(req.body);
    reviewCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
      console.log(result.insertedCount > 0);
    });
  });

  app.get("/allScholarship", (req, res) => {
    universityCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/ClientReview", (req, res) => {
    reviewCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/confirmStudent", (req, res) => {
    confirmApplyCollection.insertOne(req.body).then((result) => {
      res.send(result.insertedCount > 0);
      console.log(result.insertedCount > 0);
    });
  });
  app.get("/myApplyList", (req, res) => {
    console.log(req.query.email);
    confirmApplyCollection
      .find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/addAdmin", (req, res) => {
    adminCollection.insertOne(req.body).then((result) => {
      console.log(result.insertedCount > 0);
      res.send(result.insertedCount > 0);
    });
  });

  app.delete("/deleteService/:id", (req, res) => {
    universityCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  app.get("/allOrders", (req, res) => {
    confirmApplyCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
});

app.listen(process.env.PORT || port);
