const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 8000;
//middleware
app.use(cors());
app.use(express.json());

//MongoDB
const uri =
  "mongodb+srv://taskManagementApp:lYEOBiIll1xacEQg@cluster0.auieprw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const taskCollection = client
      .db("taskManagement")
      .collection("taskDetails");
    //post task
    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Management app is running");
});

app.listen(port, () => {
  console.log(`Simple node server is runnig on port ${port}`);
});
