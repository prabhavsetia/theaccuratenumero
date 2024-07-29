const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const JWT_Secret = process.env.JWT_Secret;
const LOGIN_Key = process.env.LOGIN_Key;

// Route 1: Create a user using POST "/api/auth/createuser". No login required
router.post('/createuser', [
    // Validate name, email, and password
    body('name', 'Enter a valid name').exists(),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 8 characters').isLength({ min: 8 }),
    body('key', 'Enter a valid name').exists()],
    async (req, res) => {
        let success = false;
        const result = validationResult(req);
        try {
            // If there are validation errors, return them
            if (!result.isEmpty()) {
                return res.send({ success, errors: result.array() });
            }
            // Get the token from the request body 
            const { key } = req.body;
            if (!key) {
                // If no token is provided, send an unauthorized response
                return res.status(401).send({ error: "Please authenticate using a valid Key" });
            }

            // Compare the key token from the user with the token stored in the environment variable
            if (key !== LOGIN_Key) {
                // If the token doesn't match, send an unauthorized response
                return res.status(401).send({ error: "Invalid Key provided" });
            }
            // Check if a user with the given email already exists
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success, error: 'User already exists' });
            }
            // Generate a salt and hash the password
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt);
            // Create a new user with the provided details
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            });
            // Prepare the payload for the JWT
            const data = { user: { id: user.id } };
            // Sign the JWT with the payload and secret
            const authtoken = jwt.sign(data, JWT_Secret);
            success = true;
            // Return the authentication token
            res.json({ success, authtoken });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error Occurred");
            const key = await req.header('keyword');
            console.log(key);
        }
    });

// Route 2: Authenticate a user using POST "/api/auth/login". No login required
router.post('/login', [
    // Validate email and password
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;
    const result = validationResult(req);
    try {
        // If there are validation errors, return them
        if (!result.isEmpty()) {
            return res.send({ success, errors: result.array() });
        }
        const { email, password } = req.body;
        // Check if the user with the given email exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: 'User does not exist' });
        }
        // Compare the provided password with the hashed password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: 'Invalid credentials' });
        }
        // Prepare the payload for the JWT
        const data = { user: { id: user.id } };
        // Sign the JWT with the payload and secret
        const authtoken = jwt.sign(data, JWT_Secret);
        success = true;
        // Return the authentication token
        res.json({ success, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error Occurred");
    }
});

// Route 3: Get user details using POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        // Fetch user ID from the request object set by fetchuser middleware
        const userId = req.user.id;
        // Find user by ID and exclude the password field
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Return user details
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error Occurred");
    }
});

module.exports = router;
