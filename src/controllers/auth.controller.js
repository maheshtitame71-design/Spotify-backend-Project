// logic of usermodel api (register)
const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerUser(req, res) {

  const { username, email, password, role = "user" } = req.body;

  // checking if user already exists in database
  const isUserAlreadyExists = await userModel.findOne({
    $or: [
      { username },
      { email }
    ]
  })


  if (isUserAlreadyExists) {
    return res.status(409).json({ message: 'user already exists' });
  }

  // hashing password
  const hash = await bcrypt.hash(password, 10)



  const user = await userModel.create({
    username,
    email,
    password: hash,
    role
  })


  // creating token 
  const token = jwt.sign({
    id: user._id,
    role: user.role,
  }, process.env.JWT_SECRET)

  // saving token in cookie
  res.cookie('token', token);

  res.status(201).json({
    message: 'user created Successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role

    }
  })

}

async function loginUser(req, res) {

  const { username, email, password } = req.body

  const user = await userModel.findOne({
    $or: [
      { username },
      { email }
    ]
  })
    .select('+password');

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" })
  }


  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' })
  }

  const token = jwt.sign({
    id: user._id,
    role: user.role,
  }, process.env.JWT_SECRET)


  console.log(typeof token);
  console.log("Generated token:", token);
  res.cookie("token", token)

  res.status(200).json({
    message: 'user logged in Successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    }
  })
}

async function logoutUser(req,res) {
  res.clearCookie('token');
  res.status(200).json({
    message:"User logged out Successfully"
  })
}


module.exports = { registerUser, loginUser, logoutUser }