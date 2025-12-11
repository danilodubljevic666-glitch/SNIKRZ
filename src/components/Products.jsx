// src/Products.jsx
import React, { useState, useEffect } from 'react';
import { 
  Filter, 
  Grid, 
  List, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  Star, 
  Check, 
  X,
  Sliders,
  Search,
  ShoppingBag,
  Heart,
  Eye,
  Loader2,
  AlertCircle,
  ExternalLink,
  DollarSign,
  Tag,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

const API_KEY = 'KICKS-DD05-7286-A5F3-A35CFFAC4A45';
const BASE_URL = 'https://api.kicks.dev/v3/stockx';
const ITEMS_PER_PAGE = 12;

const Products = () => {
  // ========== STATE VARIABLES ==========
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Filters
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // UI
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Cart functionality
  const [selectedSizes, setSelectedSizes] = useState({}); // { productId: 'M' }
  const [addingToCart, setAddingToCart] = useState({}); // { productId: true/false }
  const [favorites, setFavorites] = useState([]);
  
  // Brands and categories
  const [allBrands, setAllBrands] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  // ========== CART FUNCTIONS ==========
  
  const addToCart = (product, selectedSize = 'M') => {
    try {
      const cart = JSON.parse(localStorage.getItem('snkrz_cart') || '[]');
      
      const existingItemIndex = cart.findIndex(item => 
        item.id === product.id && item.size === selectedSize
      );
      
      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
        if (cart[existingItemIndex].quantity > (product.stock || 10)) {
          alert(`Na stanju imamo samo ${product.stock || 10} komada`);
          cart[existingItemIndex].quantity = product.stock || 10;
        }
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.avgPrice || product.price,
          images: product.images,
          brand: product.brand,
          category: product.category,
          size: selectedSize,
          color: product.colors?.[0] || '#000000',
          stock: product.stock || 10,
          quantity: 1,
          sku: product.sku,
          link: product.link,
          avgPrice: product.avgPrice,
          minPrice: product.minPrice,
          maxPrice: product.maxPrice
        });
      }
      
      localStorage.setItem('snkrz_cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      
      // Toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = `${product.name} dodat u korpu!`;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 3000);
      
    } catch (error) {
      console.error('Greška pri dodavanju u korpu:', error);
      alert('Došlo je do greške pri dodavanju proizvoda.');
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  // ========== SIZE SELECTOR COMPONENT ==========
  
  const SizeSelector = ({ product, onSelectSize, selectedSize }) => {
    const availableSizes = product.sizes || [7, 8, 9, 10, 11, 12];
    
    return (
      <div className="mb-4">
        <p className="text-sm text-gray-500 mb-2">Odaberite veličinu:</p>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map(size => (
            <button
              key={size}
              onClick={() => onSelectSize(size)}
              className={`px-3 py-1 rounded-lg text-sm transition-all ${
                selectedSize === size
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // ========== API FUNCTIONS ==========

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let queryParams = new URLSearchParams();
        
        if (searchInput) {
          queryParams.append('query', searchInput);
        }
        
        queryParams.append('limit', 100);
        
        const endpoint = `${BASE_URL}/products?${queryParams.toString()}`;
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Nevažeći API ključ. Proverite KICKS-DD05-7286-A5F3-A35CFFAC4A45.');
          }
          throw new Error(`HTTP greška! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          const transformedProducts = data.data.map(item => ({
            id: item.id,
            name: item.title,
            category: item.category || 'Patike',
            brand: item.brand,
            price: item.avg_price || item.min_price || 99.99,
            minPrice: item.min_price,
            maxPrice: item.max_price,
            avgPrice: item.avg_price,
            description: item.description || `${item.brand} ${item.model || ''}`,
            images: [item.image, ...(item.gallery || [])].filter(Boolean),
            colors: [item.primary_title ? `#${Math.floor(Math.random()*16777215).toString(16)}` : '#000000'],
            sizes: [7, 8, 9, 10, 11, 12],
            rating: 4.5,
            reviews: item.weekly_orders || Math.floor(Math.random() * 500) + 50,
            stock: Math.floor(Math.random() * 30) + 5,
            tags: [item.product_type, item.secondary_category].filter(Boolean),
            featured: item.rank < 1000,
            releaseDate: item.updated_at,
            sku: item.sku,
            slug: item.slug,
            link: item.link,
            rank: item.rank,
            weeklyOrders: item.weekly_orders,
            productType: item.product_type,
            gender: item.gender,
            upcoming: item.upcoming || false
          }));

          setProducts(transformedProducts);
          setFilteredProducts(transformedProducts);
          
          const uniqueBrands = [...new Set(transformedProducts.map(p => p.brand).filter(Boolean))];
          const uniqueCategories = [...new Set(transformedProducts.map(p => p.category).filter(Boolean))];
          
          setAllBrands(uniqueBrands);
          setAllCategories(uniqueCategories);
          
        } else {
          setProducts([]);
          setFilteredProducts([]);
        }
        
      } catch (err) {
        console.error('Greška pri dohvatanju proizvoda:', err);
        setError(err.message || 'Neuspešno dohvatanje proizvoda sa KicksDB API-ja.');
        
        const demoProducts = generateDemoProducts();
        setProducts(demoProducts);
        setFilteredProducts(demoProducts);
        
        const uniqueBrands = [...new Set(demoProducts.map(p => p.brand).filter(Boolean))];
        const uniqueCategories = [...new Set(demoProducts.map(p => p.category).filter(Boolean))];
        setAllBrands(uniqueBrands);
        setAllCategories(uniqueCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchInput]);

  // ========== FILTER FUNCTIONS ==========

  useEffect(() => {
    let result = [...products];
    
    if (selectedBrands.length > 0) {
      result = result.filter(product => selectedBrands.includes(product.brand));
    }
    
    if (selectedCategory !== 'all') {
      result = result.filter(product => product.category === selectedCategory);
    }
    
    if (selectedPriceRange !== 'all') {
      switch(selectedPriceRange) {
        case 'under100':
          result = result.filter(p => p.avgPrice < 100);
          break;
        case '100-200':
          result = result.filter(p => p.avgPrice >= 100 && p.avgPrice <= 200);
          break;
        case '200-300':
          result = result.filter(p => p.avgPrice >= 200 && p.avgPrice <= 300);
          break;
        case 'over300':
          result = result.filter(p => p.avgPrice > 300);
          break;
      }
    }
    
    if (selectedStatus !== 'all') {
      switch(selectedStatus) {
        case 'featured':
          result = result.filter(p => p.featured);
          break;
        case 'new':
          result = result.filter(p => p.tags?.includes('new') || p.rank < 500);
          break;
        case 'upcoming':
          result = result.filter(p => p.upcoming);
          break;
      }
    }
    
    result.sort((a, b) => {
      switch(selectedSort) {
        case 'price-low':
          return a.avgPrice - b.avgPrice;
        case 'price-high':
          return b.avgPrice - a.avgPrice;
        case 'popular':
          return b.weeklyOrders - a.weeklyOrders;
        case 'rank':
          return a.rank - b.rank;
        case 'newest':
          return new Date(b.releaseDate) - new Date(a.releaseDate);
        default:
          return b.weeklyOrders - a.weeklyOrders;
      }
    });
    
    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, selectedBrands, selectedCategory, selectedPriceRange, selectedSort, selectedStatus]);

  // ========== PAGINATION ==========

  useEffect(() => {
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    setTotalPages(totalPages);
    
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchInput(searchQuery);
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRange('all');
    setSelectedCategory('all');
    setSelectedSort('popular');
    setSelectedStatus('all');
    setSearchQuery('');
    setSearchInput('');
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ========== HELPER FUNCTIONS ==========

  const generateDemoProducts = () => {
    const brands = ['Nike', 'Adidas', 'Jordan', 'New Balance', 'Converse', 'Puma', 'Vans', 'Reebok'];
    const categories = ['Running', 'Lifestyle', 'Basketball', 'Skate', 'Training', 'Classic'];
    
    return Array.from({ length: 48 }, (_, i) => ({
      id: `demo-${i + 1}`,
      name: `Demo Patika ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      brand: brands[Math.floor(Math.random() * brands.length)],
      price: Math.floor(Math.random() * 300) + 50,
      minPrice: Math.floor(Math.random() * 200) + 30,
      maxPrice: Math.floor(Math.random() * 500) + 100,
      avgPrice: Math.floor(Math.random() * 300) + 50,
      description: 'Premium kvalitet patika za svakodnevno nošenje.',
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'],
      colors: ['#000000', '#3b82f6', '#dc2626'],
      sizes: [7, 8, 9, 10, 11, 12],
      rating: 4 + Math.random(),
      reviews: Math.floor(Math.random() * 500) + 50,
      stock: Math.floor(Math.random() * 30) + 5,
      tags: ['popular', 'new'],
      featured: Math.random() > 0.7,
      releaseDate: new Date().toISOString(),
      sku: `DEMO-${Math.floor(Math.random() * 10000)}`,
      slug: `demo-patika-${i + 1}`,
      link: '#',
      rank: Math.floor(Math.random() * 2000) + 1,
      weeklyOrders: Math.floor(Math.random() * 100) + 10,
      productType: 'sneakers',
      gender: ['men', 'women', 'unisex'][Math.floor(Math.random() * 3)],
      upcoming: Math.random() > 0.9
    }));
  };

  const formatPrice = (price) => {
    return `$${price?.toFixed(2) || '0.00'}`;
  };

  const activeFilterCount = 
    selectedBrands.length + 
    (selectedPriceRange !== 'all' ? 1 : 0) + 
    (selectedCategory !== 'all' ? 1 : 0) + 
    (selectedStatus !== 'all' ? 1 : 0);

  // ========== PAGINATION RENDER ==========

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
            currentPage === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          Prethodna
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === 1 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === page 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === totalPages 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-2 rounded-lg flex items-center gap-1 ${
            currentPage === totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Sledeća
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  // ========== LOADING & ERROR STATES ==========

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            {searchInput ? `Tražim "${searchInput}"...` : 'Učitavam patike...'}
          </h3>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Koristim demo podatke</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Pokušaj ponovo
          </button>
        </div>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SNKRZ Kolekcija</h1>
              <p className="text-gray-600 mt-2">
                {filteredProducts.length} proizvoda • Strana {currentPage} od {totalPages}
              </p>
            </div>
            
            <form onSubmit={handleSearch} className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Pretraži po SKU, nazivu ili brendu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-transparent rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-colors duration-200"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Traži
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filteri */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filteri
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Obriši sve
                  </button>
                )}
              </div>
              
              {/* Sortiranje */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Sortiraj po
                </h4>
                <div className="space-y-2">
                  {[
                    { value: 'popular', label: 'Popularnosti', icon: '🔥' },
                    { value: 'price-low', label: 'Ceni: niža → viša', icon: '⬆️' },
                    { value: 'price-high', label: 'Ceni: viša → niža', icon: '⬇️' },
                    { value: 'rank', label: 'Ranku', icon: '🏆' },
                    { value: 'newest', label: 'Novitetima', icon: '🆕' }
                  ].map((sort) => (
                    <button
                      key={sort.value}
                      onClick={() => handleSortChange(sort.value)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                        selectedSort === sort.value
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{sort.icon}</span>
                        {sort.label}
                      </span>
                      {selectedSort === sort.value && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Cena */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Cena
                </h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Sve cene' },
                    { value: 'under100', label: 'Ispod $100' },
                    { value: '100-200', label: '$100 - $200' },
                    { value: '200-300', label: '$200 - $300' },
                    { value: 'over300', label: 'Preko $300' }
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={() => handlePriceRangeChange(range.value)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                        selectedPriceRange === range.value
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {range.label}
                      {selectedPriceRange === range.value && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Brendovi */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Brendovi</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {allBrands.slice(0, 10).map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center justify-between gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                          className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{brand}</span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {products.filter(p => p.brand === brand).length}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Kategorije */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4">Kategorije</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                      selectedCategory === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Sve kategorije
                    {selectedCategory === 'all' && <Check className="h-4 w-4" />}
                  </button>
                  {allCategories.slice(0, 8).map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {category}
                      {selectedCategory === category && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Status */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Status
                </h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'Svi proizvodi', icon: '📦' },
                    { value: 'featured', label: 'Izdvojeni', icon: '⭐' },
                    { value: 'new', label: 'Novo', icon: '🆕' },
                    { value: 'upcoming', label: 'Uskoro', icon: '📅' }
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusChange(status.value)}
                      className={`flex items-center justify-between w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                        selectedStatus === status.value
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{status.icon}</span>
                        {status.label}
                      </span>
                      {selectedStatus === status.value && <Check className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Aktivni filteri */}
              {activeFilterCount > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    Aktivni filteri: <span className="font-bold">{activeFilterCount}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedBrands.map(brand => (
                      <span key={brand} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {brand}
                        <button onClick={() => handleBrandToggle(brand)} className="hover:text-blue-900">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {selectedPriceRange !== 'all' && (
                      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {selectedPriceRange === 'under100' ? 'Ispod $100' :
                         selectedPriceRange === '100-200' ? '$100-$200' :
                         selectedPriceRange === '200-300' ? '$200-$300' : 'Preko $300'}
                        <button onClick={() => setSelectedPriceRange('all')} className="hover:text-blue-900">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Glavni sadržaj */}
          <div className="flex-1">
            {/* Info bar */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">
                    Prikazano: <span className="font-bold text-gray-900">{displayedProducts.length}</span> od{' '}
                    <span className="font-bold text-gray-900">{filteredProducts.length}</span> proizvoda
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {activeFilterCount} filter aktivno
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  {/* View toggle */}
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'grid'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="Grid pregled"
                    >
                      <Grid className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'list'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      title="List pregled"
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Sliders className="h-5 w-5" />
                    Filteri
                  </button>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            {displayedProducts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayedProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      {/* Product Image */}
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {product.featured && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              ⭐ Izdvojeno
                            </span>
                          </div>
                        )}
                        {product.rank < 500 && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                              🔥 Top {product.rank}
                            </span>
                          </div>
                        )}
                        <button 
                          onClick={() => toggleFavorite(product.id)}
                          className={`absolute top-16 right-4 p-2 rounded-full transition-all ${
                            favorites.includes(product.id)
                              ? 'bg-red-500 text-white'
                              : 'bg-white/90 text-gray-700 hover:bg-white'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm text-blue-600 font-semibold">
                            {product.brand} • {product.category}
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{product.rating?.toFixed(1) || '4.5'}</span>
                            <span className="text-sm text-gray-400">({product.reviews})</span>
                          </div>
                        </div>
                        
                        <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1">
                          {product.name}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        
                        {/* Size Selector */}
                        <SizeSelector 
                          product={product} 
                          selectedSize={selectedSizes[product.id] || 'M'}
                          onSelectSize={(size) => setSelectedSizes(prev => ({
                            ...prev,
                            [product.id]: size
                          }))}
                        />
                        
                        {/* Price Range */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatPrice(product.avgPrice || product.price)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {product.weeklyOrders || 0} nedeljno
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500">
                            <span>Min: {formatPrice(product.minPrice || product.price)}</span>
                            <span>Max: {formatPrice(product.maxPrice || product.price * 1.5)}</span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <code className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {product.sku}
                          </code>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => window.open(product.link || '#', '_blank')}
                              className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                              title="Pogledaj na StockX"
                            >
                              <Eye className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={() => {
                                setAddingToCart(prev => ({...prev, [product.id]: true}));
                                addToCart(product, selectedSizes[product.id] || 'M');
                                setTimeout(() => {
                                  setAddingToCart(prev => ({...prev, [product.id]: false}));
                                }, 1000);
                              }}
                              disabled={addingToCart[product.id]}
                              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                                addingToCart[product.id]
                                  ? 'bg-green-500 text-white'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {addingToCart[product.id] ? (
                                <>
                                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Dodato!
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="h-4 w-4" />
                                  Dodaj
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-6">
                  {displayedProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-lg p-6 flex gap-6 hover:shadow-xl transition-shadow duration-300">
                      <div className="w-48 flex-shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover rounded-xl" />
                        <div className="mt-4">
                          <SizeSelector 
                            product={product} 
                            selectedSize={selectedSizes[product.id] || 'M'}
                            onSelectSize={(size) => setSelectedSizes(prev => ({
                              ...prev,
                              [product.id]: size
                            }))}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-sm text-blue-600 font-semibold">
                              {product.brand} • {product.category}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 mt-1">{product.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-gray-600">{product.rating?.toFixed(1) || '4.5'}</span>
                                <span className="text-gray-400">({product.reviews})</span>
                              </div>
                              <button 
                                onClick={() => toggleFavorite(product.id)}
                                className="ml-4"
                              >
                                <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                              </button>
                            </div>
                          </div>
                          <button 
                            onClick={() => window.open(product.link || '#', '_blank')}
                            className="p-2 text-gray-400 hover:text-gray-600"
                            title="Pogledaj na StockX"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <p className="text-gray-600 mb-6">{product.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-2xl font-bold text-gray-900">
                              {formatPrice(product.avgPrice || product.price)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {product.weeklyOrders || 0} nedeljnih porudžbina
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setAddingToCart(prev => ({...prev, [product.id]: true}));
                              addToCart(product, selectedSizes[product.id] || 'M');
                              setTimeout(() => {
                                setAddingToCart(prev => ({...prev, [product.id]: false}));
                              }, 1000);
                            }}
                            disabled={addingToCart[product.id]}
                            className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 ${
                              addingToCart[product.id]
                                ? 'bg-green-500 text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {addingToCart[product.id] ? (
                              <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Dodato!
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="h-5 w-5" />
                                Dodaj u korpu
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* No results */
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Nema pronađenih proizvoda
                </h3>
                <p className="text-gray-600 mb-6">
                  Pokušajte sa drugim filterima ili pretragom
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  <X className="h-5 w-5" />
                  Obriši sve filtere
                </button>
              </div>
            )}
            
            {/* Pagination */}
            {filteredProducts.length > ITEMS_PER_PAGE && renderPagination()}
            
            {/* Info footer */}
            <div className="mt-8 text-center text-sm text-gray-500">
              Prikazujem {displayedProducts.length} od {filteredProducts.length} proizvoda • Strana {currentPage} od {totalPages}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;