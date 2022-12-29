const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { query } = require("express");
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
    //get task
    app.get("/alltask", async (req, res) => {
      const query = {isCompleted:false};
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    });
    //delete a task
    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await taskCollection.deleteOne(query);
      res.send(result);
    });
    //get a task for update
    app.get("/updateTask/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const task = await taskCollection.findOne(query);
      res.send(task);
    });
    //update a task
    app.put("/update/:id", async(req, res)=>{
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedTask = req.body;
      const updateDoc = {
        $set: {
          task: updatedTask.newTask
        },
      };
      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })
    //complete a task
    app.put("/taskComplete/:id", async(req, res)=>{
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          isCompleted: true
        },
      };
      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })
    //get completed task
    app.get("/completed", async(req, res)=>{
      const query = {isCompleted: true};
      const result = await taskCollection.find(query).toArray();
      res.send(result);
    })
    //task not complete
    app.put("/taskNotComplete/:id", async(req, res)=>{
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          isCompleted: false
        },
      };
      const result = await taskCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    })
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
