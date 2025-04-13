const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
    try {
        const {
            name,
            email,
            phoneNumber,
            password,
            gender,
            dateOfBirth,
        } = req.body;

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const phoneRegex = /^[0-9]{10}$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ message: 'Invalid phone number format. Phone number should have 10 digits' });
        }

        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { phoneNumber: phoneNumber }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User with given email or phone number already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            phoneNumber,
            password: hashedPassword,
            gender,
            dateOfBirth
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, 'saikh', { expiresIn: '2day' });

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updates = req.body;

        if (!Object.keys(updates).length) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const user = await User.findByIdAndUpdate(userId, updates, { new: true });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const user = await User.find();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ allUsers: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};