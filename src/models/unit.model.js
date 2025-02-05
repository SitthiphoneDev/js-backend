const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  unit_id: {
    type: Number,
    required: true,
    unique: true
  },
  unit_name: {
    type: String,
    required: true,
    maxLength: 50
  }
}, {
  timestamps: true
});

unitSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastDoc = await this.constructor.findOne({}, {}, { sort: { 'unit_id': -1 } });
    this.unit_id = lastDoc ? lastDoc.unit_id + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Unit', unitSchema);
