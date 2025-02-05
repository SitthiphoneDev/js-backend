const { Product, Category, Unit } = require('../models');

const productController = {
    create: async (req, res) => {
        try {
            const data = req.body;
            let result;

            const lastProduct = await Product.findOne({}, {}, { sort: { product_id: -1 } });
            let nextProductId = lastProduct ? lastProduct.product_id + 1 : 1;

            if (Array.isArray(data)) {
                result = await Promise.all(data.map(async (item) => {
                    const product = await Product.create({
                        ...item,
                        product_id: nextProductId++
                    });
                    const [category, unit] = await Promise.all([
                        Category.findOne({ category_id: item.category_id }),
                        Unit.findOne({ unit_id: item.unit_id })
                    ]);
                    return { ...product.toObject(), category, unit };
                }));
            } else {
                const product = await Product.create({
                    ...data,
                    product_id: nextProductId
                });
                const [category, unit] = await Promise.all([
                    Category.findOne({ category_id: data.category_id }),
                    Unit.findOne({ unit_id: data.unit_id })
                ]);
                result = { ...product.toObject(), category, unit };
            }

            res.status(201).json({
                message: 'Product created successfully',
                result
            });
        } catch (error) {
            console.error('Error creating product:', error);
            res.status(500).json({ error: 'Error creating product' });
        }
    },

    getAll: async (req, res) => {
        try {
            const products = await Product.find();
            const populatedProducts = await Promise.all(products.map(async (product) => {
                const [category, unit] = await Promise.all([
                    Category.findOne({ category_id: product.category_id }),
                    Unit.findOne({ unit_id: product.unit_id })
                ]);
                return { ...product.toObject(), category, unit };
            }).sort);
            res.json(populatedProducts);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching products' });
        }
    },

    getOne: async (req, res) => {
        try {
            const product = await Product.findOne({ product_id: req.params.id });
            if (!product) return res.status(404).json({ error: 'Product not found' });

            const [category, unit] = await Promise.all([
                Category.findOne({ category_id: product.category_id }),
                Unit.findOne({ unit_id: product.unit_id })
            ]);

            res.json({ ...product.toObject(), category, unit });
        } catch (error) {
            res.status(500).json({ error: 'Error fetching product' });
        }
    },

    update: async (req, res) => {
        try {
            const product = await Product.findOneAndUpdate(
                { product_id: req.params.id },
                req.body,
                { new: true }
            );
            if (!product) return res.status(404).json({ error: 'Product not found' });

            const [category, unit] = await Promise.all([
                Category.findOne({ category_id: product.category_id }),
                Unit.findOne({ unit_id: product.unit_id })
            ]);

            res.json({ ...product.toObject(), category, unit });
        } catch (error) {
            res.status(500).json({ error: 'Error updating product' });
        }
    },
    delete: async (req, res) => {
        try {
            const result = await Product.findOneAndDelete({ product_id: req.params.id });
            
            if (!result) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Error deleting product' });
        }
    }
};

module.exports = productController;
