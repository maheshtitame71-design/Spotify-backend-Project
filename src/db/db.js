const mongoose = require('mongoose');
const { connect } = require('../app');


async function connectDB() {
  try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MONGODB Database connected Successfully!');
  }
  catch(error){
    console.error('MongoDB connection Failed:',error);
  }
}




module.exports = connectDB;
