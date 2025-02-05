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
    required: true
  },
  unit_id: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

productSchema.pre('save', async function(next) {
  if (!this.product_id) {
    const lastProduct = await this.constructor.findOne({}, {}, { sort: { product_id: -1 } });
    this.product_id = lastProduct ? lastProduct.product_id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
