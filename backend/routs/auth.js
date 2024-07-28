const express = require('express')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const JWT_Secret = process.env.JWT_Secret;

//  Route 1 :Create a user using: POST "/api/auth/createuser". No login Required
router.post('/createuser', [
    body('name', 'enter a valid name').exists(),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password must be atleast 8 characters').isLength({ min: 8 })]
    , async (req, res) => {
        //If there are errors return bad request and errors
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
//  Route 2 :Authenticate a user using: POST "/api/auth/login". No login Required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()]
    , async (req, res) => {
        //If there are errors return bad request and errors
        let success = false;
        const result = validationResult(req);
        try {
            if (!result.isEmpty()) {
                return res.send({ success, errors: result.array() });
            }
            //check wether the email exixts already
            const { email, password } = req.body;
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ success, error: 'User does not exists' })
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            //if false then send error
            if (!passwordCompare) {
                success = false;
                return res.status(400).json({ success, error: 'Credentials are wrong' })
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const authtoken = jwt.sign(data, JWT_Secret);
            success = true;
            // if authentication is done then return auth_token
            // console.log(authtoken);
            success = true;
            res.json({ success, authtoken })
            console.log(user);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error Occured");
        }
    })
// Route 3 :Getting user details: POST "/api/auth/getuser". No login Required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        return res.status(404).send({ error: "User not found" });
      }
      res.send(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error Occurred");
    }
  });
module.exports = router