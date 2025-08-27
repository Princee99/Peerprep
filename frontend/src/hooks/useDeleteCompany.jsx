import { useState } from 'react';
import axios from 'axios';

const useDeleteCompany = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const deleteCompany = async (companyId) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/companies/${companyId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    } catch (err) {
      setError('Failed to delete company');
    } finally {
      setLoading(false);
    }
  };

  return { deleteCompany, loading, error, success };
};

export default useDeleteCompany;