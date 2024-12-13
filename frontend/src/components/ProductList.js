import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Search } from 'lucide-react';
import ProductCard from './ProductCard.js';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tags = [
    'Sedan',
    'SUV',
    'Hatchback',
    'Coupe',
    'Convertible',
    'Truck',
    'Minivan',
    'Wagon'
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/v1/items');
        setProducts(response.data);
        setFilteredProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on both tag and search query
    let result = products;

    // Filter by tag if a tag is selected
    if (selectedTag) {
      result = result.filter((product) => product.tag === selectedTag);
    }

    // Filter by search query
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      result = result.filter((product) => 
        product.name.toLowerCase().includes(lowercaseQuery) || 
        product.description.toLowerCase().includes(lowercaseQuery)
      );
    }

    setFilteredProducts(result);
  }, [selectedTag, searchQuery, products]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <ShoppingBag className="w-6 h-6" />
        Available Products
      </h2>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search products by name or description..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tag Filters */}
      <div className="flex flex-wrap gap-4 mt-4">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${
              selectedTag === tag
                ? 'bg-blue-500 text-white border-blue-500 dark:bg-blue-600 dark:border-blue-600'
                : 'bg-gray-200 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || selectedTag 
              ? "No products match your search or filter" 
              : "No products available"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              description={product.description}
              price={product.price}
              image={product.image}
              owner={product.owner}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;