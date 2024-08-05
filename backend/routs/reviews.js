const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Reviews = require('../models/Reviews');
const User = require('../models/User');
const Services = require('../models/Services');
// Route 1: Get Reviews using GET "/api/auth/getreviews". NO Login required
router.get('/getreviews', async (req, res) => {
    let success = false;
    const result = validationResult(req);
    try {
        // If there are validation errors, return them
        if (!result.isEmpty()) {
            return res.send({ success, errors: result.array() });
        }
        const reviews = await Reviews.find({})
        success = true
        res.json({ success, reviews })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error Occurred");
    }
});

// Route 2: Add a Review using POST "/api/auth/addreview". Login required
router.post('/addreview', fetchuser, [
    body('servicename', 'Field cannot be empty'),
    body('stars', 'Min-1 and max-5').isInt({ min: 1, max: 5 }),
    body('message', 'Please enter comments').exists(),],
    async (req, res) => {
        let success = false;
        const result = validationResult(req);
        try {
            // If there are validation errors, return them
            if (!result.isEmpty()) {
                return res.send({ success, errors: result.array() });
            }
            const { servicename, message, stars } = req.body
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
                stars: stars,
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
// Route 2: Edit a Review using PUT "/api/auth/editreview".Login required
router.put('/editreview/:id', fetchuser, [
    body('servicename', 'Field cannot be empty'),
    body('stars', 'Min-1 and max-5').isInt({ min: 1, max: 5 }),
    body('message', 'Please enter comments').exists(),],
    async (req, res) => {
        let success = false;
        const result = validationResult(req);
        const { servicename, message } = req.body;
        // If there are validation errors, return them
        if (!result.isEmpty()) {
            return res.send({ success, errors: result.array() });
        }
        try {
            const { servicename, message, stars } = req.body;
            const userId = req.user.id;

            let user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const service = await Services.findOne({ servicename: servicename });
            if (!service) {
                return res.status(400).send('Invalid service name');
            }

            const newEditedReview = {
                name: user.name,
                email: user.email,
                message: message,
                stars: stars,
                servicename: servicename
            };

            let review = await Reviews.findById(req.params.id);
            if (!review) {
                return res.status(404).json({ success, message: "Review not found" });
            }

            review = await Reviews.findByIdAndUpdate(req.params.id, { $set: newEditedReview }, { new: true });
            success = true;
            res.json({ success, review });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error Occurred");
        }
    });
// Route 2: Delete a Review using DELETE "/api/auth/deletereview". Login required
router.delete('/deletereview/:id', fetchuser, async (req, res) => {
    let success = false;
    const result = validationResult(req);
    try {
        // If there are validation errors, return them
        if (!result.isEmpty()) {
            return res.send({ success, errors: result.array() });
        }
        let dltreview = await Reviews.findById(req.params.id)
        if (!dltreview) {
            res.json({ success, message: "Review not found" });
        }
        dltreview = await Reviews.findByIdAndDelete(req.params.id)
        success = true;
        res.json({ success, message: "Deleted Successfully" })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error Occurred");
    }
});

module.exports = router