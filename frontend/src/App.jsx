import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import AlumniDashboard from './pages/Dashboard/AlumniDashboard';
import CompanyDetails from './pages/CompanyDetails';
import Profile from './pages/Profile';
import ReviewRounds from './pages/ReviewRounds';
import './App.css';
import AskQuestion from './components/QA/AskQuestion';
import QuestionList from './components/QA/QuestionList';
import QuestionDetail from './components/QA/QuestionDetail';
import QuestionDetails from './pages/QuestionDetails';
import AdminSettings from './pages/AdminSettings';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user) {
    return <Navigate to="/login/student" />;
  }

  return children;
};

// Dashboard Route Component
const DashboardRoute = ({ children, expectedRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user) {
    return <Navigate to={`/login/${expectedRole}`} />;
  }

  if (user.role !== expectedRole) {
    return <Navigate to={`/${user.role}-dashboard`} />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login/:role" element={<Login />} />
          
          {/* Admin Routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <DashboardRoute expectedRole="admin">
                <AdminDashboard />
              </DashboardRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={<AdminSettings />} /> 
          
          {/* Student Routes */}
          <Route 
            path="/student-dashboard" 
            element={
              <DashboardRoute expectedRole="student">
                <StudentDashboard />
              </DashboardRoute>
            }
          />
          
          {/* Alumni Routes */}
          <Route 
            path="/alumni-dashboard" 
            element={
              <DashboardRoute expectedRole="alumni">
                <AlumniDashboard />
              </DashboardRoute>
            } 
          />
          
          {/* Company Detail Route - Accessible by all authenticated users */}
          <Route 
            path="/company/:companyId" 
            element={<CompanyDetails />} 
          />
          
          {/* Profile Route - Accessible by all authenticated users */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/company/:companyId/review/:reviewId/reviewrounds" 
            element={
              <ProtectedRoute>
                <ReviewRounds />
              </ProtectedRoute>
            } 
          />
          <Route path="/ask-question" element={<AskQuestion />} />
          <Route path="/questions" element={<QuestionList />} />
          <Route path="/questions/:questionId" element={<QuestionDetails />} />
          <Route path="/company/:companyId/question/:questionId" element={<QuestionDetail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
