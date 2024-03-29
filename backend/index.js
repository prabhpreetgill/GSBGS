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

    app.use((req, res, next) => {
      req.db = client.db("your_db_name");
      next();
    });

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

        const student = await collection.findOne({
          _id: new ObjectId(studentId),
        });

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

    app.put("/api/students/update/:id", async (req, res) => {
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
          const insertedDocument = await collection.findOne({
            _id: insertedId,
          });
          res.status(201).json(insertedDocument);
        } else {
          // Handle case where insert was not acknowledged
          res
            .status(500)
            .json({ message: "Insert operation not acknowledged" });
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

        const result = await collection.deleteOne({
          _id: new ObjectId(studentId),
        });

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

    app.get("/api/term/:id", async (req, res) => {
      try {
        const termId = req.params.id; // Get the term ID from the request parameters

        const db = await client.db("GSIMS");
        const collection = await db.collection("Term");

        // Convert string ID to ObjectId for MongoDB
        const { ObjectId } = require("mongodb");
        const objectId = new ObjectId(termId);

        const termDocument = await collection.findOne({ _id: objectId });

        if (termDocument) {
          res.status(200).json(termDocument);
        } else {
          // If no document found, send a 404 response
          res.status(404).json({ message: "Term not found" });
        }
      } catch (error) {
        console.error("Error fetching Term by ID:", error);
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
          const insertedDocument = await collection.findOne({
            _id: insertedId,
          });
          res.status(201).json(insertedDocument);
        } else {
          // Handle case where insert was not acknowledged
          res
            .status(500)
            .json({ message: "Insert operation not acknowledged" });
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
          res
            .status(404)
            .json({ message: "Term not found or no changes made" });
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

    app.get("/api/teacher/:id", async (req, res) => {
      try {
        // Extract the ID from the request parameters
        const teacherId = req.params.id;

        // Connect to the database and select the collection
        const db = await client.db("GSIMS");
        const collection = await db.collection("Teachers");

        // Convert string ID to MongoDB ObjectId
        const objectId = new ObjectId(teacherId);

        // Find the document with the matching ID
        const teacher = await collection.findOne({ _id: objectId });

        // If a teacher is found, return it, otherwise return a 404 error
        if (teacher) {
          res.json(teacher);
        } else {
          res.status(404).json({ message: "Teacher not found" });
        }
      } catch (error) {
        console.error("Error fetching teacher by ID:", error);
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
          const insertedDocument = await collection.findOne({
            _id: insertedId,
          });
          res.status(201).json(insertedDocument);
        } else {
          // Handle case where insert was not acknowledged
          res
            .status(500)
            .json({ message: "Insert operation not acknowledged" });
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
          res
            .status(404)
            .json({ message: "Teacher not found or no changes made" });
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
        const result = await collection.deleteOne({
          _id: new ObjectId(teacherId),
        });
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

    app.get("/api/ta/:id", async (req, res) => {
      try {
        // Extract the ID from the request parameters
        const taId = req.params.id;

        // Connect to the database
        const db = await client.db("GSIMS");
        const collection = db.collection("TA");

        // Convert string ID to ObjectId for MongoDB
        const objectId = new ObjectId(taId);

        // Find the TA document by ID
        const taDocument = await collection.findOne({ _id: objectId });

        if (taDocument) {
          // If the document is found, send it back in the response
          res.status(200).json(taDocument);
        } else {
          // If no document is found, send a 404 response
          res.status(404).json({ message: "TA not found" });
        }
      } catch (error) {
        console.error("Error retrieving TA by ID:", error);
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
          const insertedDocument = await collection.findOne({
            _id: insertedId,
          });
          res.status(201).json(insertedDocument);
        } else {
          // Handle case where insert was not acknowledged
          res
            .status(500)
            .json({ message: "Insert operation not acknowledged" });
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
          const insertedDocument = await collection.findOne({
            _id: insertedId,
          });
          res.status(201).json(insertedDocument);
        } else {
          // Handle case where insert was not acknowledged
          res
            .status(500)
            .json({ message: "Insert operation not acknowledged" });
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
          ? res
              .status(200)
              .json({ message: "Class Offered successfully deleted" })
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
          res
            .status(404)
            .json({ message: "Class not found or no changes made" });
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
          const insertedDocument = await collection.findOne({
            _id: insertedId,
          });
          res.status(201).json(insertedDocument);
        } else {
          // Handle case where insert was not acknowledged
          res
            .status(500)
            .json({ message: "Insert operation not acknowledged" });
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

        const classData = await collection.findOne({
          _id: new ObjectId(classId),
        });

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
          res
            .status(404)
            .json({ message: "Class not found or no changes made" });
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
        const result = await collection.deleteOne({
          _id: new ObjectId(classId),
        });
        result.deletedCount === 1
          ? res.status(200).json({ message: "Class successfully deleted" })
          : res.status(404).json({ message: "Class not found" });
      } catch (error) {
        console.error("Error deleting class:", error);
        res.status(500).json({ message: error.message });
      }
    });

    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");
    const secretKey = process.env.JWT_SECRET || "prabhsinghji"; // Ensure this is secure and not exposed

    app.post("/api/login", async (req, res) => {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      try {
        const db = await client.db("GSIMS");
        const collection = await db.collection("Users");
        const userDoc = await collection.findOne({ user: username }); // Use 'user' instead of 'username'

        if (!userDoc) {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }

        const match = await bcrypt.compare(password, userDoc.password); // userDoc.password is the hashed password

        if (match) {
          const token = jwt.sign({ userId: userDoc._id }, secretKey, {
            expiresIn: "1h",
          });
          res.json({ message: "You are now logged in!", token });
        } else {
          return res
            .status(401)
            .json({ message: "Invalid username or password" });
        }
      } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // Do not close the client connection here

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    // Ensures that the client will close when you finish/error
    console.error("Failed to connect to MongoDB", error);
  }
}
run().catch(console.error);
