import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';

const AlumniDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Check if user is logged in and is alumni
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || userData.role !== 'alumni') {
      navigate('/login/alumni');
      return;
    }
    
    setUser(userData);
    fetchCompanies();
  }, [navigate]);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching companies for alumni with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('http://localhost:5000/api/companies', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Alumni dashboard response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Companies data for alumni:', data);
        setCompanies(data);
      } else {
        const errorData = await response.text();
        console.error('Failed to fetch companies. Status:', response.status, 'Error:', errorData);
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

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading Alumni Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="app-logo">PeerPrep</h1>
          <p className="welcome-text">Welcome back, {user?.name || 'Alumni'}!</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-avatar">👨‍🎓</span>
            <span className="user-name">{user?.name || 'Alumni'}</span>
          </div>
          <button className="profile-btn" onClick={() => navigate('/profile')}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="search-section">
          <h2 className="section-title">Share Your Experience</h2>
          <p className="section-subtitle">Help students prepare for placements by sharing your interview experiences and reviews</p>
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search companies to add your review..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>

        <div className="companies-section">
          <div className="companies-header">
            <h3 className="companies-title">
              {searchTerm ? `Search Results (${filteredCompanies.length})` : `All Companies (${companies.length})`}
            </h3>
            <p className="companies-subtitle">
              Click on a company to view details and add your placement experience
            </p>
          </div>

          <div className="companies-grid">
            {filteredCompanies.map((company) => (
              <div 
                key={company.id} 
                className="company-card"
                onClick={() => handleCompanyClick(company.company_id)}
              >
               <div className="company-logo">
                            {company.logo_url ? (
                <img
                  src={`http://localhost:5000${company.logo_url}`}
                  alt={company.name}
                  className="logo-img"
                />
              ) : (
                <span className="logo-text">{company.name.charAt(0)}</span>
              )}
              </div>
                <div className="company-content">
                  <h4 className="company-name">{company.name}</h4>
                  <p className="company-location">
                    <svg className="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {company.location}
                  </p>
                  <p className="company-website">
                    <svg className="website-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                    {company.website}
                  </p>
                  {/* <p className="company-description">{company.description}</p> */}
                  <div className="company-actions">
                    <span className="view-details">View Details →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCompanies.length === 0 && searchTerm && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No companies found</h3>
              <p>Try adjusting your search terms</p>
              <button 
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
              >
                Clear Search
              </button>
            </div>
          )}

          {companies.length === 0 && !searchTerm && (
            <div className="no-results">
              <div className="no-results-icon">🏢</div>
              <h3>No companies available</h3>
              <p>Companies will appear here once they are added to the platform</p>
            </div>
          )}
        </div>

        {/* Your Contributions Section */}
        <div className="stats-section">
          <h3 className="section-title">Your Contributions</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <h3 className="stat-title">Reviews Added</h3>
                <p className="stat-value">0</p>
                <span className="stat-change">Start sharing your experiences!</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💬</div>
              <div className="stat-content">
                <h3 className="stat-title">Questions Answered</h3>
                <p className="stat-value">0</p>
                <span className="stat-change">Help students with their questions!</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <h3 className="stat-title">Companies Reviewed</h3>
                <p className="stat-value">0</p>
                <span className="stat-change">Share your placement experiences!</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlumniDashboard;
