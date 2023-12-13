const express = require('express');
const {  getAllTasks, getTaskById, createTasks, updateTask, deleteTask,  } = require('../controllers/taskController');
const router = express.Router();

router.post('/create', createTasks);
router.get('/', getAllTasks);
router.get('/:taskId', getTaskById);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);

module.exports = router;


module.exports = router;
