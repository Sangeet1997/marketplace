import React, { useState } from 'react';
import axios from 'axios';
function ProductCard({
  id,
  name, 
  description, 
  price, 
  image, 
  owner, 
  fullDescription, 
  specifications,
  stock
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBuy = async () => {
    // Implement buy logic here
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to buy items');
      return;
    }

    try {
      // console.log(token)
      // console.log(id)
      await axios.post('http://localhost:3000/v1/auth/user/buy-item', { 
        itemId: id 
      },  {
        headers: { 'x-auth-token': token },
      });

      await axios.put(`http://localhost:3000/v1/items/${id}`, 
        { status: 'sold' },
        { headers: { 'x-auth-token': token }}
      );
      const confirmationDiv = document.createElement('div');
      confirmationDiv.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl z-50 text-center';
      confirmationDiv.innerHTML = `
        <h3 class="text-lg font-semibold mb-4 dark:text-white">Purchase Successful!</h3>
        <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">OK</button>
      `;
      document.body.appendChild(confirmationDiv);
      
      const okButton = confirmationDiv.querySelector('button');
      okButton.onclick = () => {
        document.body.removeChild(confirmationDiv);
        window.location.reload();
      };
    } catch (err) {
      console.error('Error making purchase:', err);
      alert('Failed to complete purchase. Please try again.');
    }
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Product Card */}
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
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                ${parseFloat(price).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Listed by: {owner}
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Modal Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-2 gap-6 p-6">
              {/* Image Column */}
              <div>
                <img 
                  src={image || '/api/placeholder/400/300'} 
                  alt={name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              
              {/* Details Column */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">{name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {fullDescription || description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <p className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                    ${parseFloat(price).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">Listed by: {owner}</p>
                  
                </div>
                
                {specifications && (
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Specifications:</h4>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300">
                      {specifications.map((spec, index) => (
                        <li key={index}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute bottom-6 right-6 flex space-x-2">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    onClick={handleBuy}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    {'Buy Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;