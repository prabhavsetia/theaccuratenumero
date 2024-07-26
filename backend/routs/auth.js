const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const JWT_Secret = process.env.JWT_Secret;

//  Route 1 :Create a user using: POST "/api/auth/createuser". No login Required
router.post('/createuser', [
    body('name', 'enter a valid name').exists(),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password must be atleast 8 characters').isLength({ min: 8 })]
    , async (req, res) => {
        //If there are errorsReturn bad request and errors
        let success = false;
        const result = validationResult(req);
        try {
            if (!result.isEmpty()) {
                return res.send({ success, errors: result.array() });
            }
            //check wether the email exixts already
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ success, error: 'User alredy exists' })
            }
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(req.body.password, salt)
            //Create a  new User
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: secPass,
            })
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_Secret);
            // console.log(authtoken);
            success = true;
            res.json({ success, authtoken })

            console.log(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error Occured");
        }
    })
module.exports = router