// components/AddProduct.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Gem, Sparkles } from 'lucide-react';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    material: '',
    gemstone: '',
    weight: '',
    price: '',
    stock: '',
    status: 'active',
    featured: false
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Rings', 'Necklaces', 'Earrings', 'Bracelets', 'Watches', 'Brooches'];
  const materials = ['Platinum', 'White Gold', 'Yellow Gold', 'Rose Gold', 'Sterling Silver'];
  const gemstones = ['Diamond', 'Pearl', 'Sapphire', 'Ruby', 'Emerald', 'Amethyst', 'Topaz', 'Opal'];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Jewelry added:', formData);
      setLoading(false);
      navigate('/products');
    }, 1000);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/products')}
          className="mr-4 p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent">
            Add New Jewelry
          </h1>
          <p className="text-gray-600 mt-1">Add a new exquisite piece to your collection</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Gem className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Jewelry Information</h2>
              <p className="text-amber-100">Enter details about your new jewelry piece</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jewelry Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                  placeholder="e.g., Infinity Diamond Ring"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                  placeholder="Describe this beautiful jewelry piece..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material *
                  </label>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  >
                    <option value="">Select Material</option>
                    {materials.map(mat => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Specifications & Pricing */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gemstone *
                  </label>
                  <select
                    name="gemstone"
                    value={formData.gemstone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  >
                    <option value="">Select Gemstone</option>
                    {gemstones.map(gem => (
                      <option key={gem} value={gem}>{gem}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (grams) *
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                  >
                    <option value="active">Active</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                <div className="flex items-center justify-center">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        formData.featured ? 'bg-amber-500' : 'bg-gray-300'
                      }`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                          formData.featured ? 'transform translate-x-6' : ''
                        }`}></div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span className="text-sm font-medium text-gray-700">Featured Piece</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-6 py-3 border border-amber-300 text-amber-700 rounded-xl hover:bg-amber-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-8 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 font-medium"
            >
              <Save className="h-5 w-5 mr-2" />
              {loading ? 'Adding Jewelry...' : 'Add Jewelry Piece'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;