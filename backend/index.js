const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { ObjectId } = require("mongodb"); // Make sure this is at the top of your file

app.use(
  cors({
    origin: [
      "https://gsbgs-jo2k6vnci-prabhpreetgill.vercel.app",
      "https://gsbgs.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

const uri =
  "mongodb+srv://admin-prabh:Devils30.@cluster0.nfztjmo.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB once at the start of the application
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    // Ensures that the client will close when you finish/error
    console.error("Failed to connect to MongoDB", error);
  }
}
run().catch(console.error);

// Route to list all collections
app.get("/api/students", async (req, res) => {
  try {
    const db = await client.db("GSIMS");
    const collection = await db.collection("Students");
    const documents = await collection.find({}).toArray(); // Convert cursor to an array
    res.json(documents); // Send JSON response
  } catch (error) {
    console.error("Error listing collections:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/students/:id", async (req, res) => {
  try {
    const studentId = req.params.id; // Get the student ID from the URL parameter

    const db = await client.db("GSIMS");
    const collection = await db.collection("Students");

    const student = await collection.findOne({ _id: new ObjectId(studentId) });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    console.log("found student");
    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    const studentId = req.params.id; // Get the student ID from the URL parameter
    const updateData = req.body; // Get the update data from the request body

    const db = await client.db("GSIMS");
    const collection = await db.collection("Students");

    const result = await collection.updateOne(
      { _id: new ObjectId(studentId) }, // Ensure to match by the correct ID
      { $set: updateData } // Use $set to update the fields in the document
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Student not found or no update made" });
    }

    res.json({ message: "Student updated successfully" });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/students/add", async (req, res) => {
  try {
    const studentData = req.body; // Get student data from the request body

    // Basic validation (you can expand this as needed)
    if (!studentData._firstName || !studentData._lastName) {
      return res
        .status(400)
        .json({ message: "First and last name are required" });
    }

    const db = await client.db("GSIMS");
    const collection = await db.collection("Students");

    const result = await collection.insertOne(studentData);

    if (result.acknowledged) {
      const insertedId = result.insertedId;
      // Optionally, fetch the full document using insertedId if needed
      const insertedDocument = await collection.findOne({ _id: insertedId });
      res.status(201).json(insertedDocument);
    } else {
      // Handle case where insert was not acknowledged
      res.status(500).json({ message: "Insert operation not acknowledged" });
    }
  } catch (error) {
    console.error("Error adding new student:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a student
app.delete("/api/students/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    // Ensure studentId is a valid ObjectId
    if (!ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const db = await client.db("GSIMS");
    const collection = await db.collection("Students");

    const result = await collection.deleteOne({ _id: new ObjectId(studentId) });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Student successfully deleted" });
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/term", async (req, res) => {
  try {
    const db = await client.db("GSIMS");
    const collection = await db.collection("Term");
    const documents = await collection.find({}).toArray(); // Convert cursor to an array
    res.json(documents); // Send JSON response
  } catch (error) {
    console.error("Error listing collections:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/term/add", async (req, res) => {
  try {
    const termData = req.body; // Get student data from the request body

    const db = await client.db("GSIMS");
    const collection = await db.collection("Term");

    const result = await collection.insertOne(termData);

    if (result.acknowledged) {
      const insertedId = result.insertedId;
      // Optionally, fetch the full document using insertedId if needed
      const insertedDocument = await collection.findOne({ _id: insertedId });
      res.status(201).json(insertedDocument);
    } else {
      // Handle case where insert was not acknowledged
      res.status(500).json({ message: "Insert operation not acknowledged" });
    }
  } catch (error) {
    console.error("Error adding new Term:", error);
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/term/update/:id", async (req, res) => {
  try {
    const termID = req.params.id;
    const updateData = req.body;

    const db = await client.db("GSIMS");
    const collection = await db.collection("Term");

    // Ensure teacherId is a valid ObjectId
    if (!ObjectId.isValid(termID)) {
      return res.status(400).json({ message: "Invalid term ID" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(termID) },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Term updated successfully" });
    } else {
      res.status(404).json({ message: "Term not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating term:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/teacher", async (req, res) => {
  try {
    const db = await client.db("GSIMS");
    const collection = await db.collection("Teachers");
    const documents = await collection.find({}).toArray(); // Convert cursor to an array
    res.json(documents); // Send JSON response
  } catch (error) {
    console.error("Error listing collections:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/teacher/add", async (req, res) => {
  try {
    const teacherData = req.body; // Get student data from the request body

    const db = await client.db("GSIMS");
    const collection = await db.collection("Teachers");

    const result = await collection.insertOne(teacherData);

    if (result.acknowledged) {
      const insertedId = result.insertedId;
      // Optionally, fetch the full document using insertedId if needed
      const insertedDocument = await collection.findOne({ _id: insertedId });
      res.status(201).json(insertedDocument);
    } else {
      // Handle case where insert was not acknowledged
      res.status(500).json({ message: "Insert operation not acknowledged" });
    }
  } catch (error) {
    console.error("Error adding new Teacher:", error);
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/teacher/update/:id", async (req, res) => {
  try {
    const teacherId = req.params.id;
    const updateData = req.body;

    const db = await client.db("GSIMS");
    const collection = await db.collection("Teachers");

    // Ensure teacherId is a valid ObjectId
    if (!ObjectId.isValid(teacherId)) {
      return res.status(400).json({ message: "Invalid teacher ID" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(teacherId) },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Teacher updated successfully" });
    } else {
      res.status(404).json({ message: "Teacher not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a teacher
app.delete("/api/teacher/:id", async (req, res) => {
  const teacherId = req.params.id;
  if (!ObjectId.isValid(teacherId)) {
    return res.status(400).json({ message: "Invalid Teacher ID" });
  }
  try {
    const db = await client.db("GSIMS");
    const collection = db.collection("Teachers");
    const result = await collection.deleteOne({ _id: new ObjectId(teacherId) });
    result.deletedCount === 1
      ? res.status(200).json({ message: "Teacher successfully deleted" })
      : res.status(404).json({ message: "Teacher not found" });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/ta", async (req, res) => {
  try {
    const db = await client.db("GSIMS");
    const collection = await db.collection("TA");
    const documents = await collection.find({}).toArray(); // Convert cursor to an array
    res.json(documents); // Send JSON response
  } catch (error) {
    console.error("Error listing collections:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/ta/add", async (req, res) => {
  try {
    const taData = req.body; // Get student data from the request body

    const db = await client.db("GSIMS");
    const collection = await db.collection("TA");

    const result = await collection.insertOne(taData);

    if (result.acknowledged) {
      const insertedId = result.insertedId;
      // Optionally, fetch the full document using insertedId if needed
      const insertedDocument = await collection.findOne({ _id: insertedId });
      res.status(201).json(insertedDocument);
    } else {
      // Handle case where insert was not acknowledged
      res.status(500).json({ message: "Insert operation not acknowledged" });
    }
  } catch (error) {
    console.error("Error adding new TA:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a TA
app.delete("/api/ta/:id", async (req, res) => {
  const taId = req.params.id;
  if (!ObjectId.isValid(taId)) {
    return res.status(400).json({ message: "Invalid TA ID" });
  }
  try {
    const db = await client.db("GSIMS");
    const collection = db.collection("TA");
    const result = await collection.deleteOne({ _id: new ObjectId(taId) });
    result.deletedCount === 1
      ? res.status(200).json({ message: "TA successfully deleted" })
      : res.status(404).json({ message: "TA not found" });
  } catch (error) {
    console.error("Error deleting TA:", error);
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/ta/update/:id", async (req, res) => {
  try {
    const taId = req.params.id;
    const updateData = req.body;

    const db = await client.db("GSIMS");
    const collection = await db.collection("TA");

    // Ensure teacherId is a valid ObjectId
    if (!ObjectId.isValid(taId)) {
      return res.status(400).json({ message: "Invalid ta ID" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(taId) },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "TA updated successfully" });
    } else {
      res.status(404).json({ message: "TA not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/classesoffered", async (req, res) => {
  try {
    const db = await client.db("GSIMS");
    const collection = await db.collection("ClassesOffered");
    const documents = await collection.find({}).toArray(); // Convert cursor to an array
    res.json(documents); // Send JSON response
  } catch (error) {
    console.error("Error listing collections:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/classesoffered/add", async (req, res) => {
  try {
    const taData = req.body; // Get student data from the request body

    const db = await client.db("GSIMS");
    const collection = await db.collection("ClassesOffered");

    const result = await collection.insertOne(taData);

    if (result.acknowledged) {
      const insertedId = result.insertedId;
      // Optionally, fetch the full document using insertedId if needed
      const insertedDocument = await collection.findOne({ _id: insertedId });
      res.status(201).json(insertedDocument);
    } else {
      // Handle case where insert was not acknowledged
      res.status(500).json({ message: "Insert operation not acknowledged" });
    }
  } catch (error) {
    console.error("Error adding new TA:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a class offered
app.delete("/api/classesoffered/:id", async (req, res) => {
  const classOfferedId = req.params.id;
  if (!ObjectId.isValid(classOfferedId)) {
    return res.status(400).json({ message: "Invalid Class Offered ID" });
  }
  try {
    const db = await client.db("GSIMS");
    const collection = db.collection("ClassesOffered");
    const result = await collection.deleteOne({
      _id: new ObjectId(classOfferedId),
    });
    result.deletedCount === 1
      ? res.status(200).json({ message: "Class Offered successfully deleted" })
      : res.status(404).json({ message: "Class Offered not found" });
  } catch (error) {
    console.error("Error deleting class offered:", error);
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/classesoffered/update/:id", async (req, res) => {
  try {
    const classID = req.params.id;
    const updateData = req.body;

    const db = await client.db("GSIMS");
    const collection = await db.collection("ClassesOffered");

    // Ensure teacherId is a valid ObjectId
    if (!ObjectId.isValid(classID)) {
      return res.status(400).json({ message: "Invalid Class ID" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(classID) },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Class updated successfully" });
    } else {
      res.status(404).json({ message: "Class not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating Class:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/classes", async (req, res) => {
  try {
    const db = await client.db("GSIMS");
    const collection = await db.collection("Classes");
    const documents = await collection.find({}).toArray(); // Convert cursor to an array
    res.json(documents); // Send JSON response
  } catch (error) {
    console.error("Error listing collections:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/classes/add", async (req, res) => {
  try {
    const taData = req.body; // Get student data from the request body

    const db = await client.db("GSIMS");
    const collection = await db.collection("Classes");

    const result = await collection.insertOne(taData);

    if (result.acknowledged) {
      const insertedId = result.insertedId;
      // Optionally, fetch the full document using insertedId if needed
      const insertedDocument = await collection.findOne({ _id: insertedId });
      res.status(201).json(insertedDocument);
    } else {
      // Handle case where insert was not acknowledged
      res.status(500).json({ message: "Insert operation not acknowledged" });
    }
  } catch (error) {
    console.error("Error adding new TA:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/classes/:id", async (req, res) => {
  try {
    const classId = req.params.id;

    const db = await client.db("GSIMS");
    const collection = await db.collection("Classes");

    // Ensure classId is a valid ObjectId
    if (!ObjectId.isValid(classId)) {
      return res.status(400).json({ message: "Invalid Class ID" });
    }

    const classData = await collection.findOne({ _id: new ObjectId(classId) });

    if (classData) {
      res.json(classData); // Corrected this line
    } else {
      res.status(404).json({ message: "Class not found" });
    }
  } catch (error) {
    console.error("Error retrieving class:", error);
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/classes/update/:id", async (req, res) => {
  try {
    const classID = req.params.id;
    const updateData = req.body;

    const db = await client.db("GSIMS");
    const collection = await db.collection("Classes");

    // Ensure teacherId is a valid ObjectId
    if (!ObjectId.isValid(classID)) {
      return res.status(400).json({ message: "Invalid Class ID" });
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(classID) },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Class updated successfully" });
    } else {
      res.status(404).json({ message: "Class not found or no changes made" });
    }
  } catch (error) {
    console.error("Error updating Class:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE a class
app.delete("/api/classes/:id", async (req, res) => {
  const classId = req.params.id;
  if (!ObjectId.isValid(classId)) {
    return res.status(400).json({ message: "Invalid Class ID" });
  }
  try {
    const db = await client.db("GSIMS");
    const collection = db.collection("Classes");
    const result = await collection.deleteOne({ _id: new ObjectId(classId) });
    result.deletedCount === 1
      ? res.status(200).json({ message: "Class successfully deleted" })
      : res.status(404).json({ message: "Class not found" });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({ message: error.message });
  }
});

// Do not close the client connection here

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
