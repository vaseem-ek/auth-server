const users = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.UserRegistration = async (req, res) => {
    try {
        const { username, email, password, name } = req.body;

        const existing = await users.findOne({ email });
        if (existing) {
            return res.json({ success: false, message: "User already registered" });
        }

        const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if(!email || !regex.test(email.trim())){
            return res.json({success:false,message:"invalid email"})
        }


        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.json({success: false,message: "Password must be at least 8 characters and include numbers and letters"
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
        
        if (!user ) {
            return res.json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.json({ success: true, token, user: { id: user._id, username: user.username, email: user.email, date: user.registrationDate } });

    } catch (error) {
        return res.status(500).json({ success: false, message:"server side error"});
    }
};

exports.GetCurrentUserApi = async (req, res) => {
    try {
        return res.json({ success: true, user: req.user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
