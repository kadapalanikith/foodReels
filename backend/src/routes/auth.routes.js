const express = require('express');
const { registerUser,loginUser } = require('../controllers/auth.controller');

const router = express.Router();



router.post('/user/register', registerUser)
routes.post('/user/login', loginUser)

module.exports = router;