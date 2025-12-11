// src/pages/CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Home,
  CheckCircle,
  Mail,
  User,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Truck,
  Shield,
  AlertCircle
} from 'lucide-react';

// EmailJS konfiguracija - OVDE STAVI SVOJE PODATKE
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_02ezobl', // Zameni sa tvojim Service ID
  TEMPLATE_ID: 'template_u76xyxl', // Zameni sa tvojim Template ID
  PUBLIC_KEY: 'ASltbUGew2GCqRWiC' // Nađi u Account → API Keys
};

const CartPage = () => {
  const navigate = useNavigate();
  
  // Stanje korpe
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('snkrz_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  
  // Čuvanje korpe u localStorage
  useEffect(() => {
    localStorage.setItem('snkrz_cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Računanje cena
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 10000 ? 0 : 499;
  const total = subtotal + shipping;
  
  // Funkcije za korpu
  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const newQuantity = item.quantity + change;
          if (newQuantity < 1) return item;
          if (newQuantity > (item.stock || 10)) {
            alert(`Na stanju imamo samo ${item.stock || 10} komada`);
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };
  
  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };
  
  const clearCart = () => {
    if (window.confirm('Da li ste sigurni da želite da ispraznite korpu?')) {
      setCartItems([]);
    }
  };
  
  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Ime i prezime je obavezno';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email je obavezan';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email nije validan';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefon je obavezan';
    } else if (!/^[+]?[\d\s-]+$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Telefon nije validan';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Adresa je obavezna';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'Grad je obavezan';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Format price - POPRAVLJENO da koristi tačke umjesto zareza
  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price) + ' RSD';
  };
  
  // Send order email - POPRAVLJENA FUNKCIJA
  const sendOrderEmail = async (orderData) => {
    try {
      // Format order items for email - KOMPLETAN HTML sa inline CSS
      const orderItemsHTML = cartItems.map(item => `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #334155;">${item.name}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #334155;">${item.brand || 'SNKRZ'}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #334155;">${item.size || 'M'}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #334155;">${item.quantity}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #334155;">${formatPrice(item.price)}</td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #334155;">${formatPrice(item.price * item.quantity)}</td>
        </tr>
      `).join('');
      
      // Kompletna HTML tabela sa headerom
      const completeTableHTML = `
        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin: 20px 0;">
          <thead>
            <tr style="background: #f1f5f9;">
              <th style="padding: 16px 20px; text-align: left; color: #475569; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Proizvod</th>
              <th style="padding: 16px 20px; text-align: left; color: #475569; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Brend</th>
              <th style="padding: 16px 20px; text-align: left; color: #475569; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Veličina</th>
              <th style="padding: 16px 20px; text-align: left; color: #475569; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Količina</th>
              <th style="padding: 16px 20px; text-align: left; color: #475569; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Cena</th>
              <th style="padding: 16px 20px; text-align: left; color: #475569; font-weight: 600; border-bottom: 2px solid #e2e8f0;">Ukupno</th>
            </tr>
          </thead>
          <tbody>
            ${orderItemsHTML}
          </tbody>
        </table>
      `;
      
      // Prepare template parameters
      const templateParams = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        notes: formData.notes || 'Nema napomene',
        order_date: new Date().toLocaleDateString('sr-RS', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        timestamp: new Date().toLocaleString('sr-RS', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        order_items: completeTableHTML,  // Šaljemo KOMPLETNU tabelu
        subtotal: formatPrice(subtotal),
        shipping: shipping === 0 ? '0 RSD (BESPLATNO)' : formatPrice(shipping),
        discount: '0 RSD',
        total: formatPrice(total),
        order_id: orderData.orderId,
        item_count: cartItems.length,
        total_items: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      };
      
      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );
      
      console.log('Email sent successfully:', response);
      return true;
      
    } catch (error) {
      console.error('Failed to send email:', error);
      // Dodaj detaljnije logovanje
      console.error('EmailJS error details:', {
        message: error.text || error.message,
        code: error.status || 'N/A'
      });
      return false;
    }
  };
  
  // Handle order submission
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Vaša korpa je prazna!');
      return;
    }
    
    if (!validateForm()) {
      alert('Popravite greške u formi');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate order ID
      const orderId = `SNKRZ-${Date.now().toString().slice(-8)}`;
      
      // Create order object
      const orderData = {
        orderId,
        customer: formData,
        items: cartItems,
        subtotal,
        shipping,
        total,
        date: new Date().toISOString(),
        status: 'pending'
      };
      
      // Send email
      const emailSent = await sendOrderEmail(orderData);
      
      if (emailSent) {
        // Save order to localStorage (for demo)
        const savedOrders = JSON.parse(localStorage.getItem('snkrz_orders') || '[]');
        savedOrders.push(orderData);
        localStorage.setItem('snkrz_orders', JSON.stringify(savedOrders));
        
        // Clear cart
        setCartItems([]);
        localStorage.removeItem('snkrz_cart');
        
        // Show success
        setOrderDetails(orderData);
        setOrderSuccess(true);
        
        // Reset form
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          notes: ''
        });
        
      } else {
        alert('Došlo je do greške pri slanju porudžbine. Pokušajte ponovo.');
      }
      
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Došlo je do greške. Pokušajte ponovo.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Success screen
  if (orderSuccess && orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Porudžbina poslata! 🎉</h1>
            <p className="text-gray-600 text-lg">
              Hvala na porudžbini, {orderDetails.customer.full_name}!
            </p>
            <p className="text-gray-500 mt-2">
              Poslali smo potvrdu na: {orderDetails.customer.email}
            </p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg inline-block">
              <p className="text-blue-700 font-medium">
                Proverite i SPAM folder ako ne vidite email!
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Detalji porudžbine
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Broj porudžbine:</span>
                    <span className="font-semibold">{orderDetails.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Datum:</span>
                    <span className="font-semibold">
                      {new Date(orderDetails.date).toLocaleDateString('sr-RS')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-green-600">
                      Potvrda poslata na email
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ukupan iznos:</span>
                    <span className="font-semibold text-blue-600">
                      {formatPrice(orderDetails.total)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Adresa za dostavu
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">{orderDetails.customer.address}</p>
                  <p className="text-gray-700">{orderDetails.customer.city}</p>
                  <p className="text-gray-700">{orderDetails.customer.phone}</p>
                  <p className="text-gray-700">{orderDetails.customer.email}</p>
                  {orderDetails.customer.notes && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded">
                      <p className="text-sm text-gray-600">
                        <strong>Napomena:</strong> {orderDetails.customer.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Poručeni proizvodi</h3>
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16">
                        <img 
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          {item.brand || 'SNKRZ'} • {item.size || 'M'} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="font-semibold">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              <Home className="h-5 w-5" />
              Nastavi kupovinu
            </Link>
            <p className="mt-4 text-gray-500">
              Kontaktiraćemo vas putem telefona za potvrdu dostave.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Empty cart
  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <ShoppingBag className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {orderSuccess ? 'Hvala na porudžbini!' : 'Vaša korpa je prazna'}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {orderSuccess 
                ? 'Vaša porudžbina je uspešno primljena.' 
                : 'Dodajte neke patike da počnete kupovinu'}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              <Home className="h-5 w-5" />
              Istraži proizvode
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Main cart page
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Završite porudžbinu</h1>
            <p className="text-gray-600 mt-2">
              {cartItems.length} proizvoda u korpi • {formatPrice(total)} ukupno
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="h-5 w-5" />
            Nastavi kupovinu
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="h-6 w-6" />
                Podaci za dostavu
              </h2>
              
              <form onSubmit={handleSubmitOrder} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ime i prezime *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.full_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Petar Petrović"
                  />
                  {errors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
                  )}
                </div>
                
                {/* Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email adresa *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="petar@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Broj telefona *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="+381 60 123 4567"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>
                
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresa za dostavu *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Ulica i broj, stan, sprat..."
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>
                
                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grad *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Beograd, Novi Sad, Niš..."
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>
                
                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Napomena za dostavu (opciono)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detalji za ulaz, zvonilo, vreme dostave..."
                  />
                </div>
                
                {/* Trust Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-blue-700">Sigurna kupovina</p>
                      <p className="text-xs text-blue-600">Podaci zaštićeni</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <Mail className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-semibold text-green-700">Email potvrda</p>
                      <p className="text-xs text-green-600">Odmah po narudžbini</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-purple-700">Plaćanje pouzećem</p>
                      <p className="text-xs text-purple-600">Prilikom preuzimanja</p>
                    </div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 rounded-lg font-semibold flex items-center justify-center gap-3 ${
                      isSubmitting
                        ? 'bg-blue-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Šaljem porudžbinu...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Potvrdi porudžbinu • {formatPrice(total)}
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Klikom na "Potvrdi porudžbinu" slažete se sa uslovima korišćenja
                  </p>
                  <p className="text-xs text-blue-600 text-center mt-2">
                    ⓘ Proverite SPAM folder ako ne primite email potvrdu
                  </p>
                </div>
              </form>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Vaša korpa</h3>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-16 h-16 flex-shrink-0">
                      <img
                        src={item.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="w-full mb-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
              >
                Isprazni korpu
              </button>
              
              {/* Price Summary */}
              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Međuzbir:</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Dostava:</span>
                  <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>
                    {shipping === 0 ? 'BESPLATNO' : formatPrice(shipping)}
                  </span>
                </div>
                
                {subtotal < 10000 && (
                  <p className="text-sm text-green-600 bg-green-50 p-2 rounded">
                    Dodajte {formatPrice(10000 - subtotal)} za besplatnu dostavu!
                  </p>
                )}
                
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                  <span>Ukupno:</span>
                  <span className="text-blue-600">{formatPrice(total)}</span>
                </div>
              </div>
              
              {/* Quick Info */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    <strong>Plaćanje pouzećem</strong> - Plaćate prilikom preuzimanja paketa
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Truck className="h-5 w-5 text-green-500 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    <strong>Dostava 3-5 radnih dana</strong> - Besplatna za preko 100$
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-purple-500 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    <strong>Email potvrda</strong> - Stiže odmah po porudžbini
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;