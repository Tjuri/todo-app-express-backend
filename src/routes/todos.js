const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// GET All
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos)
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

// GET Single by ID
router.get('/:id', getTodoMiddleware, (req, res) => {
    res.send(res.todo);
});

// POST Single
router.post('/', async (req, res) => {
    const todo = new Todo({
        title: req.body.title,
        description: req.body.description || null,
    });
    try {
        const newTodo = await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
});

// PATCH Single by ID
router.patch('/:id', getTodoMiddleware, async (req, res) => {
    const body = req.body;
    if (body.title != null) {
        res.todo.title = body.title;
    }
    if(body.description != null) {
        res.todo.description = body.description;
    }
    try {
        const updatedTodo = await res.todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message});
    }
});

// DELETE Single by ID
router.delete('/:id', getTodoMiddleware, async (req, res) => {
    try {
        await res.todo.remove();
        res.json({message: 'Deleted Subscriber'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});

/**
 * MIDDLEWARE Function
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*|Promise<any>>}
 */
async function getTodoMiddleware(req, res, next) {
    let todo;
    try {
        todo = await Todo.findById(req.params.id);
        if (todo == null) {
            return res.status(404).json({message: 'Cannot find todo'});
        } else {
            res.todo = todo;
        }
    } catch (err) {
        return res.status(500).json({message: err.message});
    }

    next();
}

module.exports = router;