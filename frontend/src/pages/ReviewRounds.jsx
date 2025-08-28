import React, { useEffect, useState } from 'react';
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
  const [company, setCompany] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [selectedRound, setSelectedRound] = useState('');
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Log route params
  useEffect(() => {
    console.log("Route params:", { companyId, reviewId });
    // If these are undefined, there's a routing issue
  }, [companyId, reviewId]);

  // Fetch company details
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://localhost:5000/api/companies/${companyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompany(res.data);
      } catch (err) {
        console.error("Error fetching company:", err);
      }
    };
    
    fetchCompany();
  }, [companyId]);

  // Fetch all rounds for this review
  const fetchRounds = async () => {

     if (!reviewId) {
    console.log("No reviewId available, skipping fetch");
    setLoadingData(false);
    return;
  }
    try {
      setLoadingData(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(
        `http://localhost:5000/api/reviews/${reviewId}/rounds`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRounds(res.data);
    } catch (err) {
      console.error("Error fetching rounds:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // Load rounds when component mounts
  useEffect(() => {
    fetchRounds();
  }, [reviewId]);

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
      
      // Refresh rounds list
      fetchRounds();
    } catch (err) {
      console.error("Error submitting round:", err.response?.data || err.message);
      setMessage(`Failed to submit round review: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Company Header */}
        {company && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{company.name}</h1>
            <div className="flex items-center text-gray-600 text-sm">
              <span className="mr-3">{company.location}</span>
              {company.website && (
                <a 
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {company.website}
                </a>
              )}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Existing Rounds */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Interview Rounds</h2>
            {loadingData ? (
              <p className="text-gray-500">Loading rounds...</p>
            ) : rounds.length === 0 ? (
              <p className="text-gray-500">No rounds submitted yet.</p>
            ) : (
              <ul className="space-y-3">
                {rounds.map((round) => (
                  <li key={round.round_id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold capitalize text-blue-700">{round.round_type} Round</div>
                    <p className="mt-1 text-gray-700">{round.description}</p>
                    {round.tips && <p className="mt-2 text-sm text-green-700">Tips: {round.tips}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Add New Round Form */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Add New Round</h2>
            <form onSubmit={handleRoundSubmit} className="space-y-4">
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
                  rows={4}
                  placeholder="Describe your interview experience for this round..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Tips (optional)</label>
                <textarea
                  value={tips}
                  onChange={e => setTips(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Any tips for other students..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Round Review'}
              </button>
              
              {message && (
                <div
                  className={`mt-2 text-center text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 ${
                    message === 'Round review submitted!'
                      ? 'bg-green-100 text-green-700 border border-green-300 shadow'
                      : 'bg-red-100 text-red-700 border border-red-300 shadow'
                  }`}
                >
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(`/company/${companyId}`)}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Company
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewRounds;