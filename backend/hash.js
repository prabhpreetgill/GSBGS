const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json()); // For parsing application/json

// The salt rounds used by bcrypt to hash passwords
const saltRounds = 10;
const password = "Waheguru1322";

// Function that asynchronously hashes the password
const getHashedPassword = async () => {
    return await bcrypt.hash(password, saltRounds);
};

// Use an async function to handle the route
app.get('/', async (req, res) => {
    try {
        const hashedPassword = await getHashedPassword();
        res.send(`Hashed password: ${hashedPassword}`);
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).send('Error hashing password');
    }
});

const port = 4000;
app.listen(port, () => console.log(`Server running on port ${port}`));
