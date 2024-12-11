function ProductCard({ name, description, price, image, owner }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
      <div className="aspect-w-16 aspect-h-9">
        <img 
          src={image || '/api/placeholder/400/300'} 
          alt={name}
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{description}</p>
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
            ${parseFloat(price).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            Listed by: {owner}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;