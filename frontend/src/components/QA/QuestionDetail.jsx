import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MessageSquare, User, Clock, MessageCircle, Send } from 'lucide-react';

const QuestionDetail = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answerContent, setAnswerContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchQuestionDetail();
  }, [questionId]);

  const fetchQuestionDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/questions/${questionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setQuestionData(response.data);
    } catch (err) {
      setError('Failed to fetch question details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

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

      setSubmitSuccess('Answer submitted successfully!');
      setAnswerContent('');
      // Refresh the question data to show the new answer
      fetchQuestionDetail();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/questions');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

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
            <span>Back to Questions</span>
          </button>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {questionData.question.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{questionData.question.student_email}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{formatDate(questionData.question.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span>{questionData.answers.length} answers</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {questionData.question.content}
            </p>
          </div>
        </div>

        {/* Answers Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-indigo-600" />
            Answers ({questionData.answers.length})
          </h2>

          {questionData.answers.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No answers yet. Be the first to help!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questionData.answers.map((answer, index) => (
                <div key={answer.answer_id} className="border-l-4 border-indigo-200 pl-6 py-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span className="font-medium text-indigo-600">
                        {answer.alumni_email} (Alumni)
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{formatDate(answer.created_at)}</span>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {answer.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Answer Form (Only for Alumni) */}
        {user && user.role === 'alumni' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Send className="w-5 h-5 mr-2 text-indigo-600" />
              Your Answer
            </h3>
            
            <form onSubmit={handleSubmitAnswer} className="space-y-4">
              <div>
                <textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  required
                  rows={6}
                  placeholder="Share your knowledge and help this student..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-vertical"
                />
              </div>

              {submitError && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                  {submitError}
                </div>
              )}

              {submitSuccess && (
                <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg">
                  {submitSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !answerContent.trim()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Answer
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Message for Students */}
        {user && user.role === 'student' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <p className="text-blue-800">
              Only alumni can answer questions. Your question is visible to all alumni who can provide helpful answers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;