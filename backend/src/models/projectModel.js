const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter project name'],
  },
  description: {
    type: String,
    required: [true, 'Please enter project description'],
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task', 
    },
  ],
  progress: {
    type: Number,
    default: 0,
  },
 deadline:{
  type:Date
 },
  // deadlines: [
  //   {
  //     task: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: 'Task', 
  //     },
  //     deadline: {
  //       type: Date,
  //       // required: true,
  //     },
  //   },
  // ],
  
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
