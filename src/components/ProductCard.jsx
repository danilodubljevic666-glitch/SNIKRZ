// src/ProductCard.jsx - Ažurirana verzija
import React, { useState } from 'react';
import { ShoppingBag, Heart, Star, Eye } from 'lucide-react';

const ProductCard = ({ 
  product, 
  isFavorite = false, 
  onToggleFavorite,
  formatPrice = (price) => `$${price.toFixed(2)}`
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate discount
  const calculateDiscount = () => {
    if (product.oldPrice) {
      const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
      return `-${discount}%`;
    }
    return null;
  };

  return (
    <div 
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden bg-gray-100">
        {/* Discount Badge */}
        {product.oldPrice && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {calculateDiscount()}
            </span>
          </div>
        )}

        {/* New Badge */}
        {product.tags?.includes('new') && (
          <div className="absolute top-4 left-16 z-10">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              NEW
            </span>
          </div>
        )}

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={onToggleFavorite}
            className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Product Image */}
        <div className="relative h-64 md:h-72">
          <img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Second Image on Hover */}
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
          
          {/* Quick View Overlay */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors duration-200">
              <Eye className="h-5 w-5" />
              Quick View
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Category and Rating */}
        <div className="flex justify-between items-start mb-3">
          <span className="text-sm text-blue-600 font-semibold">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 font-medium">
              {product.rating?.toFixed(1) || '4.5'}
            </span>
            <span className="text-sm text-gray-400">
              ({product.reviews || '128'})
            </span>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Colors Available */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-2 mb-4">
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border-2 border-gray-200"
                style={{ backgroundColor: color }}
                title={`Color: ${color}`}
              />
            ))}
            {product.colors.length > 4 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-xs text-gray-500">
                +{product.colors.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </p>
            {product.oldPrice && (
              <p className="text-gray-400 line-through text-sm">
                {formatPrice(product.oldPrice)}
              </p>
            )}
          </div>
          
          <button 
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>

        {/* Stock Status */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Availability:</span>
            <span className={`font-semibold ${
              product.stock > 10 ? 'text-green-600' : 
              product.stock > 0 ? 'text-orange-600' : 'text-red-600'
            }`}>
              {product.stock > 10 ? 'In Stock' : 
               product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
            </span>
          </div>
          {/* Progress bar for stock */}
          {product.stock > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'
                }`}
                style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;