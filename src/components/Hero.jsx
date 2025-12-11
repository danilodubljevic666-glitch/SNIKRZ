// components/Hero.jsx
import React from 'react';
import { ArrowRight, CheckCircle, Shield, Truck } from 'lucide-react';

const Hero = () => {
  const featuredProducts = [
    {
      name: "Nike Air Max 270",
      category: "Running Shoes",
      price: 149,
      oldPrice: 179,
      discount: "-17%",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Adidas Ultraboost",
      category: "Lifestyle",
      price: 159,
      oldPrice: 189,
      discount: "-16%",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Converse Chuck 70",
      category: "Classic",
      price: 89,
      oldPrice: 109,
      discount: "-18%",
      image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  const features = [
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Besplatna dostava",
      description: "Za porudžbine preko 100 €"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Garancija 2 godine",
      description: "Na sve modele"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "100% Original",
      description: "Samo provereni brendovi"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Text content */}
          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
              SEZONSKO SNABAĐENJE
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Pronađi svoj
              <span className="text-blue-600 block">savršen par</span>
              <span className="text-gray-700">patika</span>
            </h1>
            
            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Istraži našu ekskluzivnu kolekciju premium patika od vodećih svetskih brendova. 
              Komfor, stil i kvalitet na jednom mestu.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="/products"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Istraži kolekciju
                <ArrowRight className="ml-3 h-5 w-5" />
              </a>
              <a
                href="/sale"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300"
              >
                Pogledaj popust
              </a>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-xl mb-3">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right side - Product showcase */}
          <div className="relative">
            {/* Main featured product */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Premium sneakers"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="text-sm opacity-90">FUTURISTIČKI DIZAJN</span>
                <h3 className="text-2xl font-bold mt-1">Nike Air Force 1</h3>
                <p className="text-lg font-semibold mt-2">120.99€</p>
              </div>
            </div>
            
            {/* Floating product cards */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 w-64 transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1605348532760-6753d2c43329?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                  alt="Jordan 1"
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Jordan 1 Retro</h4>
                  <p className="text-sm text-gray-500">Basketball</p>
                  <p className="text-lg font-bold text-blue-600">160.49€</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 w-64 transform hover:-translate-y-2 transition-transform duration-300">
              <div className="flex items-center gap-4">
                <img
                  src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
                  alt="Adidas"
                  className="w-20 h-20 object-cover rounded-xl"
                />
                <div>
                  <h4 className="font-bold text-gray-900">Adidas NMD</h4>
                  <p className="text-sm text-gray-500">Streetwear</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-blue-600">130.99€</p>
                    <p className="text-sm text-gray-400 line-through">160.99€</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured products slider */}
        <div className="mt-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Izdvojeno ove nedelje</h2>
            <a href="/products" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
              Vidi sve
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product, index) => (
              <div key={index} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                {product.discount && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                    {product.discount}
                  </div>
                )}
                <div className="relative h-64 mb-4 overflow-hidden rounded-xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-gray-900">{product.price.toLocaleString()} €</p>
                      {product.oldPrice && (
                        <p className="text-gray-400 line-through">{product.oldPrice.toLocaleString()}€</p>
                      )}
                    </div>
                    <button className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Dodaj
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          className="w-full h-16 text-white" 
          viewBox="0 0 1440 120" 
          fill="currentColor"
        >
          <path d="M0,120 L1440,0 L1440,120 Z" />
        </svg>
      </div>
    </div>
  );
};

export default Hero;