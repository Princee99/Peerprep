import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MessageSquare, MessageCircle, Clock, User, Plus } from 'lucide-react';

const QuestionList = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/questions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (user && user.role === 'student') {
      navigate('/student-dashboard');
    } else if (user && user.role === 'alumni') {
      navigate('/alumni-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/questions/${questionId}`);
  };

  const handleAskQuestion = () => {
    navigate('/ask-question');
  };

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Dashboard</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="w-8 h-8 mr-3 text-indigo-600" />
                Q&A Community
              </h1>
              <p className="text-gray-600 mt-2">
                Ask questions and get answers from our alumni community
              </p>
            </div>
            
            {user && user.role === 'student' && (
              <button
                onClick={handleAskQuestion}
                className="mt-4 sm:mt-0 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ask Question
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No questions found' : 'No questions yet'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms' 
                  : 'Be the first to ask a question!'
                }
              </p>
              {user && user.role === 'student' && (
                <button
                  onClick={handleAskQuestion}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Ask Your First Question
                </button>
              )}
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <div
                key={question.question_id}
                onClick={() => handleQuestionClick(question.question_id)}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                      {question.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {question.content.length > 150 
                        ? `${question.content.substring(0, 150)}...` 
                        : question.content
                      }
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{question.student_email}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{formatDate(question.created_at)}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span>{question.answer_count} answers</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      parseInt(question.answer_count) > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {parseInt(question.answer_count) > 0 ? 'Answered' : 'Unanswered'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">
              {questions.length}
            </div>
            <div className="text-gray-600">Total Questions</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {questions.filter(q => parseInt(q.answer_count) > 0).length}
            </div>
            <div className="text-gray-600">Answered Questions</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {questions.filter(q => parseInt(q.answer_count) === 0).length}
            </div>
            <div className="text-gray-600">Unanswered Questions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;