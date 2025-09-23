import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  LogOut,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  Briefcase,
  Edit3,
  Save,
  X,
  Camera,
  MapPin,
  Calendar,
  Award,
  Loader2,
  School
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    college_name: '',
    graduation_year: '',
    current_company: '',
    designation: '',
    bio: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUser(data.user);
      
      // Initialize form data
      setFormData({
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        department: data.user.department || '',
        college_name: data.user.college_name || '',
        graduation_year: data.user.graduation_year || '',
        current_company: data.user.current_company || '',
        designation: data.user.designation || '',
        bio: data.user.bio || ''
      });
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update local storage and state
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'student': return 'Student';
      case 'alumni': return 'Alumni';
      case 'admin': return 'Administrator';
      default: return role;
    }
  };

  const getRoleColors = (role) => {
    switch (role) {
      case 'student': 
        return {
          badge: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
          avatar: 'bg-gradient-to-br from-indigo-500 to-purple-600',
          header: 'from-indigo-500 to-purple-600'
        };
      case 'alumni': 
        return {
          badge: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
          avatar: 'bg-gradient-to-br from-green-500 to-emerald-600',
          header: 'from-green-500 to-emerald-600'
        };
      case 'admin': 
        return {
          badge: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white',
          avatar: 'bg-gradient-to-br from-blue-500 to-cyan-600',
          header: 'from-blue-500 to-cyan-600'
        };
      default: 
        return {
          badge: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white',
          avatar: 'bg-gradient-to-br from-gray-500 to-gray-600',
          header: 'from-gray-500 to-gray-600'
        };
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
          <p className="text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  const roleColors = getRoleColors(user?.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-white/60 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </motion.button>

            <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Profile
            </h1>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50/80 rounded-xl transition-all duration-200 backdrop-blur-sm"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Message Display */}
      <AnimatePresence>
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className={`px-6 py-3 rounded-lg shadow-lg ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Profile Header Card */}
          <motion.div
            whileHover={{ y: -2 }}
            className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${roleColors.header} opacity-5`} />
            
            <div className="relative p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-6 sm:space-y-0 sm:space-x-8">
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`w-32 h-32 rounded-2xl ${roleColors.avatar} flex items-center justify-center shadow-2xl relative overflow-hidden`}
                  >
                    <User className="w-16 h-16 text-white" />
                  </motion.div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-3xl font-bold text-slate-900 mb-3">
                    {user?.name || 'User Name'}
                  </h2>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${roleColors.badge} shadow-lg`}>
                      {getRoleDisplayName(user?.role)}
                    </span>
                    
                    <div className="flex items-center text-slate-600 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-full">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm">{user?.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <School className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 font-medium">College</p>
                      <p className="text-lg font-bold text-slate-900">{formData.college_name || 'N/A'}</p>
                    </div>
                    
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <GraduationCap className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 font-medium">Department</p>
                      <p className="text-lg font-bold text-slate-900">{formData.department || 'N/A'}</p>
                    </div>
                    
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 font-medium">Year</p>
                      <p className="text-lg font-bold text-slate-900">{formData.graduation_year || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                <User className="w-6 h-6 mr-3 text-blue-600" />
                Personal Information
              </h3>
              
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </motion.button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-600 transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 cursor-not-allowed"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-600 transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-600 transition-all duration-200"
                >
                  <option value="">Select Department</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">College Name</label>
                <input
                  type="text"
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your college name"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-600 transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">Graduation Year</label>
                <input
                  type="number"
                  name="graduation_year"
                  value={formData.graduation_year}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="2000"
                  max="2030"
                  placeholder="e.g., 2024"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-600 transition-all duration-200"
                />
              </div>
            </div>
          </motion.div>

          {/* Professional Information (for Alumni) */}
          <AnimatePresence>
            {user?.role === 'alumni' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                  <Briefcase className="w-6 h-6 mr-3 text-green-600" />
                  Professional Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Current Company</label>
                    <input
                      type="text"
                      name="current_company"
                      value={formData.current_company}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your current company"
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-600 transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Enter your designation"
                      className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-600 transition-all duration-200"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-8"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
              <Award className="w-6 h-6 mr-3 text-purple-600" />
              About Me
            </h3>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                rows="5"
                placeholder="Tell us about yourself, your interests, achievements, and goals..."
                className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100 disabled:text-slate-600 transition-all duration-200 resize-none"
              />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <AnimatePresence mode="wait">
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      department: user?.department || '',
                      college_name: user?.college_name || '',
                      graduation_year: user?.graduation_year || '',
                      current_company: user?.current_company || '',
                      designation: user?.designation || '',
                      bio: user?.bio || ''
                    });
                    setMessage({ type: '', text: '' });
                  }}
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 border border-slate-200 rounded-xl hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;