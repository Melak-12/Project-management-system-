
const Project = require('../models/projectModel');

// Controller methods for Project
const createProject = async (req, res) => {
  try {
    const { name, description ,progress,deadline} = req.body;
    const project = await Project.create({ name, description,progress,deadline });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error creating project' });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching projects' });
  }
};
const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updateFields = req.body; 
    console.log(projectId)
    const updatedProject = await Project.findByIdAndUpdate(projectId, updateFields, {
      new: true, 
      runValidators: true, 
    });

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // const user = await UserModel.findByIdAndUpdate(
    //   assignedTo,
    //   { $push: { assignedTasks: updatedProject._id } },
    //   { new: true }
    // );

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Error updating task' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching project' });
  }
};


module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
updateProject,
};
