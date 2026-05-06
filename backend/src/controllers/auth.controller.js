const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

async function registerUser(req, res) {

    const { fullName, email, password } = req.body;
    const isUserAlreadyExist = await userModel.findOne({ email });

    if (isUserAlreadyExist) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName,
        email,
        password: hashedPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie('token', token)

    res.status(201).json({
        message: 'User created successfully', user: {
            fullName: user.fullName,
            email: user.email,
            _id: user._id
        }
    });

}



module.exports = {registerUser};
