// to create api

const express = require('express');
const authController = require('../controllers/auth.controller')

const router = express.Router()


//api 

// registration of user
router.post('/register',authController.registerUser);

// login of user
router.post('/login',authController.loginUser);

// logout of User
router.post('/logout',authController.logoutUser);

module.exports = router;
