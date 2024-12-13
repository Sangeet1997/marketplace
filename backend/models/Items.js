const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  owner: { type: String, required: true },
  status: { type: String, enum: ['available', 'sold'], default: 'available' },
  tag: { 
    type: String, 
    enum: ['Sedan', 'SUV', 'Hatchback', 'Coupe', 'Convertible', 'Truck', 'Minivan', 'Wagon'], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
