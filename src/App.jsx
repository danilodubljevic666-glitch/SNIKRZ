// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Products from './components/Products';
import CartPage from './components/CartPage';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Nav />
        <Routes>
          {/* Homepage - Hero + Products */}
          <Route path="/" element={
            <>
              <Hero />
              <Products />
            </>
          } />
          
          {/* Products page - samo Products komponenta */}
          <Route path="/products" element={<Products />} />
          
          {/* Cart page */}
          <Route path="/cart" element={<CartPage />} />
          
          {/* Fallback za nedefinisane rute */}
          <Route path="*" element={
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">404 - Stranica nije pronađena</h1>
                <p className="text-gray-600">Vratite se na <a href="/" className="text-blue-600 hover:underline">početnu stranicu</a></p>
              </div>
            </div>
          } />
        </Routes>
      <Footer/>
      </div>
    </Router>
  );
}

export default App;