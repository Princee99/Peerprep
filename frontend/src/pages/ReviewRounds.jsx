import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const roundTypes = [
  { value: 'aptitude', label: 'Aptitude' },
  { value: 'technical', label: 'Technical' },
  { value: 'hr', label: 'HR' },
  { value: 'other', label: 'Other' }
];

const ReviewRounds = () => {
  const { companyId, reviewId } = useParams();
  const navigate = useNavigate();
  const [selectedRound, setSelectedRound] = useState('');
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRoundSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/reviews/${reviewId}/rounds`,
        {
          round_type: selectedRound,
          description,
          tips
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setMessage('Round review submitted!');
      setDescription('');
      setTips('');
      setSelectedRound('');
    } catch (err) {
      setMessage('Failed to submit round review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add Review Rounds</h2>
        <form onSubmit={handleRoundSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Round Type</label>
            <select
              value={selectedRound}
              onChange={e => setSelectedRound(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select round</option>
              {roundTypes.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Tips (optional)</label>
            <textarea
              value={tips}
              onChange={e => setTips(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {loading ? 'Submitting...' : 'Submit Round Review'}
          </button>
        </form>
        {message && (
          <div
            className={`mt-4 text-center text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
              message === 'Round review submitted!'
                ? 'bg-green-100 text-green-700 border border-green-300 shadow'
                : 'bg-red-100 text-red-700 border border-red-300 shadow'
            }`}
          >
            {message}
          </div>
        )}
        <button
          onClick={() => navigate(`/company/${companyId}`)}
          className="mt-6 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Back to Company
        </button>
      </div>
    </div>
  );
};

export default ReviewRounds;