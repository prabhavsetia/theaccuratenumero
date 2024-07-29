const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Services = require('../models/Services');
const router = express.Router();

// Route 1 :Get all services : GET "/api/services/fetchallservices". No login Required
router.get('/fetchallservices', async (req, res) => {
    try {
        const services = await Services.find({})
        res.json(services)
    } catch (error) {
        console.error('Error fetching services:', error.message); // Log any error
        res.status(500).send("Internal Server Error Occurred");
    }
})
// Route 2 :Add a service : POST "/api/services/addservice". No login Required
router.post('/addservice', fetchuser, [
    body('service', 'Field cannot be empty').exists(),
    body('description', 'Field cannot be empty').exists(),
    body('p1', 'Point number1'),
    body('p2', 'Point number2'),
    body('p3', 'Point number3'),
    body('p4', 'Point number4'),
    body('p5', 'Point number5'),
    body('p6', 'Point number6'),
    body('price', 'Field cannot be empty').exists(),
],
    async (req, res) => {
        try {
            const { service, description, p1, p2, p3, p4, p5, p6, price } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const services = new Services({
                service, description, p1, p2, p3, p4, p5, p6, price
            })
            const savedServices = await services.save();
            res.json(savedServices)
        } catch (error) {
            console.error('Error fetching blogs:', error.message); // Log any error
            res.status(500).send("Internal Server Error Occurred");
        }
    })
// Route 3 :Update a service : PUT "/api/services/updateservice". No login Required
router.put('/updateservice/:id', fetchuser, [
    body('service', 'Field cannot be empty').exists(),
    body('description', 'Field cannot be empty').exists(),
    body('p1', 'Point number1').optional(),
    body('p2', 'Point number2').optional(),
    body('p3', 'Point number3').optional(),
    body('p4', 'Point number4').optional(),
    body('p5', 'Point number5').optional(),
    body('p6', 'Point number6').optional(),
    body('price', 'Price must be a number and cannot be empty').isNumeric().exists(),
],
    async (req, res) => {
        try {
            const { service, description, p1, p2, p3, p4, p5, p6, price } = req.body
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const editedService = {};
            if (service) { editedService.service = service }
            if (description) { editedService.description = description }
            if (p1) { editedService.p1 = p1 }
            if (p2) { editedService.p2 = p2 }
            if (p3) { editedService.p3 = p3 }
            if (p4) { editedService.p4 = p4 }
            if (p5) { editedService.p5 = p5 }
            if (p6) { editedService.p6 = p6 }
            if (price) { editedService.price = price }

            let services = await Services.findById(req.params.id);
            if (!services) {
                res.status(500).send("Service not found");
            }
            services = await Services.findByIdAndUpdate(req.params.id, { $set: editedService }, { new: true })
            res.json(services);
        } catch (error) {
            console.error('Error fetching blogs:', error.message); // Log any error
            res.status(500).send("Internal Server Error Occurred");
        }
    })

// Route 5 :Delete a service for everyone: Delete "/api/services/deleteservice". login Required
router.delete('/deleteservice/:id', fetchuser, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let service = await Services.findById(req.params.id);
        if (!service) {
            return res.status(404).send("Service not found");
        }

        service = await Services.findByIdAndDelete(req.params.id);
        res.status(200).send("Service deleted successfully");
    } catch (error) {
        console.error('Error deleting Service:', error.message); // Log any error
        res.status(500).send("Internal Server Error Occurred");
    }
})
module.exports = router;