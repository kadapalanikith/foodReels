const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const foodpartnerModel = require('../models/foodpartner.model');

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

async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token);

    res.status(200).json({
        message: 'Login successful',
        user: {
            fullName: user.fullName,
            email: user.email,
            _id: user._id
        }
    });
}

function logoutUser(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

async function registerFoodPartner(req, res) {

    const { name, email, password , phone , address , contactName} = req.body;
    const isFoodPartnerAlreadyExist = await foodpartnerModel.findOne({ email });

    if (isFoodPartnerAlreadyExist) {
        return res.status(400).json({ message: 'Food partner already exist' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const foodPartner = await foodpartnerModel.create({
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        contactName
    });

    const token = jwt.sign({ id: foodPartner._id }, process.env.JWT_SECRET);

    res.cookie('token', token)

    res.status(201).json({
        message: 'Food partner created successfully', foodPartner: {
            name: foodPartner.name,
            email: foodPartner.email,
            _id: foodPartner._id,
            address: foodPartner.address,
            phone: foodPartner.phone,
            contactName: foodPartner.contactName
        }
    });

}

async function loginFoodPartner(req, res) {
    const { email, password } = req.body;
    const user = await foodpartnerModel.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: 'Food partner not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token);

    res.status(200).json({
        message: 'Login successful',
        foodPartner: {
            name: user.name,
            email: user.email,
            _id: user._id
        }
    });
}

function logoutFoodPartner(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
}

module.exports = { registerUser, loginUser, logoutUser, registerFoodPartner, loginFoodPartner, logoutFoodPartner };
