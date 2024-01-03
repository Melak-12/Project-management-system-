const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const colors = require('colors');

const User = require('../models/userModel');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password,isAdmin } = req.body;

    if (!name || !email || !password) {
        res.status(400).json({ msg: "Please fill all fields!" });
        return;
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
        res.status(400).json({ msg: "User already exists!" });
        return;
    }

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    //  isAdmin = email === "admin.pms@gmail.com";
    // isAdmin==true?
    console.log("is admin :", isAdmin)
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'admin',
        assignedTasks: [],
        completedTasks: [],
        team: ' Team1',
        isAdmin:isAdmin
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
            role: 'user',
            assignedTasks: [],
            completedTasks: [],
            team: ' Team1',

        });
    } else {
        res.status(400).json({ msg: 'Invalid user data!' });
    }
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ msg: "Fill all fields!" });
        return;
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            isAdmin: user.isAdmin,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ msg: "Email or password incorrect!" });
    }
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "40d" });
};

const getMe = asyncHandler(async (req, res) => {
    const { email } = req.query;

    if (!email) {
        const users = await User.find();
        res.status(200).json(users);
    } else {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    }
});
const assignTasks = asyncHandler(async (req, res) => {
    const { userId, taskId } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { assignedTasks: taskId } },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Task assigned successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Error assigning task' });
    }
});

module.exports = {
    registerUser,
    login,
    getMe,
    assignTasks
};
