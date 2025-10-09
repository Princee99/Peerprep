import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MessageCircle, Clock, User, Plus, X } from 'lucide-react';

const QuestionDetails = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchQuestionDetails();
    // eslint-disable-next-line
  }, [questionId]);

  const fetchQuestionDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/questions/${questionId}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      setQuestionData(response.data);
    } catch (err) {
      setError('Failed to fetch question details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnswer = () => {
    setShowAnswerForm(true);
    setAnswerContent('');
    setSubmitError('');
  };

  const handleCancelAnswer = () => {
    setShowAnswerForm(false);
    setAnswerContent('');
    setSubmitError('');
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/questions/${questionId}/answers`,
        { content: answerContent },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setShowAnswerForm(false);
      setAnswerContent('');
      fetchQuestionDetails(); // Refresh answers
    } catch (err) {
      setSubmitError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        'Failed to submit answer.'
      );
    } finally {
      setSubmitting(false);
    }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !questionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Question not found'}</p>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => {
            const companyId = questionData?.question?.company_id;
            if (companyId) {
              navigate(`/company/${companyId}?tab=questions`);
            } else {
              navigate(-1);
            }
          }}
          className="mb-6 flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Back to Questions</span>
        </button>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-xl font-bold text-gray-900 flex items-center mb-4">
            <MessageCircle className="w-6 h-6 mr-3 text-indigo-500" />
            Question
          </h1>
          
          <p className="text-gray-900 mb-4 leading-relaxed text-lg">
            {questionData.question.content}
          </p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {user?.role === 'admin' && questionData.question.student_email && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{questionData.question.student_email}</span>
              </div>
            )}
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{formatDate(questionData.question.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">
              Answers ({questionData.answers.length})
            </h2>
            {(user?.role === 'alumni' || user?.role === 'admin') && !showAnswerForm && (
              <button
                onClick={handleAddAnswer}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Answer
              </button>
            )}
          </div>

          {/* Add Answer Form */}
          {showAnswerForm && (
            <form onSubmit={handleAnswerSubmit} className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <textarea
                value={answerContent}
                onChange={e => setAnswerContent(e.target.value)}
                required
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg mb-3"
                placeholder="Write your answer here..."
                disabled={submitting}
              />
              {submitError && (
                <div className="text-red-600 mb-2">{submitError}</div>
              )}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={submitting || !answerContent.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {submitting ? 'Submitting...' : 'Submit Answer'}
                </button>
                <button
                  type="button"
                  onClick={handleCancelAnswer}
                  disabled={submitting}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4 mr-1 inline" /> Cancel
                </button>
              </div>
            </form>
          )}

          {questionData.answers.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                No answers yet
              </h4>
              <p className="text-gray-600">
                Be the first to answer this question!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {questionData.answers.map((answer) => (
                <div key={answer.answer_id} className="border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-900 mb-3 leading-relaxed">
                    {answer.content}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {user?.role === 'admin' && answer.alumni_email && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        <span>{answer.alumni_email}</span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatDate(answer.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;