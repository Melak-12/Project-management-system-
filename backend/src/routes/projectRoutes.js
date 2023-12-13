// projectRoutes.js

const express = require('express');
const router = express.Router();
const { createProject, getAllProjects, getProjectById, updateProject } = require('../controllers/projectController');

router.post('/create', createProject);
router.get('/', getAllProjects);
router.get('/:projectId', getProjectById);
router.put('/:projectId', updateProject);

module.exports = router;
