import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Key, Shield, CheckCircle, AlertCircle, Eye, EyeOff 
} from 'lucide-react';
import axios from 'axios';

const AlumniSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Password Reset States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    // Check if user is logged in and is an alumni
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || userData.role !== 'alumni') {
      navigate('/login/alumni');
      return;
    }
    
    setUser(userData);
    setIsLoading(false);
  }, [navigate]);

  // Password Reset Handler
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      setResetStatus('All password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetStatus('New passwords do not match');
      return;
    }

    setIsResetting(true);
    setResetStatus('Updating your password...');

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/auth/reset-password-auth', 
        { 
          currentPassword, 
          newPassword 
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setResetStatus('success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setResetStatus(''), 5000);
      } else {
        setResetStatus(response.data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setResetStatus(error.response?.data?.message || 'Password reset failed. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-3 text-gray-700">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-100">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/alumni-dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-white/60 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </motion.button>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Alumni Settings
            </h1>

            <div className="w-32" />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            {/* Section Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Password Reset
              </h2>
              <p className="text-gray-600">
                Update your password to keep your account secure
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <form onSubmit={handlePasswordReset} className="space-y-6">
                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.current ? "text" : "password"}
                      id="currentPassword"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.new ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter your new password"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your new password"
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirm')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isResetting}
                  className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white font-medium rounded-xl hover:from-green-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {isResetting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating Password...
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5 mr-2" />
                      Update Password
                    </>
                  )}
                </button>
              </form>

              {/* Reset Status */}
              {resetStatus && resetStatus !== 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`mt-4 border rounded-xl p-4 ${
                    resetStatus.includes('failed') || resetStatus.includes('error') || resetStatus.includes('incorrect') || resetStatus.includes('match')
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>{resetStatus}</span>
                  </div>
                </motion.div>
              )}

              {/* Reset Success */}
              {resetStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-green-50 border border-green-200 rounded-xl p-6"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-900">
                      Password Updated Successfully!
                    </h3>
                  </div>
                  
                  <div className="text-sm text-green-700">
                    <p>✅ Your password has been successfully updated</p>
                    <p>✅ You'll use your new password the next time you sign in</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Security Tips */}
            <div className="mt-8 bg-green-50 border border-green-100 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">
                  Password Security Tips
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Use a combination of letters, numbers, and special characters
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Don't use personal information like your name or birth date
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Avoid using the same password for multiple accounts
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  Change your password regularly for better security
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlumniSettings;