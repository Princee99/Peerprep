import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  LogOut,
  MapPin,
  Globe,
  Building2,
  Star,
  Plus,
  MessageCircle,
  Calendar,
  User,
  ThumbsUp,
  Send,
  BookOpen,
  Target,
  Users,
  Award,
  Clock,
  ChevronRight,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Brain,
  Monitor,
  UserCheck,
  HandHeart,
  ChevronDown,
  Settings
} from 'lucide-react';

const CompanyDetail = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      navigate('/');
      return;
    }
    
    setUser(userData);
    fetchCompanyDetails();
  }, [companyId, navigate]);

  const fetchCompanyDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/companies/${companyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCompany(data);
      } else {
        // Fallback to mock data if API fails
        setCompany({
          id: companyId,
          name: 'Tech Company',
          location: 'Bangalore, India',
          website: 'https://example.com',
          logo_url: null,
          industry: 'Technology',
          type: 'Private',
          description: 'A leading technology company focused on innovation and digital transformation.'
        });
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
      // Fallback to mock data if API fails
      setCompany({
        id: companyId,
        name: 'Tech Company',
        location: 'Bangalore, India',
        website: 'https://example.com',
        logo_url: null,
        industry: 'Technology',
        type: 'Private',
        description: 'A leading technology company focused on innovation and digital transformation.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen, color: 'blue' },
    { id: 'aptitude', label: 'Aptitude Questions', icon: Brain, color: 'purple' },
    { id: 'technical', label: 'Technical Round', icon: Monitor, color: 'green' },
    { id: 'personal', label: 'Personal Interview', icon: UserCheck, color: 'orange' },
    { id: 'hr', label: 'HR Round', icon: HandHeart, color: 'pink' },
    { id: 'questions', label: 'Q&A', icon: MessageCircle, color: 'indigo' }
  ];

  const getTabColor = (color, isActive = false) => {
    const colors = {
      blue: isActive ? 'bg-blue-500 text-white border-blue-500' : 'text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200',
      purple: isActive ? 'bg-purple-500 text-white border-purple-500' : 'text-purple-600 hover:bg-purple-50 border-transparent hover:border-purple-200',
      green: isActive ? 'bg-green-500 text-white border-green-500' : 'text-green-600 hover:bg-green-50 border-transparent hover:border-green-200',
      orange: isActive ? 'bg-orange-500 text-white border-orange-500' : 'text-orange-600 hover:bg-orange-50 border-transparent hover:border-orange-200',
      pink: isActive ? 'bg-pink-500 text-white border-pink-500' : 'text-pink-600 hover:bg-pink-50 border-transparent hover:border-pink-200',
      indigo: isActive ? 'bg-indigo-500 text-white border-indigo-500' : 'text-indigo-600 hover:bg-indigo-50 border-transparent hover:border-indigo-200'
    };
    return colors[color] || colors.blue;
  };

  // Mock data for other sections (keeping existing mock data)
  const mockReviews = {
    aptitude: [
      {
        id: 1,
        author: 'Sarah Johnson',
        role: 'Software Engineer',
        date: '2 months ago',
        content: 'The aptitude test was quite challenging. Focus on data interpretation, logical reasoning, and basic mathematics. Time management is crucial.',
        rating: 4,
        helpful: 12
      }
    ],
    technical: [
      {
        id: 2,
        author: 'Mike Chen',
        role: 'Senior Developer',
        date: '1 month ago',
        content: 'Technical round focused on algorithms and data structures. Be prepared for coding questions on arrays, strings, and trees. They also asked about system design.',
        rating: 5,
        helpful: 18
      }
    ],
    personal: [
      {
        id: 3,
        author: 'Emily Davis',
        role: 'Product Manager',
        date: '3 weeks ago',
        content: 'Personal interview was conversational. They asked about my projects, challenges I faced, and how I solved them. Be honest and show enthusiasm.',
        rating: 4,
        helpful: 15
      }
    ],
    hr: [
      {
        id: 4,
        author: 'David Wilson',
        role: 'Data Scientist',
        date: '2 weeks ago',
        content: 'HR round was mostly about culture fit and behavioral questions. They asked about teamwork, leadership, and why I wanted to join this company.',
        rating: 5,
        helpful: 20
      }
    ]
  };

  const mockQuestions = [
    {
      id: 1,
      author: 'Student123',
      question: 'What is the typical duration of the technical interview?',
      date: '1 week ago',
      answers: [
        {
          id: 1,
          author: 'Alumni Expert',
          content: 'Usually 45-60 minutes. Be prepared for both coding and system design questions.',
          date: '5 days ago',
          helpful: 8
        }
      ]
    },
    {
      id: 2,
      author: 'Placement2024',
      question: 'Do they ask questions about specific programming languages?',
      date: '3 days ago',
      answers: [
        {
          id: 2,
          author: 'Senior Dev',
          content: 'They focus on problem-solving rather than specific languages, but knowing Python, Java, or C++ helps.',
          date: '2 days ago',
          helpful: 5
        }
      ]
    }
  ];

  const placementSteps = [
    {
      step: 1,
      title: 'Online Application',
      description: 'Submit your resume and cover letter through the company portal',
      icon: Send,
      color: 'blue'
    },
    {
      step: 2,
      title: 'Aptitude Test',
      description: 'Online assessment covering logical reasoning and quantitative skills',
      icon: Brain,
      color: 'purple'
    },
    {
      step: 3,
      title: 'Technical Interview',
      description: 'Coding challenges and system design discussions',
      icon: Monitor,
      color: 'green'
    },
    {
      step: 4,
      title: 'Personal Interview',
      description: 'Behavioral questions and project discussions',
      icon: UserCheck,
      color: 'orange'
    },
    {
      step: 5,
      title: 'HR Round',
      description: 'Final culture fit and offer discussion',
      icon: HandHeart,
      color: 'pink'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
          />
          <p className="text-slate-600 font-medium">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <Building2 className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Company not found</h3>
          <p className="text-slate-600 mb-6">The company you're looking for doesn't exist.</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBack}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Go Back
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200/60 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Back Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 rounded-lg transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium hidden sm:block">Back</span>
            </motion.button>

            {/* Center Section - Navigation Tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              {tabs.slice(0, 4).map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 border ${
                      activeTab === tab.id
                        ? getTabColor(tab.color, true)
                        : getTabColor(tab.color, false)
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden lg:block">{tab.label}</span>
                  </motion.button>
                );
              })}
              
              {/* More Menu for remaining tabs */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200"
                >
                  <span>More</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.button>
              </div>
            </nav>

            {/* Mobile Navigation */}
            <nav className="md:hidden">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </nav>

            {/* Right Section - User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-3 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/50 hover:bg-white transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-600 capitalize">{user?.role}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </motion.button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-slate-200/50 py-2"
                  >
                    <button className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 transition-colors flex items-center space-x-2">
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <hr className="my-2 border-slate-200" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Company Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl p-8">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-8 space-y-6 md:space-y-0">
              {/* Company Logo */}
              <div className="flex-shrink-0">
                {company.logo_url ? (
                  <div className="relative">
                    <img
                      src={`http://localhost:5000${company.logo_url}`}
                      alt={company.name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover shadow-lg border border-white/50"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent"></div>
                  </div>
                ) : (
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 rounded-2xl flex items-center justify-center shadow-lg border border-white/50">
                    <span className="text-white text-2xl md:text-3xl font-bold tracking-wide">
                      {company.name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Company Information */}
              <div className="flex-1 space-y-4">
                {/* Company Name and Description */}
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{company.name}</h1>
                  {company.description && (
                    <p className="text-slate-600 text-lg leading-relaxed">{company.description}</p>
                  )}
                </div>

                {/* Company Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Location */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/80 transition-all duration-200"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</p>
                      <p className="font-semibold text-slate-900">{company.location}</p>
                    </div>
                  </motion.div>

                  {/* Website */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/80 transition-all duration-200"
                  >
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Globe className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Website</p>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1 group"
                      >
                        <span className="truncate">Visit Site</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </motion.div>

                  {/* Industry */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/80 transition-all duration-200"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Briefcase className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry</p>
                      <p className="font-semibold text-slate-900">{company.industry || 'Technology'}</p>
                    </div>
                  </motion.div>

                  {/* Company Type */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/40 hover:bg-white/80 transition-all duration-200"
                  >
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Building2 className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</p>
                      <p className="font-semibold text-slate-900">{company.type || 'Private'}</p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Placement Process */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-blue-600" />
                  Placement Process
                </h2>

                <div className="space-y-6">
                  {placementSteps.map((step, index) => {
                    const IconComponent = step.icon;
                    return (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-4 p-6 bg-white/60 rounded-xl hover:bg-white/80 transition-all duration-200"
                      >
                        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                          step.color === 'blue' ? 'bg-blue-100' :
                          step.color === 'purple' ? 'bg-purple-100' :
                          step.color === 'green' ? 'bg-green-100' :
                          step.color === 'orange' ? 'bg-orange-100' :
                          'bg-pink-100'
                        }`}>
                          <IconComponent className={`w-6 h-6 ${
                            step.color === 'blue' ? 'text-blue-600' :
                            step.color === 'purple' ? 'text-purple-600' :
                            step.color === 'green' ? 'text-green-600' :
                            step.color === 'orange' ? 'text-orange-600' :
                            'text-pink-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-bold text-slate-500">STEP {step.step}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                          <p className="text-slate-600">{step.description}</p>
                        </div>

                        {index < placementSteps.length - 1 && (
                          <ChevronRight className="w-5 h-5 text-slate-400 mt-4" />
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Other tab contents remain the same but with updated styling */}
          {['aptitude', 'technical', 'personal', 'hr'].includes(activeTab) && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <Star className="w-6 h-6 mr-3 text-yellow-500" />
                  {tabs.find(tab => tab.id === activeTab)?.label} Reviews
                </h2>
                
                {user?.role === 'alumni' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddReview(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Review</span>
                  </motion.button>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {mockReviews[activeTab]?.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{review.author}</h4>
                          <p className="text-sm text-slate-600">{review.role}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500">{review.date}</p>
                      </div>
                    </div>
                    
                    <p className="text-slate-700 mb-4">{review.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm">Helpful ({review.helpful})</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}

                {(!mockReviews[activeTab] || mockReviews[activeTab].length === 0) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <Star className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No reviews yet</h3>
                    <p className="text-slate-600 mb-6">Be the first to share your experience!</p>
                    {user?.role === 'alumni' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddReview(true)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        Add First Review
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'questions' && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center">
                  <MessageCircle className="w-6 h-6 mr-3 text-indigo-500" />
                  Questions & Answers
                </h2>
                
                {user?.role === 'student' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAskQuestion(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Ask Question</span>
                  </motion.button>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {mockQuestions.map((question, index) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                    className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6"
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{question.author}</p>
                          <p className="text-xs text-slate-500">{question.date}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Question */}
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">{question.question}</h3>
                    
                    {/* Answers */}
                    <div className="space-y-4">
                      {question.answers.map((answer) => (
                        <motion.div
                          key={answer.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="ml-6 pl-6 border-l-2 border-blue-200 bg-blue-50/50 backdrop-blur-sm rounded-r-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                              </div>
                              <p className="font-medium text-slate-900">{answer.author}</p>
                              <p className="text-xs text-slate-500">{answer.date}</p>
                            </div>
                            
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center space-x-1 text-slate-600 hover:text-blue-600 transition-colors"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span className="text-sm">{answer.helpful}</span>
                            </motion.button>
                          </div>
                          <p className="text-slate-700">{answer.content}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Answer Button for Alumni */}
                    {user?.role === 'alumni' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Answer this question</span>
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                ))}

                {mockQuestions.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-white/50 backdrop-blur-xl rounded-2xl border border-white/40"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">No questions yet</h3>
                    <p className="text-slate-600 mb-6">Be the first to ask a question!</p>
                    {user?.role === 'student' && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAskQuestion(true)}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                      >
                        Ask First Question
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanyDetail;