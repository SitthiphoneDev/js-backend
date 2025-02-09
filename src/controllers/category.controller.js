const { Category } = require('../models');

const categoryController = {
    create: async (req, res) => {
        try {
            const data = req.body;
            let result;

            if (Array.isArray(data)) {
                const lastCategory = await Category.findOne({}, {}, { sort: { category_id: -1 } });
                let nextId = lastCategory ? lastCategory.category_id + 1 : 1;

                result = await Promise.all(data.map(async (item) => {
                    return Category.create({ ...item, category_id: nextId++ });
                }));
            } else {
                const lastCategory = await Category.findOne({}, {}, { sort: { category_id: -1 } });
                const category_id = lastCategory ? lastCategory.category_id + 1 : 1;
                result = await Category.create({ ...data, category_id });
            }

            res.status(201).json({
                message: 'Category created successfully',
                result
            });
        } catch (error) {
            console.error('Error creating category:', error);
            res.status(500).json({ error: 'Error creating category' });
        }
    },

    getAll: async (req, res) => {
        try {
            const categories = await Category.find().sort({ createdAt: -1 });
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching categories' });
        }
    },

    getOne: async (req, res) => {
        try {
            const category = await Category.findOne({ category_id: req.params.id });
            if (!category) return res.status(404).json({ error: 'Category not found' });
            res.json(category);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching category' });
        }
    },

    update: async (req, res) => {
        try {
            const category = await Category.findOneAndUpdate(
                { category_id: req.params.id },
                req.body,
                { new: true }
            );
            if (!category) return res.status(404).json({ error: 'Category not found' });
            res.json({ message: 'Category updated successfully', result: category });
        } catch (error) {
            res.status(500).json({ error: 'Error updating category' });
        }
    },

    delete: async (req, res) => {
        try {
            // First check if category exists
            const categoryExists = await Category.findOne({ category_id: req.params.id });
            if (!categoryExists) {
                return res.status(404).json({ 
                    error: `Category ID ${req.params.id} not found` 
                });
            }
    
            // Then check if any products are using this category
            const productsUsingCategory = await Product.findOne({ category_id: req.params.id });
            if (productsUsingCategory) {
                return res.status(400).json({ 
                    error: `Cannot delete category ID ${req.params.id}. This category is currently in use by products.`
                });
            }
    
            // If no products are using it, proceed with deletion
            await Category.findOneAndDelete({ category_id: req.params.id });
            res.status(200).json({ message: 'Category deleted successfully' });
    
        } catch (error) {
            console.error('Delete category error:', error);
            res.status(500).json({ 
                error: 'An error occurred while deleting the category'
            });
        }
    }
};

module.exports = categoryController;
