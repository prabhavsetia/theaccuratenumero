const connectToMongo = require('./db')
const express = require('express')

// Load environment variables from .env file
require('dotenv').config();

connectToMongo();
const app = express()
const port = 3000

app.use(express.json());
// Available Routs
app.get('/', (req, res) => {
  res.send('Backend Started...')
})
app.use('/api/auth',require('./routs/auth'))
app.use('/api/blog',require('./routs/blog'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})