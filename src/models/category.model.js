const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  category_id: Number,
  category_name: {
    type: String,
    required: true,
    maxLength: 50
  }
}, {
  timestamps: true
});

// Auto-increment setup
categorySchema.pre('save', async function(next) {
  if (!this.category_id) {
    const lastCategory = await this.constructor.findOne({}, {}, { sort: { category_id: -1 } });
    this.category_id = lastCategory ? lastCategory.category_id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
