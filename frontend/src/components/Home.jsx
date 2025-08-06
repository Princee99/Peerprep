import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    navigate(`/login/${role.toLowerCase()}`);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="main-title">CHARUSAT Placement Preparation Platform</h1>
        <p className="subtitle">
          Connect with alumni, access company reviews, get placement guidance, and excel in your career journey
        </p>

        <div className="roles-container">
          <div className="role-card" onClick={() => handleRoleClick('student')}>
            <div className="role-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
              </svg>
            </div>
            <h2>Login as Student</h2>
            <p>Access company reviews, ask doubts, get guidance</p>
          </div>

          <div className="role-card" onClick={() => handleRoleClick('alumni')}>
            <div className="role-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <h2>Login as Alumni</h2>
            <p>Share experiences, help students, give back</p>
          </div>

          <div className="role-card" onClick={() => handleRoleClick('admin')}>
            <div className="role-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
            </div>
            <h2>Login as Admin</h2>
            <p>Manage platform and user access</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
