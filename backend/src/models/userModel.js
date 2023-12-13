const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'user'], 
    default: 'user',
  },
  assignedTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task', 
    },
  ],
  completedTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task', 
    },
  ],
  team: {
    type: String,
    default: 'Team1',
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
