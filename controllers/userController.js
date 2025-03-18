const users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator=require('validator')



exports.UserRegistration = async (req, res) => {
    try {
        const { username, email, password, name } = req.body;

        const existing = await users.findOne({ email });
        if (existing) {
            return res.json({ success: false, message: "User already registered" });
        }

        if (!email || !validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email address" });
        }

        const passwordRegex = /^[A-Za-z,1-9]{8,}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long and include 1 uppercase, 1 lowercase, 1 number"
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new users({
            username,
            email,
            password: hashedPassword,
            name,
            registrationDate: Date.now()
        });

        await user.save();

        return res.status(201).json({ success: true, message: "User registered successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


exports.UserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await users.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        return res.json({ success: true, token, user: { id: user._id, username: user.username, email: user.email,date:user.registrationDate } });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.GetCurrentUserApi = async (req, res) => {
    try {
        const token=req.header.token

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
