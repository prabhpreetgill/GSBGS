const express = require('express');
const cors = require('cors')
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require('mongodb'); // Make sure this is at the top of your file


app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://admin-prabh:Devils30.@cluster0.nfztjmo.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// Connect to MongoDB once at the start of the application
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch(error) {
    // Ensures that the client will close when you finish/error
    console.error("Failed to connect to MongoDB", error);
  }
}
run().catch(console.error);

// Route to list all collections
app.get('/api/students', async (req, res) => {
  try {
      const db = await client.db("GSIMS"); 
      const collection = await db.collection("Students");
      const documents = await collection.find({}).toArray(); // Convert cursor to an array
      res.json(documents); // Send JSON response
  } catch (error) {
      console.error('Error listing collections:', error);
      res.status(500).json({ message: error.message });
  }
});

app.post('/api/students/add', async (req, res) => {
    try {
        const studentData = req.body; // Get student data from the request body

        // Basic validation (you can expand this as needed)
        if (!studentData._firstName || !studentData._lastName) {
            return res.status(400).json({ message: "First and last name are required" });
        }

        const db = await client.db("GSIMS");
        const collection = await db.collection("Students");

        const result = await collection.insertOne(studentData);
        
        if(result.acknowledged) {
            const insertedId = result.insertedId;
            // Optionally, fetch the full document using insertedId if needed
            const insertedDocument = await collection.findOne({ _id: insertedId });
            res.status(201).json(insertedDocument);
        } else {
            // Handle case where insert was not acknowledged
            res.status(500).json({ message: "Insert operation not acknowledged" });
        }
    } catch (error) {
        console.error('Error adding new student:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/term', async (req, res) => {
    try {
        const db = await client.db("GSIMS"); 
        const collection = await db.collection("Term");
        const documents = await collection.find({}).toArray(); // Convert cursor to an array
        res.json(documents); // Send JSON response
    } catch (error) {
        console.error('Error listing collections:', error);
        res.status(500).json({ message: error.message });
    }
  });

app.post('/api/term/add', async (req, res) => {
    try {
        const termData = req.body; // Get student data from the request body

        const db = await client.db("GSIMS");
        const collection = await db.collection("Term");

        const result = await collection.insertOne(termData);
        
        if(result.acknowledged) {
            const insertedId = result.insertedId;
            // Optionally, fetch the full document using insertedId if needed
            const insertedDocument = await collection.findOne({ _id: insertedId });
            res.status(201).json(insertedDocument);
        } else {
            // Handle case where insert was not acknowledged
            res.status(500).json({ message: "Insert operation not acknowledged" });
        }
    } catch (error) {
        console.error('Error adding new Term:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/teacher', async (req, res) => {
    try {
        const db = await client.db("GSIMS"); 
        const collection = await db.collection("Teachers");
        const documents = await collection.find({}).toArray(); // Convert cursor to an array
        res.json(documents); // Send JSON response
    } catch (error) {
        console.error('Error listing collections:', error);
        res.status(500).json({ message: error.message });
    }
  });

app.post('/api/teacher/add', async (req, res) => {
    try {
        const teacherData = req.body; // Get student data from the request body

        const db = await client.db("GSIMS");
        const collection = await db.collection("Teachers");

        const result = await collection.insertOne(teacherData);
        
        if(result.acknowledged) {
            const insertedId = result.insertedId;
            // Optionally, fetch the full document using insertedId if needed
            const insertedDocument = await collection.findOne({ _id: insertedId });
            res.status(201).json(insertedDocument);
        } else {
            // Handle case where insert was not acknowledged
            res.status(500).json({ message: "Insert operation not acknowledged" });
        }
    } catch (error) {
        console.error('Error adding new Teacher:', error);
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/teacher/update/:id', async (req, res) => {
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
        console.error('Error updating teacher:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/ta', async (req, res) => {
    try {
        const db = await client.db("GSIMS"); 
        const collection = await db.collection("TA");
        const documents = await collection.find({}).toArray(); // Convert cursor to an array
        res.json(documents); // Send JSON response
    } catch (error) {
        console.error('Error listing collections:', error);
        res.status(500).json({ message: error.message });
    }
  });

app.post('/api/ta/add', async (req, res) => {
    try {
        const taData = req.body; // Get student data from the request body

        const db = await client.db("GSIMS");
        const collection = await db.collection("TA");

        const result = await collection.insertOne(taData);
        
        if(result.acknowledged) {
            const insertedId = result.insertedId;
            // Optionally, fetch the full document using insertedId if needed
            const insertedDocument = await collection.findOne({ _id: insertedId });
            res.status(201).json(insertedDocument);
        } else {
            // Handle case where insert was not acknowledged
            res.status(500).json({ message: "Insert operation not acknowledged" });
        }
    } catch (error) {
        console.error('Error adding new TA:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/classesoffered', async (req, res) => {
    try {
        const db = await client.db("GSIMS"); 
        const collection = await db.collection("ClassesOffered");
        const documents = await collection.find({}).toArray(); // Convert cursor to an array
        res.json(documents); // Send JSON response
    } catch (error) {
        console.error('Error listing collections:', error);
        res.status(500).json({ message: error.message });
    }
  });

app.post('/api/classesoffered/add', async (req, res) => {
    try {
        const taData = req.body; // Get student data from the request body

        const db = await client.db("GSIMS");
        const collection = await db.collection("ClassesOffered");

        const result = await collection.insertOne(taData);
        
        if(result.acknowledged) {
            const insertedId = result.insertedId;
            // Optionally, fetch the full document using insertedId if needed
            const insertedDocument = await collection.findOne({ _id: insertedId });
            res.status(201).json(insertedDocument);
        } else {
            // Handle case where insert was not acknowledged
            res.status(500).json({ message: "Insert operation not acknowledged" });
        }
    } catch (error) {
        console.error('Error adding new TA:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/classes', async (req, res) => {
    try {
        const db = await client.db("GSIMS"); 
        const collection = await db.collection("Classes");
        const documents = await collection.find({}).toArray(); // Convert cursor to an array
        res.json(documents); // Send JSON response
    } catch (error) {
        console.error('Error listing collections:', error);
        res.status(500).json({ message: error.message });
    }
  });

app.post('/api/classes/add', async (req, res) => {
    try {
        const taData = req.body; // Get student data from the request body

        const db = await client.db("GSIMS");
        const collection = await db.collection("Classes");

        const result = await collection.insertOne(taData);
        
        if(result.acknowledged) {
            const insertedId = result.insertedId;
            // Optionally, fetch the full document using insertedId if needed
            const insertedDocument = await collection.findOne({ _id: insertedId });
            res.status(201).json(insertedDocument);
        } else {
            // Handle case where insert was not acknowledged
            res.status(500).json({ message: "Insert operation not acknowledged" });
        }
    } catch (error) {
        console.error('Error adding new TA:', error);
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/classes/:id', async (req, res) => {
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
        console.error('Error retrieving class:', error);
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/classes/update/:id', async (req, res) => {
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
        console.error('Error updating Class:', error);
        res.status(500).json({ message: error.message });
    }
});

// Do not close the client connection here

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));