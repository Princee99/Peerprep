import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Building2,
  MapPin,
  Globe,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  User,
  LogOut,
  TrendingUp,
  Users,
  Star,
  Target,
  Settings,
  Filter,
  MessageSquare
} from 'lucide-react';
import useDeleteCompany from '../../hooks/useDeleteCompany';
import useUpdateCompany from '../../hooks/useUpdateCompany';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { deleteCompany, loading: deleteLoading, error: deleteError, success: deleteSuccess } = useDeleteCompany();
  const { updateCompany, loading: updateLoading, error: updateError, success: updateSuccess } = useUpdateCompany();

  // Add Company Form State
  const [newCompany, setNewCompany] = useState({
    name: '',
    location: '',
    website: '',
    logo: ''
  });

  // Update Company Form State
  const [showUpdateCompany, setShowUpdateCompany] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || userData.role !== 'admin') {
      navigate('/login/admin');
      return;
    }
    
    setUser(userData);
    fetchCompanies();
  }, [navigate]);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/companies', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      } else {
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleCompanyClick = (companyId) => {
    navigate(`/company/${companyId}`);
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (newCompany.name && newCompany.location && newCompany.website) {
      setIsAddingCompany(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', newCompany.name);
        formData.append('location', newCompany.location);
        formData.append('website', newCompany.website);
        if (newCompany.logo) formData.append('logo', newCompany.logo);

        const response = await fetch('http://localhost:5000/api/companies', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          await fetchCompanies();
          setNewCompany({ name: '', location: '', website: '', logo: '' });
          setShowAddCompany(false);
        } else {
          alert('Failed to add company. Please try again.');
        }
      } catch (error) {
        alert('Failed to add company. Please try again.');
      } finally {
        setIsAddingCompany(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewCompany(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats data
  const stats = [
    {
      title: 'Total Companies',
      value: companies.length.toString(),
      change: '+12%',
      changeType: 'positive',
      icon: Building2,
      color: 'blue'
    },
    {
      title: 'Active Reviews',
      value: '284',
      change: '+5%',
      changeType: 'positive',
      icon: Star,
      color: 'yellow'
    },
    {
      title: 'Student Participation',
      value: '1,247',
      change: '+18%',
      changeType: 'positive',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Success Rate',
      value: '78%',
      change: '+3%',
      changeType: 'positive',
      icon: Target,
      color: 'purple'
    }
  ];

  const getStatColor = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600'
    };
    return colors[color] || colors.yellow;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-200">
      {/* Sticky Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">CHARUSAT</h1>
                  <p className="text-xs text-gray-500">Admin Portal</p>
                </div>
              </motion.div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* User Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || 'Administrator'}
                    </p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
                    >
                      <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </button>
                      <button
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </button>
                      <hr className="my-2 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Administrator'}
          </h2>
          <p className="text-gray-600">
            Manage placement companies and track student progress from your dashboard.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${getStatColor(stat.color)}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Companies Management Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          {/* Section Header */}
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Companies Management
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Manage placement partner companies and their details
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddCompany(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Company
              </motion.button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </motion.button>
            </div>
          </div>

          {/* Companies Grid */}
          <div className="p-6">
            {filteredCompanies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompanies.map((company, index) => (
                  <motion.div
                    key={company.company_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => handleCompanyClick(company.company_id)}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {company.logo_url ? (
                          <img
                            src={`http://localhost:5000${company.logo_url}`}
                            alt={company.name}
                            className="w-12 h-12 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {company.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {company.name}
                        </h4>
                        
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
                          <span className="truncate">{company.location}</span>
                        </div>
                        
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <Globe className="w-4 h-4 mr-1 flex-shrink-0" />
                          <a 
                            href={company.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="truncate hover:text-blue-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {company.website}
                          </a>
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle more options
                          }}
                          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <span className="text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-200">
                        View Details →
                      </span>
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCompany(company);
                            setShowUpdateCompany(true);
                          }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete ${company.name}?`)) {
                              deleteCompany(company.company_id).then(() => fetchCompanies());
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No companies found' : 'No companies yet'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms or add a new company'
                    : 'Start by adding your first company to the platform'
                  }
                </p>
                {searchTerm ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Clear Search
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddCompany(true)}
                    className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Company
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </main>

      {/* Add Company Dialog */}
      <AnimatePresence>
        {showAddCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddCompany(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dialog Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Add New Company
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddCompany(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              {/* Dialog Content */}
              <form onSubmit={handleAddCompany} className="p-6 space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newCompany.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter company name"
                    disabled={isAddingCompany}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={newCompany.location}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter company location"
                    disabled={isAddingCompany}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
                    Website *
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={newCompany.website}
                    onChange={handleInputChange}
                    required
                    placeholder="https://example.com"
                    disabled={isAddingCompany}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div>
                  <label htmlFor="logo" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    accept="image/*"
                    onChange={handleInputChange}
                    disabled={isAddingCompany}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 transition-all duration-200 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 file:transition-colors"
                  />
                </div>

                {/* Dialog Actions */}
                <div className="flex justify-end space-x-3 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowAddCompany(false)}
                    disabled={isAddingCompany}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isAddingCompany}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center shadow-lg"
                  >
                    {isAddingCompany && (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                      />
                    )}
                    {isAddingCompany ? 'Adding...' : 'Add Company'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Update Company Dialog */}
      <AnimatePresence>
        {showUpdateCompany && selectedCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowUpdateCompany(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Update Company</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUpdateCompany(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target;
                  const updatedData = {
                    name: form.name.value,
                    location: form.location.value,
                    website: form.website.value,
                    logo: form.logo.files[0] || null
                  };
                  await updateCompany(selectedCompany.company_id, updatedData);
                  setShowUpdateCompany(false);
                  fetchCompanies();
                }}
                className="p-6 space-y-5"
                encType="multipart/form-data"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={selectedCompany.name}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    defaultValue={selectedCompany.location}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">Website *</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    defaultValue={selectedCompany.website}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label htmlFor="logo" className="block text-sm font-semibold text-gray-700 mb-2">Company Logo</label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    accept="image/*"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 file:transition-colors"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-6">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowUpdateCompany(false)}
                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center shadow-lg"
                  >
                    {updateLoading ? 'Updating...' : 'Update Company'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close dropdowns */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;