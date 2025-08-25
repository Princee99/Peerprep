import React, { useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useLogin from '../hooks/useLogin';
import useRoleConfig from '../hooks/useRoleConfig';
import LoginHeader from '../components/LoginHeader';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { role } = useParams();

  // Redirect if invalid role
  if (!['admin', 'student', 'alumni'].includes(role)) {
    return <Navigate to="/" />;
  }

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (token && user) {
      navigate(`/${user.role}-dashboard`);
    }
  }, [navigate]);

  const roleConfig = useRoleConfig(role);
  const {
    formData,
    isLoading,
    showPassword,
    errors,
    setShowPassword,
    handleChange,
    handleSubmit,
  } = useLogin(role, navigate);

  const handleBackToHome = () => navigate('/');

  return (
    <div className={`min-h-screen bg-gradient-to-br ${roleConfig.bgGradient} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white/10 backdrop-blur-3xl"
          animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white/10 backdrop-blur-3xl"
          animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-32 h-32 rounded-full bg-white/5 backdrop-blur-2xl"
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Main Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8"
        >
          <LoginHeader config={roleConfig} />
          <LoginForm
            formData={formData}
            isLoading={isLoading}
            showPassword={showPassword}
            errors={errors}
            setShowPassword={setShowPassword}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            gradient={roleConfig.gradient}
          />
          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-6 text-center"
          >
            <button
              onClick={handleBackToHome}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Back to Home</span>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;