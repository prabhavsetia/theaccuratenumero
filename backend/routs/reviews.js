const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Reviews = require('../models/Reviews');
const User = require('../models/User');
const Services = require('../models/Services');
// Route 1: Get Reviews using GET "/api/auth/getreviews". NO Login required
router.get('/getuser', async (req, res) => {
    let success = false;
    const result = validationResult(req);
    try {
        const Reviews = await Reviews.find({})
        success = true
        res.json({ success, Reviews })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error Occurred");
    }
});

// Route 2: Add a Review using POST "/api/auth/addreview". NO Login required
router.post('/addreview', fetchuser, [
    body('username', 'Field cannot be empty'),
    body('email', 'Point number1'),
    body('servicename', 'Field cannot be empty'),
    body('message', 'Please enter comments').exists(),],
    async (req, res) => {
        let success = false;
        const result = validationResult(req);
        try {
            // If there are validation errors, return them
            if (!result.isEmpty()) {
                return res.send({ success, errors: result.array() });
            }
            const { servicename, message } = req.body
            const userId = req.user.id;
            if (userId) {
                const user = await User.findById(userId);
                username = user.name;
                useremail = user.email;
            } else {
                return res.status(404).json({ error: "User not found" });
            }
            const service = await Services.findOne({ servicename: servicename });
            if (!service) {
                return res.status(400).send('Invalid service name');
            }
            const newReview = new Reviews({
                name: username,
                email: useremail,
                servicename: servicename,
                message: message,
                user: User.name ? User._id : null
            })
            const saveReview = await newReview.save();
            success = true;
            res.json({ success, saveReview })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error Occurred");
        }
    });

module.exports = router