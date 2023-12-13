const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter task title'],
  },
  description: {
    type: String,
    required: [true, 'Please enter task description'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  deadline: {
    type: Date,
    // required: [true, 'Please enter task deadline'],
  },
  status: {
    type: String,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    // required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
