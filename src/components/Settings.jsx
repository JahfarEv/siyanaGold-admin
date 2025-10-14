// components/Settings.js
import React, { useState } from 'react';
import { Save, Lock, User, Shield, RefreshCw, Bell, Mail, Globe, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { getAuth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import Swal from "sweetalert2";

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    username: 'jewelryadmin',
    email: 'admin@jewelcraftpro.com',
    fullName: 'Sarah Johnson',
    phone: '+1 (555) 123-4567',
    role: 'Administrator',
    language: 'en',
    notifications: {
      email: true,
      sms: false,
      orders: true,
      inventory: true
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [resetData, setResetData] = useState({
    resetType: 'inventory',
    confirmReset: false
  });

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type, checked) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: checked
      }
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    setLoading(false);
    Swal.fire({
      title: "Error!",
      text: "No user is logged in.",
      icon: "error",
      confirmButtonColor: "#ef4444",
    });
    return;
  }

  if (passwordData.newPassword !== passwordData.confirmPassword) {
    setLoading(false);
    Swal.fire({
      title: "Error!",
      text: "New password and confirm password do not match.",
      icon: "error",
      confirmButtonColor: "#ef4444",
    });
    return;
  }

  try {
    // Reauthenticate the user with current password
    const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
    await reauthenticateWithCredential(user, credential);

    // Update the password
    await updatePassword(user, passwordData.newPassword);

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    Swal.fire({
      title: "Success!",
      text: "Password updated successfully.",
      icon: "success",
      confirmButtonColor: "#10b981",
    });

  } catch (error) {
    console.error("Password update error:", error);
    Swal.fire({
      title: "Error!",
      text: error.message || "Failed to update password.",
      icon: "error",
      confirmButtonColor: "#ef4444",
    });
  } finally {
    setLoading(false);
  }
};

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Profile updated:', profileData);
      setLoading(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetData.confirmReset) {
      alert('Please confirm the reset action by checking the box.');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Reset requested:', resetData);
      setResetData({
        resetType: 'inventory',
        confirmReset: false
      });
      setLoading(false);
      alert(`System ${resetData.resetType} has been reset successfully!`);
    }, 2000);
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: passwordData.newPassword.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(passwordData.newPassword) },
    { text: 'One lowercase letter', met: /[a-z]/.test(passwordData.newPassword) },
    { text: 'One number', met: /[0-9]/.test(passwordData.newPassword) },
    { text: 'One special character', met: /[!@#$%^&*]/.test(passwordData.newPassword) }
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-800 to-rose-700 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-amber-100">
          <div className="flex overflow-x-auto">
            {[
              { id: 'profile', name: 'Profile', icon: User },
              { id: 'security', name: 'Security', icon: Lock },
              { id: 'reset', name: 'Reset System', icon: RefreshCw }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-700 bg-amber-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">SJ</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-gray-600">Update your personal and notification settings</p>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => handleProfileChange('username', e.target.value)}
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => handleProfileChange('fullName', e.target.value)}
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={profileData.language}
                      onChange={(e) => handleProfileChange('language', e.target.value)}
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl bg-amber-50 text-gray-500"
                    />
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Bell className="h-5 w-5 text-amber-600 mr-2" />
                    Notification Preferences
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(profileData.notifications).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => handleNotificationChange(key, e.target.checked)}
                            className="sr-only"
                          />
                          <div className={`w-10 h-6 rounded-full transition-colors duration-200 ${
                            value ? 'bg-amber-500' : 'bg-gray-300'
                          }`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                              value ? 'transform translate-x-4' : ''
                            }`}></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key === 'sms' ? 'SMS Notifications' : 
                           key === 'email' ? 'Email Notifications' :
                           key === 'orders' ? 'New Order Alerts' : 'Low Inventory Alerts'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-8 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 font-medium"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                  <p className="text-gray-600">Change your password and secure your account</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-6 mb-8">
                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Password Requirements */}
                    {passwordData.newPassword && (
                      <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                        <div className="space-y-2">
                          {passwordRequirements.map((req, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              {req.met ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                              )}
                              <span className={`text-sm ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                                {req.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 transition-all duration-200 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                      <p className="text-red-500 text-sm mt-2">Passwords do not match</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || !allRequirementsMet || passwordData.newPassword !== passwordData.confirmPassword}
                    className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-8 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 font-medium"
                  >
                    <Lock className="h-5 w-5 mr-2" />
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reset System */}
          {activeTab === 'reset' && (
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                  <RefreshCw className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">System Reset</h2>
                  <p className="text-gray-600">Reset various system components (Use with caution)</p>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-red-800">Warning</h3>
                    <p className="text-sm text-red-700 mt-1">
                      These actions are irreversible. Please proceed with caution. 
                      Some resets may require system restart.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleResetSubmit}>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reset Type
                    </label>
                    <select
                      value={resetData.resetType}
                      onChange={(e) => setResetData(prev => ({ ...prev, resetType: e.target.value }))}
                      className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50"
                    >
                      <option value="inventory">Inventory Data</option>
                      <option value="orders">Order History</option>
                      <option value="customers">Customer Data</option>
                      <option value="analytics">Analytics Data</option>
                      <option value="all">Full System Reset</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      {resetData.resetType === 'inventory' && 'Reset all inventory counts and product data'}
                      {resetData.resetType === 'orders' && 'Clear all order history and transaction records'}
                      {resetData.resetType === 'customers' && 'Reset customer database and preferences'}
                      {resetData.resetType === 'analytics' && 'Clear analytics and reporting data'}
                      {resetData.resetType === 'all' && 'Complete system reset - All data will be lost'}
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={resetData.confirmReset}
                        onChange={(e) => setResetData(prev => ({ ...prev, confirmReset: e.target.checked }))}
                        className="mt-1 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-amber-800">
                          I understand this action cannot be undone
                        </span>
                        <p className="text-sm text-amber-700 mt-1">
                          By checking this box, I confirm that I want to proceed with the system reset. 
                          All selected data will be permanently deleted.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading || !resetData.confirmReset}
                    className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 font-medium"
                  >
                    <RefreshCw className="h-5 w-5 mr-2" />
                    {loading ? 'Resetting...' : 'Reset System'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Security Tips */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="h-5 w-5 text-amber-600 mr-2" />
          Security Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3">
            <Lock className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Strong Passwords</p>
              <p className="text-sm text-gray-600">Use a combination of letters, numbers, and symbols</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <RefreshCw className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Regular Updates</p>
              <p className="text-sm text-gray-600">Change your password every 90 days</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-purple-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Secure Email</p>
              <p className="text-sm text-gray-600">Keep your recovery email up to date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;