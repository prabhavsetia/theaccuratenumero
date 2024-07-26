const mongoose = require('mongoose')

const mongoURI = 'mongodb://localhost:27017/'

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,).then((res) => {
        console.log("Database connected");
      }).catch(error => {
         console.log(error);
       })
}

module.exports = connectToMongo;