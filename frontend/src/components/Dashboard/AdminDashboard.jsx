import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [isAddingCompany, setIsAddingCompany] = useState(false);

  // Add Company Form State
  const [newCompany, setNewCompany] = useState({
    name: '',
    location: '',
    website: '',
    // description: '',
    logo: ''
  });

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || userData.role !== 'admin') {
      navigate('/login/admin');
      return;
    }
    
    setUser(userData);
    fetchCompanies();
  }, [navigate]);

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching companies with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch('http://localhost:5000/api/companies', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Companies data received:', data);
        console.log('Number of companies:', data.length);
        setCompanies(data);
      } else {
        const errorData = await response.text();
        console.error('Failed to fetch companies. Status:', response.status, 'Error:', errorData);
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      console.error('Error details:', error.message);
      // For now, use empty array if API is not available
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

  const handleAddCompany = async (e) => {
    e.preventDefault();
    if (newCompany.name && newCompany.location && newCompany.website) {
      setIsAddingCompany(true);
      try {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('name', newCompany.name);
        formData.append('location', newCompany.location);
        formData.append('website', newCompany.website);
        // formData.append('description', newCompany.description);
        if (newCompany.logo) formData.append('logo', newCompany.logo);

        const response = await fetch('http://localhost:5000/api/companies', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // Do NOT set Content-Type for FormData; browser will set it
          },
          body: formData
        });

        if (response.ok) {
          await fetchCompanies();
          setNewCompany({ name: '', location: '', website: '', logo: '' });
          setShowAddCompany(false);
        } else {
          alert('Failed to add company. Please try again.');
        }
      } catch (error) {
        alert('Failed to add company. Please try again.');
      } finally {
        setIsAddingCompany(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setNewCompany(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.location.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="admin-dashboard">
      {isLoading && (
        <div className="small-loading-indicator">
          <div className="loading-spinner"></div>
        </div>
      )}
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <h1 className="dashboard-title">
            <span className="admin-icon">👨‍💼</span>
            Admin Dashboard
          </h1>
          <p className="welcome-text">Welcome back, {user?.name || 'Administrator'}</p>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-avatar">👨‍💼</span>
            <span className="user-name">{user?.name || 'Admin'}</span>
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
      <main className="admin-main">
        <div className="search-section">
          <h2 className="section-title">Manage Companies</h2>
          <p className="section-subtitle">Search and manage companies in the platform</p>
          
          <div className="search-container">
            <div className="search-input-wrapper">
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search companies by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button 
              className="add-company-btn"
              onClick={() => setShowAddCompany(true)}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Company
            </button>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="companies-section">
          <div className="companies-header">
            <h3 className="companies-title">
              {searchTerm ? `Search Results (${filteredCompanies.length})` : `All Companies (${companies.length})`}
            </h3>
            <p className="companies-subtitle">
              Click on a company to view and manage details
            </p>
          </div>

          <div className="companies-grid">
            {filteredCompanies.map((company) => (
              <div 
                key={company.id} 
                className="company-card"
                onClick={() => handleCompanyClick(company.company_id)}
              >
                {/* <div className="company-logo">
                  <span className="logo-text">{company.name.charAt(0)}</span>
                </div> */}

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
              <p>Try adjusting your search terms or add a new company</p>
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
              <h3>No companies yet</h3>
              <p>Start by adding your first company to the platform</p>
              <button 
                className="clear-search-btn"
                onClick={() => setShowAddCompany(true)}
              >
                Add First Company
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add Company Modal */}
      {showAddCompany && (
        <div className="modal-overlay" onClick={() => setShowAddCompany(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Company</h2>
              <button 
                className="modal-close"
                onClick={() => setShowAddCompany(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddCompany} className="add-company-form">
              <div className="form-group">
                <label htmlFor="name">Company Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newCompany.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter company name"
                  disabled={isAddingCompany}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newCompany.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter company location"
                  disabled={isAddingCompany}
                />
              </div>
              <div className="form-group">
                <label htmlFor="website">Website *</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={newCompany.website}
                  onChange={handleInputChange}
                  required
                  placeholder="https://example.com"
                  disabled={isAddingCompany}
                />
              </div>
              {/* <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newCompany.description}
                  onChange={handleInputChange}
                  placeholder="Enter company description"
                  rows="3"
                  disabled={isAddingCompany}
                /> */}
              {/* </div> */}
              <div className="form-group">
                <label htmlFor="logo">Company Logo</label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={handleInputChange}
                  disabled={isAddingCompany}
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddCompany(false)}
                  disabled={isAddingCompany}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isAddingCompany}
                >
                  {isAddingCompany ? 'Adding...' : 'Add Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;