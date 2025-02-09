const Unit = require('../models/unit.model');

const unitController = {
    create: async (req, res) => {
        try {
            const data = req.body;
            let result;

            if (Array.isArray(data)) {
                // Sequential creation to avoid duplicate IDs
                result = [];
                for (const item of data) {
                    const lastUnit = await Unit.findOne({}, {}, { sort: { unit_id: -1 } });
                    const unit_id = lastUnit ? lastUnit.unit_id + 1 : 1;
                    const unit = await Unit.create({ ...item, unit_id });
                    result.push(unit);
                }
            } else {
                const lastUnit = await Unit.findOne({}, {}, { sort: { unit_id: -1 } });
                const unit_id = lastUnit ? lastUnit.unit_id + 1 : 1;
                result = await Unit.create({ ...data, unit_id });
            }

            res.status(201).json({
                message: 'Unit created successfully',
                result
            });
        } catch (error) {
            console.error('Error creating unit:', error);
            res.status(500).json({ error: 'Error creating unit' });
        }
    },

    getAll: async (req, res) => {
        try {
            const units = await Unit.find()
                .sort({ createdAt: -1 });
            res.json(units);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching units' });
        }
    },

    getOne: async (req, res) => {
        try {
            const unit = await Unit.findOne({ unit_id: req.params.id });

            if (!unit) {
                return res.status(404).json({ error: 'Unit not found' });
            }

            res.json(unit);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching unit' });
        }
    },

    update: async (req, res) => {
        try {
            const unit = await Unit.findOneAndUpdate(
                { unit_id: req.params.id },
                req.body,
                { new: true }
            );

            if (!unit) {
                return res.status(404).json({ error: 'Unit not found' });
            }

            res.json(unit);
        } catch (error) {
            res.status(500).json({ error: 'Error updating unit' });
        }
    },

    delete: async (req, res) => {
        try {
            // First check if unit exists
            const unitExists = await Unit.findOne({ unit_id: req.params.id });
            if (!unitExists) {
                return res.status(404).json({ 
                    error: `Unit ID ${req.params.id} not found` 
                });
            }
    
            // Check if any products are using this unit
            const productsUsingUnit = await Product.findOne({ unit_id: req.params.id });
            if (productsUsingUnit) {
                return res.status(400).json({ 
                    error: `Cannot delete unit ID ${req.params.id}. This unit is currently in use by products.`
                });
            }
    
            // If no products are using it, proceed with deletion
            await Unit.findOneAndDelete({ unit_id: req.params.id });
            res.status(200).json({ message: 'Unit deleted successfully' });
    
        } catch (error) {
            console.error('Delete unit error:', error);
            res.status(500).json({ 
                error: 'An error occurred while deleting the unit'
            });
        }
    }
};

module.exports = unitController;
