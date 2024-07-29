const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');
const router = express.Router();

// Route 1 :Get all contacts : GET "/api/contacts/fetchallcontacts". login Required
router.get('/fetchallcontacts', async (req, res) => {
    try {
        const contacts = await Contact.find({})
        res.json(contacts)
    } catch (error) {
        console.error('Error fetching contacts:', error.message); // Log any error
        res.status(500).send("Internal Server Error Occurred");
    }
})
// Route 2 :Add a contacts : POST "/api/contacts/addingcontact". No login Required
router.post('/addingcontact', [
    body('name', 'Name Cannot be empty').exists(),
    body('email', 'enter a valid email').exists().isEmail(),
    body('phone', 'phone Cannot be empty').exists().isNumeric(),
    body('message')
], async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const contacts = new Contact({
            name, email, phone, message
        })
        const savedContact = await contacts.save()
        res.send(savedContact);
    } catch (error) {
        console.error('Error fetching contacts:', error.message); // Log any error
        res.status(500).send("Internal Server Error Occurred");
    }
})
// Route 3 :Edit a contact info : PUT "/api/contacts/editcontact". login Required
router.put('/editcontact/:id', fetchuser,[
    body('name', 'Name Cannot be empty').exists(),
    body('email', 'enter a valid email').exists().isEmail(),
    body('phone', 'phone Cannot be empty').exists().isString(),
    body('message')
], async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const editedContact = {}
        if(name){editedContact.name = name}
        if(email){editedContact.email = email}
        if(phone){editedContact.phone = phone}
        if(message){editedContact.message = message}

        const contact = await Contact.findById(req.params.id)
        if(!contact){
            return res.status(404).send("Contact not found");
        }
        const saveEditedContact = await Contact.findByIdAndUpdate(req.params.id, {$set:editedContact},{new:true});
        res.send(saveEditedContact);
    } catch (error) {
        console.error('Error fetching contacts:', error.message); // Log any error
        res.status(500).send("Internal Server Error Occurred");
    }
})
// Route 4 :Delete a contact info : PUT "/api/contacts/deletecontact". login Required
router.delete('/deletecontact/:id', async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const contact = await Contact.findById(req.params.id)
        if(!contact){
            return res.status(404).send("Contact not found");
        }
        const deleteEditedContact = await Contact.findByIdAndDelete(req.params.id);
        res.send("Contact deleted successfully");
    } catch (error) {
        console.error('Error fetching contacts:', error.message); // Log any error
        res.status(500).send("Internal Server Error Occurred");
    }
})

module.exports = router