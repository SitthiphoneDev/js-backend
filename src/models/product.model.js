const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_id: Number,
    product_name: {
        type: String,
        required: true,
        maxLength: 100
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sale_price: {
        type: Number,
        required: true
    },
    category_id: {
        type: Number,
        required: true,
        ref: 'Category',
        ref: 'Category',
        validate: {
            validator: async function(value) {
                const category = await mongoose.model('Category').findOne({ category_id: value });
                return category ? true : false;
            },
            message: 'Category does not exist'
        }
    },
    unit_id: {
        type: Number,
        required: true,
        ref: 'Unit',
        validate: {
            validator: async function(value) {
                const unit = await mongoose.model('Unit').findOne({ unit_id: value });
                return unit ? true : false;
            },
            message: props => `Unit ID ${props.value} does not exist`
        }
    }
}, {
    timestamps: true
});

productSchema.pre('save', async function (next) {
    if (!this.product_id) {
        const lastProduct = await this.constructor.findOne({}, {}, { sort: { product_id: -1 } });
        this.product_id = lastProduct ? lastProduct.product_id + 1 : 1;
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
