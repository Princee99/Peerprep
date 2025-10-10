import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Building2,
  MapPin,
  Globe,
  User,
  LogOut,
  BookOpen,
  Star,
  Target,
  Settings,
  Filter,
  GraduationCap,
  Users,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Award,
  Calendar,
  MessageCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    // Check if user is logged in and is student
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || userData.role !== 'student') {
      navigate('/login/student');
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

  const filteredCompanies = companies
    .filter(company =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(company => selectedLocation ? company.location === selectedLocation : true);

  const uniqueLocations = Array.from(new Set(companies.map(c => c.location))).sort();

  // Student-specific stats
  const [overview, setOverview] = useState({ totalCompanies: 0, totalReviews: 0, totalQuestions: 0 });
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/stats/overview', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          setOverview(data);
        }
      } catch (e) {}
    };
    fetchOverview();
  }, []);

  const studentStats = [
    { title: 'Companies Available', value: String(overview.totalCompanies), description: 'Explore placement opportunities', icon: Building2, color: 'blue', gradient: 'from-blue-500 to-blue-600' },
    { title: 'Alumni Reviews', value: String(overview.totalReviews), description: 'Real placement experiences', icon: Star, color: 'yellow', gradient: 'from-yellow-500 to-yellow-600' },
    { title: 'Interview Questions', value: String(overview.totalQuestions), description: 'Practice questions available', icon: MessageSquare, color: 'green', gradient: 'from-green-500 to-green-600' }
  ];

  const getStatColor = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
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
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-gray-900">PeerPrep</h1>
                  <p className="text-xs text-gray-500">Student Portal</p>
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
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || 'Student'}
                    </p>
                    <p className="text-xs text-gray-500">Student</p>
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
                        onClick={() => {
                          setShowUserDropdown(false);
                          navigate('/student/settings');
                        }}
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
            Welcome back, {user?.name || 'Student'}! 🎓
          </h2>
          <p className="text-gray-600">
            Explore companies, read alumni reviews, and prepare for your placement journey.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {studentStats.map((stat, index) => {
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
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Companies Section */}
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
                  Explore Companies
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Discover placement opportunities and read alumni experiences
                </p>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{companies.length} Companies Available</span>
              </div>
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
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setShowFilters(v => !v)}
                className="inline-flex items-center px-4 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? 'Hide Filters' : 'Filter'}
              </motion.button>
            </div>
          </div>
          {showFilters && (
            <div className="px-6 py-4 border-b border-gray-200 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-semibold mb-2">Location</label>
                  <select
                    value={selectedLocation}
                    onChange={e => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-gray-900"
                  >
                    <option value="">All locations</option>
                    {uniqueLocations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Apply
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => { setSelectedLocation(''); setShowFilters(false); }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </motion.button>
                </div>
              </div>
            </div>
          )}

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
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {company.logo_url ? (
                          <img
                            src={`http://localhost:5000${company.logo_url}`}
                            alt={company.name}
                            className="w-12 h-12 rounded-xl bg-white p-1 object-contain"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {company.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
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
                            className="truncate hover:text-indigo-600 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {company.website}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                      <span className="text-sm text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center">
                        Explore Company
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </span>
                      <div className="flex items-center space-x-3 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex items-center">
                          <Star className="w-3.5 h-3.5 mr-1" />
                          <span>Reviews</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-3.5 h-3.5 mr-1" />
                          <span>Questions</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                  {searchTerm ? (
                    <Search className="w-8 h-8 text-gray-400" />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No companies found' : 'No companies available'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms'
                    : 'Companies will appear here once they are added to the platform'
                  }
                </p>
                {searchTerm && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSearchTerm('')}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Clear Search
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </motion.div>

      
      </main>

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

export default StudentDashboard;