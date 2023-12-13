const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const UserModel = require('../models/userModel');

const createTasks = async (req, res) => {
  try {
    const { title, description, deadline, project, assignedTo,status } = req.body;
    const task = await Task.create({
      title,
      description,
      deadline,
      status,
      project,
      assignedTo,
    });
    const projects = await Project.findByIdAndUpdate(
      project,
      { $push: { tasks: task._id } },
      { new: true }
    );
    // const userTasks = await Task.find({ assignedTo: assignedTo });
      // console.log(userTasks)

      const user = await UserModel.findByIdAndUpdate(
        assignedTo,
        { $push: { assignedTasks: task._id } },
        { new: true }
      );
    res.status(201).json(task);
    console.log("project for task updated".bgGreen+projects)
  } catch (error) {
    res.status(500).json({ error: 'Error creating task' });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task' });
  }
};
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updateFields = req.body; 
    console.log(taskId)
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateFields, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // const user = await UserModel.findByIdAndUpdate(
    //   assignedTo,
    //   { $push: { assignedTasks: updatedTask._id } },
    //   { new: true }
    // );

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
};
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);
    
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findOneAndUpdate(
      { tasks: taskId },
      { $pull: { tasks: taskId } },
      { new: true }
    );

    const user = await UserModel.findOneAndUpdate(
      { assignedTasks: taskId },
      { $pull: { assignedTasks: taskId } },
      { new: true }
    );

    res.status(200).json({
      message: 'Task deleted successfully',
      project,
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
};



module.exports = {
  createTasks,
  getAllTasks,
  updateTask,
  deleteTask,
  getTaskById,
};
