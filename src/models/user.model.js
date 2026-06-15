const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username:{
    type : String,
    required : true,
    unique : true,
    milength : 3,
    maxlength : 20,
    trim : true,
  },
  email:{
    type : String,
    required : true,
    unique : true,
    lowercase : true,
    trim : true,
  },
  password:{
    type : String,
    required : true,
    minlength : 6,
  },
  role:{
    type : String,
    enum : ['user','artist'],
    default : 'user',
  }
})

const userModel = mongoose.model('user',userSchema);

module.exports = userModel;
