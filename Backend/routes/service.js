const express = require('express');
const router = express.Router();
const Task = require('../models/task'); 

// GET all tasks with filtering and searching
router.get('/', async (req, res) => {
    try {
        const { status, priority, search } = req.query;
        let filter = {};

        // 1. Status Filter
        if (status && status !== 'All') {
            filter.status = status;
        }

        // 2. Priority Filter
        if (priority && priority !== 'All') {
            filter.priority = priority;
        }
        
        // 3. Search Filter (Title or Description)
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } }, 
                { description: { $regex: search, $options: 'i' } } 
            ];
        }

        const tasks = await Task.find(filter).sort({ createdAt: -1 });
        res.json(tasks);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// POST a new task (manual or after voice parsing confirmation)
router.post('/', async (req, res) => {
    const task = new Task(req.body);
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update an existing task
router.put('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            req.body,
            { new: true, runValidators: true } 
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(updatedTask);
    } catch (err) {
        console.error("Task Update Error:", err.message);
        res.status(400).json({ message: err.message });
    }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        
        if (!deletedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error("Task Deletion Error:", err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;