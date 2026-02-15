const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// GET /api/categories — All categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/categories — Create category
router.post('/', async (req, res) => {
    try {
        const category = await Category.create(req.body);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/categories/:id — Update category
router.put('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/categories/:id — Delete category
router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
