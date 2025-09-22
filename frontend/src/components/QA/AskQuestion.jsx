import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MessageSquare } from 'lucide-react';

const AskQuestion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/questions',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Redirect to questions list after successful submission
      navigate('/questions');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit question');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.role === 'student') {
      navigate('/student-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="w-8 h-8 mr-3 text-indigo-600" />
            Ask a Question
          </h1>
          <p className="text-gray-600 mt-2">
            Get help from our alumni community by asking your questions
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., How to prepare for technical interviews at Google?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Content Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Question Details *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={8}
                placeholder="Provide detailed information about your question. Include context, what you've already tried, and what specific help you're looking for..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-vertical"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formData.title.trim() || !formData.content.trim()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask Question
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Guidelines */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Tips for asking good questions:
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                Be specific and clear about what you're asking
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                Include relevant context and background information
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                Mention what you've already tried or researched
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                Use proper grammar and formatting for better readability
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                Be respectful and courteous to the alumni helping you
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;