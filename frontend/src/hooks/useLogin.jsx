import { useState } from 'react';
import axios from 'axios';

const useLogin = (role, navigate) => {
  const [formData, setFormData] = useState({ email: '', password: '', role });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value, role }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      if (response.data.user.role !== role) {
        setErrors({ general: `You are not authorized to login as ${role}.` });
        setIsLoading(false);
        return;
      }
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate(`/${role}-dashboard`);
    } catch (error) {
      setErrors({ general: error.response?.data?.message || 'An error occurred during login' });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    showPassword,
    errors,
    setShowPassword,
    handleChange,
    handleSubmit,
  };
};

export default useLogin;