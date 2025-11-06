// components/BannerManagement.js
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  Eye, 
  EyeOff,
  X,
  CheckCircle,
  Menu,
  Filter
} from 'lucide-react';
import Swal from 'sweetalert2';

const BannerManagement = () => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      name: 'Main Homepage Banner',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      isActive: true,
      createdAt: '2024-01-15',
      position: 'homepage-top'
    },
    {
      id: 2,
      name: 'Promotional Banner',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      isActive: false,
      createdAt: '2024-01-10',
      position: 'homepage-middle'
    },
    {
      id: 3,
      name: 'Promotional Banner',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
      isActive: false,
      createdAt: '2024-01-10',
      position: 'homepage-middle'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [newBanner, setNewBanner] = useState({
    name: '',
    imageUrl: '',
    position: 'homepage-top',
    isActive: true
  });

  // Mock file upload function
  const simulateFileUpload = (file) => {
    return new Promise((resolve) => {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            resolve(`https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?auto=format&fit=crop&w=1200&q=80`);
            return 100;
          }
          return prev + 10;
        });
      }, 100);
    });
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Invalid File!',
        text: 'Please upload an image file (JPEG, PNG, GIF, etc.)',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: 'white'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large!',
        text: 'Please upload an image smaller than 5MB',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: 'white'
      });
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await simulateFileUpload(file);
      setNewBanner(prev => ({ ...prev, imageUrl }));
      Swal.fire({
        title: 'Success!',
        text: 'Image uploaded successfully',
        icon: 'success',
        confirmButtonColor: '#10b981',
        background: '#1f2937',
        color: 'white'
      });
    } catch (error) {
      Swal.fire({
        title: 'Upload Failed!',
        text: 'Failed to upload image. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: '#1f2937',
        color: 'white'
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleAddBanner = (e) => {
    e.preventDefault();
    
    if (!newBanner.name.trim() || !newBanner.imageUrl) {
      Swal.fire({
        title: 'Missing Information!',
        text: 'Please provide both banner name and image',
        icon: 'warning',
        confirmButtonColor: '#f59e0b',
        background: '#1f2937',
        color: 'white'
      });
      return;
    }

    const banner = {
      id: Date.now(),
      ...newBanner,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setBanners(prev => [banner, ...prev]);
    
    Swal.fire({
      title: 'Success!',
      text: 'Banner added successfully',
      icon: 'success',
      confirmButtonColor: '#10b981',
      background: '#1f2937',
      color: 'white'
    });

    setNewBanner({
      name: '',
      imageUrl: '',
      position: 'homepage-top',
      isActive: true
    });
    setShowAddModal(false);
  };

  const handleDeleteBanner = (bannerId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      background: '#1f2937',
      color: 'white'
    }).then((result) => {
      if (result.isConfirmed) {
        setBanners(prev => prev.filter(banner => banner.id !== bannerId));
        Swal.fire({
          title: 'Deleted!',
          text: 'Banner has been deleted.',
          icon: 'success',
          confirmButtonColor: '#10b981',
          background: '#1f2937',
          color: 'white'
        });
      }
    });
  };

  const toggleBannerStatus = (bannerId) => {
    setBanners(prev => prev.map(banner => 
      banner.id === bannerId 
        ? { ...banner, isActive: !banner.isActive }
        : banner
    ));
  };

  const getPositionBadge = (position) => {
    const positions = {
      'homepage-top': { label: 'Top', color: 'bg-blue-500' },
      'homepage-middle': { label: 'Middle', color: 'bg-green-500' },
      'homepage-bottom': { label: 'Bottom', color: 'bg-purple-500' },
      'sidebar': { label: 'Sidebar', color: 'bg-amber-500' }
    };
    
    const pos = positions[position] || { label: position, color: 'bg-gray-500' };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${pos.color}`}>
        {pos.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-500 to-rose-600 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl mb-4 sm:mb-6">
            <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-amber-500 to-rose-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            Banner Management
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            Manage your website banners, upload new images, and control their visibility
          </p>
        </div>

        {/* Actions Bar - Mobile Optimized */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              Banners ({banners.length})
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs sm:text-sm">Active: {banners.filter(b => b.isActive).length}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-xs sm:text-sm">Inactive: {banners.filter(b => !b.isActive).length}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white -white px-4 py-3 sm:px-6 sm:py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 font-semibold w-full sm:w-auto text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Add New Banner</span>
          </button>
        </div>

        {/* Banners Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {banners.map((banner) => (
            <div 
              key={banner.id} 
              className={`bg-white rounded-xl sm:rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                banner.isActive ? 'border-green-200' : 'border-gray-200'
              }`}
            >
              {/* Banner Image */}
              <div className="relative h-40 sm:h-48 rounded-t-xl sm:rounded-t-2xl overflow-hidden">
                <img 
                  src={banner.imageUrl} 
                  alt={banner.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex gap-1 sm:gap-2">
                  <button
                    onClick={() => toggleBannerStatus(banner.id)}
                    className={`p-1.5 sm:p-2 rounded-full backdrop-blur-sm transition-all ${
                      banner.isActive 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-gray-500 text-white hover:bg-gray-600'
                    }`}
                  >
                    {banner.isActive ? 
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" /> : 
                      <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />
                    }
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner.id)}
                    className="p-1.5 sm:p-2 bg-red-500 text-white rounded-full backdrop-blur-sm hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                {banner.isActive && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      <span className="hidden xs:inline">Active</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Banner Info */}
              <div className="p-3 sm:p-4">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate flex-1 mr-2">
                    {banner.name}
                  </h3>
                </div>
                
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Position:</span>
                    {getPositionBadge(banner.position)}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-gray-900 font-medium">{banner.createdAt}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${banner.isActive ? 'text-green-600' : 'text-gray-600'}`}>
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - Mobile Optimized */}
        {banners.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Banners Yet</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">Get started by uploading your first banner</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all text-sm sm:text-base w-full sm:w-auto"
            >
              Add Your First Banner
            </button>
          </div>
        )}

        {/* Add Banner Modal - Mobile Optimized */}
        {showAddModal && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Banner</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleAddBanner} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Banner Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Banner Name *
                  </label>
                  <input
                    type="text"
                    value={newBanner.name}
                    onChange={(e) => setNewBanner(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter banner name"
                    required
                  />
                </div>

                {/* Banner Position */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Banner Position *
                  </label>
                  <select
                    value={newBanner.position}
                    onChange={(e) => setNewBanner(prev => ({ ...prev, position: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  >
                    <option value="homepage-top">Homepage Top</option>
                    <option value="homepage-middle">Homepage Middle</option>
                    <option value="homepage-bottom">Homepage Bottom</option>
                    <option value="sidebar">Sidebar</option>
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Banner Image *
                  </label>
                  
                  {!newBanner.imageUrl ? (
                    <div
                      className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-center transition-all duration-300 ${
                        dragOver 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-2 sm:mb-3 lg:mb-4" />
                      <p className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">
                        Drag & Drop your image here
                      </p>
                      <p className="text-gray-500 mb-2 sm:mb-3 lg:mb-4 text-xs sm:text-sm">or</p>
                      <label className="bg-gradient-to-r from-amber-500 to-rose-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl cursor-pointer hover:shadow-lg transition-all inline-block text-sm sm:text-base">
                        <span>Browse Files</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileInput}
                        />
                      </label>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 lg:mt-4">
                        Supports: JPEG, PNG, GIF • Max: 5MB
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img 
                        src={newBanner.imageUrl} 
                        alt="Preview" 
                        className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-xl sm:rounded-2xl"
                      />
                      <button
                        type="button"
                        onClick={() => setNewBanner(prev => ({ ...prev, imageUrl: '' }))}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {loading && (
                    <div className="mt-3 sm:mt-4">
                      <div className="flex items-center justify-between text-xs sm:text-sm mb-1 sm:mb-2">
                        <span className="text-gray-700">Uploading...</span>
                        <span className="text-blue-600 font-medium">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                        <div 
                          className="bg-blue-500 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Banner Status
                    </label>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Make banner visible on the website
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNewBanner(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                      newBanner.isActive ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                        newBanner.isActive ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm sm:text-base order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !newBanner.name || !newBanner.imageUrl}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-rose-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base order-1 sm:order-2"
                  >
                    Add Banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerManagement;