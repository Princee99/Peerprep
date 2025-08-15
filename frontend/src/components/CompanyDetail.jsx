import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/CompanyDetail.css';

const CompanyDetail = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
      navigate('/');
      return;
    }
    
    setUser(userData);
    fetchCompanyDetails();
  }, [companyId, navigate]);

  const fetchCompanyDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      // console.log('Fetching company details for ID:', companyId);
      // console.log('Token exists:', !!token);
      
      const response = await fetch(`http://localhost:5000/api/companies/${companyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // console.log('Company detail response status:', response.status);
      // console.log('Response headers:', response.headers);
      
      if (response.ok) {
        const data = await response.json();
        // console.log('Company details received:', data);
        setCompany(data);
      } else {
        const errorData = await response.text();
        console.error('Failed to fetch company details. Status:', response.status, 'Error:', errorData);
        // Fallback to mock data if API fails
        setCompany({
          id: companyId,
          name: 'Company',
          location: 'Location',
          website: 'https://example.com',
          // description: 'Company description'
          logo_url: 'https://example.com/logo.png'
        });
      }
    }  catch (error) {
      console.error('Error fetching company details:', error);
      console.error('Error details:', error.message);
      // Fallback to mock data if API fails
      setCompany({
        id: companyId,
        name: 'Company',
        location: 'Location',
        website: 'https://example.com',
        // description: 'Company description'
        logo_url: 'https://example.com/logo.png'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'aptitude', label: 'Aptitude Questions', icon: '🧮' },
    { id: 'technical', label: 'Technical Round', icon: '💻' },
    { id: 'personal', label: 'Personal Interview', icon: '👤' },
    { id: 'hr', label: 'HR Round', icon: '🤝' },
    { id: 'questions', label: 'Q&A', icon: '❓' }
  ];

  // Dummy reviews data (as requested)
  const mockReviews = {
    aptitude: [
      {
        id: 1,
        author: 'Sarah Johnson',
        role: 'Software Engineer',
        date: '2 months ago',
        content: 'The aptitude test was quite challenging. Focus on data interpretation, logical reasoning, and basic mathematics. Time management is crucial.',
        rating: 4
      }
    ],
    technical: [
      {
        id: 2,
        author: 'Mike Chen',
        role: 'Senior Developer',
        date: '1 month ago',
        content: 'Technical round focused on algorithms and data structures. Be prepared for coding questions on arrays, strings, and trees. They also asked about system design.',
        rating: 5
      }
    ],
    personal: [
      {
        id: 3,
        author: 'Emily Davis',
        role: 'Product Manager',
        date: '3 weeks ago',
        content: 'Personal interview was conversational. They asked about my projects, challenges I faced, and how I solved them. Be honest and show enthusiasm.',
        rating: 4
      }
    ],
    hr: [
      {
        id: 4,
        author: 'David Wilson',
        role: 'Data Scientist',
        date: '2 weeks ago',
        content: 'HR round was mostly about culture fit and behavioral questions. They asked about teamwork, leadership, and why I wanted to join this company.',
        rating: 5
      }
    ]
  };

  // Dummy questions data
  const mockQuestions = [
    {
      id: 1,
      author: 'Student123',
      question: 'What is the typical duration of the technical interview?',
      date: '1 week ago',
      answers: [
        {
          id: 1,
          author: 'Alumni Expert',
          content: 'Usually 45-60 minutes. Be prepared for both coding and system design questions.',
          date: '5 days ago'
        }
      ]
    },
    {
      id: 2,
      author: 'Placement2024',
      question: 'Do they ask questions about specific programming languages?',
      date: '3 days ago',
      answers: [
        {
          id: 2,
          author: 'Senior Dev',
          content: 'They focus on problem-solving rather than specific languages, but knowing Python, Java, or C++ helps.',
          date: '2 days ago'
        }
      ]
    }
  ];

  if (isLoading) {
    return (
      <div className="company-detail" style={{position: 'relative'}}>
        {isLoading && (
          <div className="small-loading-indicator">
            <div className="loading-spinner"></div>
          </div>
        )}
      </div>
    );
  }

  if (!company) {
    return (
      <div className="company-loading">
        <div className="no-results-icon">❌</div>
        <h3>Company not found</h3>
        <p>The company you're looking for doesn't exist.</p>
        <button className="clear-search-btn" onClick={handleBack}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="company-detail">
      {/* Header */}
      <header className="company-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBack}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <div className="company-info">
            <div className="company-logo-large">
              {/* <span className="logo-text">{company.name.charAt(0)}</span> */}
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
            <div className="company-details">
              <h1 className="company-name">{company.name}</h1>
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
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <span className="user-avatar">
              {user?.role === 'student' ? '🎓' : user?.role === 'alumni' ? '👨‍🎓' : '👨‍💼'}
            </span>
            <span className="user-name">{user?.name || 'User'}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="company-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="company-main">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="company-overview">
              <h2 className="section-title">Company Overview</h2>
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>Website</h3>
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </div>
                <div className="overview-card">
                  <h3>Location</h3>
                  <p>{company.location}</p>
                </div>
                <div className="overview-card">
                  <h3>Industry</h3>
                  <p>Technology</p>
                </div>
                <div className="overview-card">
                  <h3>Company Type</h3>
                  <p>Private</p>
                </div>
              </div>
              {/* <p className="company-description">{company.description}</p> */}
            </div>

            <div className="placement-process">
              <h2 className="section-title">Placement Process</h2>
              <div className="process-steps">
                <div className="step">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Online Application</h3>
                    <p>Submit your resume and cover letter through the company portal</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Aptitude Test</h3>
                    <p>Online assessment covering logical reasoning and quantitative skills</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Technical Interview</h3>
                    <p>Coding challenges and system design discussions</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">4</div>
                  <div className="step-content">
                    <h3>Personal Interview</h3>
                    <p>Behavioral questions and project discussions</p>
                  </div>
                </div>
                <div className="step">
                  <div className="step-number">5</div>
                  <div className="step-content">
                    <h3>HR Round</h3>
                    <p>Final culture fit and offer discussion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {['aptitude', 'technical', 'personal', 'hr'].includes(activeTab) && (
          <div className="reviews-content">
            <div className="reviews-header">
              <h2 className="section-title">
                {tabs.find(tab => tab.id === activeTab)?.label} Reviews
              </h2>
              {user?.role === 'alumni' && (
                <button className="add-review-btn">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Review
                </button>
              )}
            </div>

            <div className="reviews-list">
              {mockReviews[activeTab]?.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="review-author">
                      <span className="author-avatar">👤</span>
                      <div className="author-info">
                        <h4 className="author-name">{review.author}</h4>
                        <p className="author-role">{review.role}</p>
                      </div>
                    </div>
                    <div className="review-meta">
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      <span className="review-date">{review.date}</span>
                    </div>
                  </div>
                  <p className="review-content">{review.content}</p>
                </div>
              ))}

              {(!mockReviews[activeTab] || mockReviews[activeTab].length === 0) && (
                <div className="no-reviews">
                  <div className="no-reviews-icon">📝</div>
                  <h3>No reviews yet</h3>
                  <p>Be the first to share your experience!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="questions-content">
            <div className="questions-header">
              <h2 className="section-title">Questions & Answers</h2>
              {user?.role === 'student' && (
                <button className="ask-question-btn">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Ask Question
                </button>
              )}
            </div>

            <div className="questions-list">
              {mockQuestions.map((question) => (
                <div key={question.id} className="question-card">
                  <div className="question-header">
                    <div className="question-author">
                      <span className="author-avatar">🎓</span>
                      <span className="author-name">{question.author}</span>
                    </div>
                    <span className="question-date">{question.date}</span>
                  </div>
                  <h3 className="question-text">{question.question}</h3>
                  
                  <div className="answers-list">
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="answer-card">
                        <div className="answer-header">
                          <div className="answer-author">
                            <span className="author-avatar">👨‍🎓</span>
                            <span className="author-name">{answer.author}</span>
                          </div>
                          <span className="answer-date">{answer.date}</span>
                        </div>
                        <p className="answer-content">{answer.content}</p>
                      </div>
                    ))}
                  </div>

                  {user?.role === 'alumni' && (
                    <button className="answer-btn">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Answer
                    </button>
                  )}
                </div>
              ))}

              {mockQuestions.length === 0 && (
                <div className="no-questions">  
                  <div className="no-questions-icon">❓</div>
                  <h3>No questions yet</h3>
                  <p>Be the first to ask a question!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyDetail;