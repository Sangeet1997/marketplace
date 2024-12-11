import React, { useState } from 'react';
import axios from 'axios';
import Resizer from 'react-image-file-resizer';

function AddItemForm({owner}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Resizer.imageFileResizer(
        file,
        700,
        700,
        'JPEG',
        80,
        0,
        (uri) => {
          setFormData({ ...formData, image: uri });
          setImagePreview(uri);
        },
        'base64'
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemData = { ...formData, owner};
      console.log(itemData);
      const response = await axios.post('http://localhost:3000/v1/items/', itemData);
      console.log(response.data);
    } catch (err) {
      console.error(err);
      alert('Error adding item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows="4"
        />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium mb-1">Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-1">Image:</label>
        <input 
          type="file" 
          name="image" 
          accept="image/*" 
          onChange={handleImageUpload}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {imagePreview && (
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="mt-2 w-24 h-24 object-cover rounded-md"
          />
        )}
      </div>
      <button 
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Add Item
      </button>
    </form>
  );
}

export default AddItemForm;