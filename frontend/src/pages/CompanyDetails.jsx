import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, Globe, Users, Briefcase, Clock, 
  ChevronDown, ChevronUp, Award, MessageSquare, FileText,
  CheckCircle, XCircle, ArrowLeft, Calendar
} from 'lucide-react';
import apiClient from '../services/apiClient';

const CompanyDetails = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [reviewsByRole, setReviewsByRole] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [selectedReview, setSelectedReview] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [loadingRounds, setLoadingRounds] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch company details
        const token = localStorage.getItem('token');
        const companyResponse = await fetch(`http://localhost:5000/api/companies/${companyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!companyResponse.ok) {
          throw new Error('Failed to fetch company details');
        }
        
        const companyData = await companyResponse.json();
        setCompany(companyData);
        
        // Fetch reviews for this company
        const reviewsResponse = await fetch(`http://localhost:5000/api/companies/${companyId}/reviews`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch company reviews');
        }
        
        const reviewsData = await reviewsResponse.json();
        
        // Group reviews by job role
        const groupedReviews = {};
        reviewsData.forEach(review => {
          if (!groupedReviews[review.job_role]) {
            groupedReviews[review.job_role] = [];
          }
          groupedReviews[review.job_role].push(review);
        });
        
        setReviewsByRole(groupedReviews);
      } catch (err) {
        console.error('Error fetching company data:', err);
        setError('Failed to load company information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [companyId]);

  const toggleExpand = (roleId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [roleId]: !prev[roleId]
    }));
  };

  const handleReviewClick = async (review) => {
    setSelectedReview(review);
    setLoadingRounds(true);
    
    try {
      const token = localStorage.getItem('token');
      // Fetch rounds for this review
      const response = await fetch(`http://localhost:5000/api/reviews/${review.review_id}/rounds`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch review rounds');
      }
      
      const data = await response.json();
      setRounds(data);
    } catch (err) {
      console.error('Error fetching review rounds:', err);
    } finally {
      setLoadingRounds(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"/>
          <p className="text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Company not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to companies</span>
          </button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              {company.logo_url ? (
                <img
                  src={`http://localhost:5000${company.logo_url}`}
                  alt={company.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {company.name.charAt(0)}
                  </span>
                </div>
              )}
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{company.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{company.location}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-1" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      Website
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {Object.keys(reviewsByRole).length} Job Roles
              </span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                {Object.values(reviewsByRole).flat().length} Reviews
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Roles & Reviews */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
              Job Roles & Reviews
            </h2>
            
            {Object.keys(reviewsByRole).length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No reviews available yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(reviewsByRole).map(([role, reviews]) => (
                  <div key={role} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleExpand(role)}
                      className="w-full flex items-center justify-between bg-gray-50 px-4 py-3 text-left"
                    >
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{role}</span>
                        <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          {reviews.length}
                        </span>
                      </div>
                      {expandedReviews[role] ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>
                    
                    {expandedReviews[role] && (
                      <div className="divide-y divide-gray-200">
                        {reviews.map((review) => (
                          <motion.div
                            key={review.review_id}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`p-4 hover:bg-gray-50 cursor-pointer ${
                              selectedReview?.review_id === review.review_id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                            }`}
                            onClick={() => handleReviewClick(review)}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="font-medium text-gray-900">{review.placement_type === 'on-campus' ? 'On Campus' : 'Off Campus'}</span>
                                  {review.offer_status === 'offer' ? (
                                    <span className="flex items-center text-xs text-green-700">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      Offer Received
                                    </span>
                                  ) : (
                                    <span className="flex items-center text-xs text-red-700">
                                      <XCircle className="w-3 h-3 mr-1" />
                                      No Offer
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  <span>{formatDate(review.created_at)}</span>
                                </div>
                              </div>
                              <div className="text-xs font-medium text-indigo-600">
                                View Details
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Review Details & Rounds */}
        <div className="lg:col-span-2">
          {selectedReview ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedReview.job_role} - Interview Experience
                  </h2>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedReview.offer_status === 'offer' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedReview.offer_status === 'offer' ? 'Offer Received' : 'No Offer'}
                  </div>
                </div>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span className="mr-4">{selectedReview.placement_type === 'on-campus' ? 'On Campus' : 'Off Campus'}</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{formatDate(selectedReview.created_at)}</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-indigo-600" />
                Interview Rounds
              </h3>
              
              {loadingRounds ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"/>
                </div>
              ) : rounds.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                  No round details available for this review.
                </div>
              ) : (
                <div className="space-y-6">
                  {rounds.map((round) => (
                    <div key={round.round_id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-semibold text-indigo-700 capitalize mb-2">
                        {round.round_type} Round
                      </h4>
                      <p className="text-gray-700 mb-3 whitespace-pre-line">{round.description}</p>
                      {round.tips && (
                        <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                          <div className="flex items-center text-sm font-medium text-green-800 mb-1">
                            <Award className="w-4 h-4 mr-1" />
                            Tips from Alumni
                          </div>
                          <p className="text-sm text-green-700">{round.tips}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Review</h3>
              <p className="text-gray-500 text-center">
                Click on any review from the left panel to see detailed round information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;