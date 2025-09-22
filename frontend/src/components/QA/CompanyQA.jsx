import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, MessageCircle, Clock, User, Plus } from 'lucide-react';

const CompanyQA = ({ companyName }) => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAskQuestion, setShowAskQuestion] = useState(false);
  const [questionForm, setQuestionForm] = useState({  content: '' });
  const [submitting, setSubmitting] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchCompanyQuestions();
  }, [companyId]);

  const fetchCompanyQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/questions/company/${companyId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setQuestions(response.data);
    } catch (err) {
      setError('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/questions/company/${companyId}`,
        { content: questionForm.content },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setQuestionForm({ content: '' });
      setShowAskQuestion(false);
      fetchCompanyQuestions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/questions/${questionId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 flex items-center">
            <MessageCircle className="w-6 h-6 mr-3 text-indigo-500" />
            Questions about {companyName}
          </h3>
          <p className="text-slate-600 mt-1">
            Ask questions and get answers from alumni who worked at this company
          </p>
        </div>
        
        {user?.role === 'student' && (
          <button
            onClick={() => setShowAskQuestion(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ask Question</span>
          </button>
        )}
      </div>

      {showAskQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-lg font-bold mb-4">Ask a question about {companyName}</h3>
            
            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Your Question</label>
                <textarea
                  value={questionForm.content}
                  onChange={(e) => setQuestionForm({ content: e.target.value })}
                  required
                  rows={8}
                  placeholder="Ask your question about this company..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAskQuestion(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  {submitting ? 'Submitting...' : 'Submit Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No questions about {companyName} yet
            </h4>
            <p className="text-gray-600 mb-4">
              Be the first to ask a question about this company!
            </p>
            {user?.role === 'student' && (
              <button
                onClick={() => setShowAskQuestion(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Ask First Question
              </button>
            )}
          </div>
        ) : (
         questions.map((question) => (
            <div
              key={question.question_id}
              onClick={() => handleQuestionClick(question.question_id)}
              className="bg-white rounded-xl border border-gray-200 shadow-md p-6 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-900 mb-4 leading-relaxed">
                    {question.content.length > 200 
                      ? `${question.content.substring(0, 200)}...` 
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

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default CompanyQA;