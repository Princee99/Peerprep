import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  Users,
  Mail,
  Key,
  Download,
  CheckCircle,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  RefreshCw,
  Send,
  Settings,
  Shield,
  Database,
  FileCheck,
  UserCheck
} from 'lucide-react';

const AdminSettings = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // States
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processResults, setProcessResults] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Upload, 2: Generate Passwords, 3: Send Emails
  
  // Password Reset States
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState('');

  // Excel Upload Handler
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.type === 'application/vnd.ms-excel')) {
      setSelectedFile(file);
      setUploadStatus('');
      setProcessResults(null);
      setCurrentStep(1);
    } else {
      setUploadStatus('Please select a valid Excel file (.xlsx or .xls)');
    }
  };

  // Step 1: Upload Excel and Generate Passwords
  const handlePasswordGeneration = async () => {
    if (!selectedFile) {
      setUploadStatus('Please select a file first');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);
    setUploadStatus('Uploading file and generating passwords...');
    setCurrentStep(2);

    const formData = new FormData();
    formData.append('excelFile', selectedFile);

    const maxRetries = 3;
    let retryCount = 0;

    const attemptUpload = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Check if token exists
        if (!token) {
          throw new Error('Authentication required. Please login again.');
        }

        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 5, 85));
        }, 500);

        const response = await fetch('http://localhost:5000/api/admin/generate-passwords', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        clearInterval(progressInterval);

        // Handle different response statuses
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUploadProgress(100);

        if (data.success) {
          // Handle success - Show success message when emails are sent automatically
          if (data.emailsSent > 0) {
            setUploadStatus('credentials_sent');
            setCurrentStep(4);
          } else {
            setUploadStatus('success');
            setCurrentStep(3);
          }
          
          setProcessResults(data);
        } else {
          throw new Error(data.message || 'Processing failed');
        }
      } catch (error) {
        console.error('Upload attempt failed:', error);
        
        // Handle authentication errors specifically
        if (error.message.includes('Authentication required') || 
            error.message.includes('Session expired')) {
          alert(error.message);
          navigate('/login');
          return;
        }
        
        if (retryCount < maxRetries && 
            (error.message.includes('CONNECTION_RESET') || 
             error.message.includes('Failed to fetch'))) {
          
          retryCount++;
          setUploadStatus(`Connection lost. Retrying... (${retryCount}/${maxRetries})`);
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
          return attemptUpload();
        } else {
          throw error;
        }
      }
    };

    try {
      await attemptUpload();
    } catch (error) {
      console.error('Password generation error:', error);
      setUploadStatus('Password generation failed. Please try again.');
      setCurrentStep(1);
      setUploadProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 2: Send Credentials via Email
  const handleSendCredentials = async () => {
    if (!processResults?.outputFilePath) {
      setUploadStatus('No password file available. Please generate passwords first.');
      return;
    }

    setIsProcessing(true);
    setUploadStatus('Sending credential emails to users...');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/admin/send-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          excelFilePath: processResults.outputFilePath,
          userType: 'all' // or specify 'student', 'alumni'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setUploadStatus('credentials_sent');
        setProcessResults(prev => ({
          ...prev,
          emailResults: data
        }));
      } else {
        setUploadStatus(data.message || 'Failed to send credential emails');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      setUploadStatus('Failed to send emails. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Password Reset Handler
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setResetStatus('Please enter an email address');
      return;
    }

    setIsResetting(true);
    setResetStatus('Generating new password...');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/admin/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await response.json();

      if (response.ok) {
        setResetStatus('success');
        setTempPassword(data.tempPassword);
        setResetEmail('');
      } else {
        setResetStatus(data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setResetStatus('Password reset failed. Please try again.');
    } finally {
      setIsResetting(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please login first');
        return;
      }

      const response = await fetch('http://localhost:5000/api/admin/download-template', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Template download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'user-template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Template download error:', error);
      alert('Failed to download template. Please try again.');
    }
  };

  const tabs = [
    { id: 'upload', label: 'Bulk User Setup', icon: Upload },
    { id: 'reset', label: 'Password Reset', icon: Key },
    { id: 'system', label: 'System Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
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
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-white/60 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </motion.button>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Admin Settings
            </h1>

            <div className="w-32" />
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Bulk User Setup Tab */}
            {activeTab === 'upload' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Bulk User Setup
                  </h2>
                  <p className="text-gray-600">
                    Upload Excel file with user data → Generate passwords → Send credentials via email
                  </p>
                </div>

                {/* Process Steps */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    {/* Step 1 */}
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      currentStep >= 1 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Upload className="w-4 h-4" />
                      <span className="text-sm font-medium">1. Upload Excel</span>
                    </div>
                    
                    <div className="w-8 h-px bg-gray-300"></div>
                    
                    {/* Step 2 */}
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      currentStep >= 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Key className="w-4 h-4" />
                      <span className="text-sm font-medium">2. Generate Passwords</span>
                    </div>
                    
                    <div className="w-8 h-px bg-gray-300"></div>
                    
                    {/* Step 3 */}
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                      currentStep >= 3 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-medium">3. Send Emails</span>
                    </div>
                  </div>
                </div>

                {/* Template Download */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        Download Template
                      </h3>
                      <p className="text-blue-700 mb-4">
                        Download the Excel template with required columns: Email, Role (student/alumni)
                      </p>
                      <button
                        onClick={downloadTemplate}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Template
                      </button>
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Upload Excel File
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Select an Excel file containing user emails and roles
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                  >
                    <FileSpreadsheet className="w-5 h-5 mr-2" />
                    Select File
                  </button>
                </div>

                {/* Selected File Display */}
                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileSpreadsheet className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">{selectedFile.name}</p>
                          <p className="text-sm text-green-700">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      
                      {currentStep === 1 && (
                        <button
                          onClick={handlePasswordGeneration}
                          disabled={isProcessing}
                          className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isProcessing ? (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Key className="w-4 h-4 mr-2" />
                              Generate Passwords
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Processing Progress */}
                {isProcessing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-3">
                      <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                      <span className="font-medium text-blue-900">{uploadStatus}</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Success Results */}
                {uploadStatus === 'success' && processResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border border-green-200 rounded-xl p-6"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900">
                        Passwords Generated Successfully!
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {processResults.totalProcessed || 0}
                        </div>
                        <div className="text-sm text-gray-600">Users Processed</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {processResults.successCount || 0}
                        </div>
                        <div className="text-sm text-gray-600">Passwords Generated</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {processResults.errorCount || 0}
                        </div>
                        <div className="text-sm text-gray-600">Errors</div>
                      </div>
                    </div>

                    <div className="text-sm text-green-700 mb-6">
                      <p>✅ Passwords have been generated using email patterns</p>
                      <p>✅ Excel file with passwords has been downloaded</p>
                      <p>✅ Ready to send credential emails to users</p>
                    </div>

                    {currentStep === 3 && (
                      <button
                        onClick={handleSendCredentials}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                      >
                        {isProcessing ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Sending Emails...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Credential Emails
                          </>
                        )}
                      </button>
                    )}
                  </motion.div>
                )}

                {/* Email Sending Results */}
                {uploadStatus === 'credentials_sent' && processResults?.emailResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-full">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-green-900">
                        All Done! Emails Sent Successfully! 🎉
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-green-600">
                          {processResults.emailResults.emailsSent || processResults.emailsSent || 0}
                        </div>
                        <div className="text-sm font-medium text-gray-600">Emails Sent</div>
                      </div>
                      <div className="text-center p-4 bg-white rounded-xl shadow-sm">
                        <div className="text-3xl font-bold text-blue-600">
                          {processResults.totalProcessed || 0}
                        </div>
                        <div className="text-sm font-medium text-gray-600">Users Created</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">What happens next?</h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        <p>✅ Users received their login credentials via email</p>
                        <p>✅ They can now access the platform with their generated passwords</p>
                        <p>✅ Passwords follow the pattern: @EmailPrefix (e.g., @22Ce094)</p>
                        <p>✅ All user accounts are active and ready to use</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Error Display - Only show actual errors, not processing messages */}
                {uploadStatus && 
                  !['success', 'credentials_sent', 'Uploading file and generating passwords...', 'Sending credential emails to users...'].includes(uploadStatus) && 
                  !uploadStatus.includes('Connection lost. Retrying...') && 
                  !uploadStatus.includes('Generating new password...') &&
                  (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-4"
                  >
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <span className="text-red-700">{uploadStatus}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Password Reset Tab */}
            {activeTab === 'reset' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Password Reset
                  </h2>
                  <p className="text-gray-600">
                    Generate new temporary passwords for users and send them via email
                  </p>
                </div>

                <div className="max-w-md mx-auto">
                  <form onSubmit={handlePasswordReset} className="space-y-6">
                    <div>
                      <label htmlFor="resetEmail" className="block text-sm font-semibold text-gray-700 mb-2">
                        User Email Address
                      </label>
                      <input
                        type="email"
                        id="resetEmail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        placeholder="Enter user's email address"
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isResetting}
                      className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-medium rounded-xl hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                    >
                      {isResetting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4 mr-2" />
                          Reset Password
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
                        resetStatus.includes('failed') || resetStatus.includes('error')
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
                  {resetStatus === 'success' && tempPassword && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 bg-green-50 border border-green-200 rounded-xl p-6"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <h3 className="text-lg font-semibold text-green-900">
                          Password Reset Successful!
                        </h3>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Temporary Password
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={tempPassword}
                            readOnly
                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="text-sm text-green-700">
                        <p>✅ New password has been generated and sent to the user via email</p>
                        <p>✅ User will be required to change this password on first login</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* System Settings Tab */}
            {activeTab === 'system' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    System Settings
                  </h2>
                  <p className="text-gray-600">
                    Configure system-wide settings and preferences
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email Configuration */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Mail className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Email Configuration
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Email
                        </label>
                        <input
                          type="email"
                          placeholder="noreply@charusat.edu.in"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          From Name
                        </label>
                        <input
                          type="text"
                          placeholder="CHARUSAT PeerPrep"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Update Email Settings
                      </button>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="w-6 h-6 text-red-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Security Settings
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Force Password Change
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Pattern
                        </label>
                        <input
                          type="text"
                          defaultValue="@EmailPrefix"
                          readOnly
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                      <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Update Security Settings
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminSettings;