const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const unitRoutes = require('./routes/unit.routes');

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/units', unitRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Products API" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
