console.log('Server is starting...');

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Client } = require('pg');
require('dotenv').config(); // Ensure to load .env variables
const path = require('path');

// Initialize the app
const app = express();
app.use(bodyParser.json());

// Route for the root path to serve the login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin-login.html')); // Serve admin-login.html
});

// Serve static files (HTML, CSS, JS, images) from the correct subdirectories
app.use(express.static(path.join(__dirname, 'scripts'))); // Serve JavaScript files from the 'scripts' folder
app.use(express.static(path.join(__dirname, 'styles')));  // Serve CSS files from the 'styles' folder
app.use(express.static(path.join(__dirname)));  // Serve other static files (HTML, images) from the root folder

// PostgreSQL setup
const client = new Client({
    connectionString: process.env.DATABASE_URL, // Use DATABASE_URL from .env file
});
client.connect();

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware for validating JWT token
const validateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // Decode and verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add the user data to the request
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token.' });
    }
};



// Route for creating a new account
app.post('/create-account', async (req, res) => {
    const {
        firstName,
        middleName,
        newUsername,
        age,
        country,
        phoneNumber,
        email,
        newPassword,
    } = req.body;

    try {
        // Check if the username or email already exists
        const existingUser = await client.query('SELECT * FROM admins WHERE username = $1 OR email = $2', [newUsername, email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Username or email already exists!' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Insert the new admin into the database
        await client.query(
            'INSERT INTO admins (first_name, middle_name, username, age, country, phone_number, email, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [firstName, middleName, newUsername, age, country, phoneNumber, email, hashedPassword]
        );

        res.status(200).json({ message: 'Account created successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
});

// Route for logging in
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username exists
        const userResult = await client.query('SELECT * FROM admins WHERE username = $1', [username]);

        if (userResult.rows.length === 0) {
            return res.status(400).json({ message: 'Username or password is incorrect!' });
        }

        const user = userResult.rows[0];

        // Compare password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Username or password is incorrect!' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        // Send token to the frontend
        res.status(200).json({ message: 'Login successful!', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
});

// Route for the admin dashboard (protected)
app.get('/admin/dashboard', validateToken, (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html')); // Serve admin.html
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
