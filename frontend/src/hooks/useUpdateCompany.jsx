import { useState } from 'react';
import axios from 'axios';

const useUpdateCompany = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const updateCompany = async (companyId, companyData) => {
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      // Always send required fields
      formData.append('name', companyData.name || '');
      formData.append('location', companyData.location || '');
      formData.append('website', companyData.website || '');
      // If logo file is selected, add it
      if (companyData.logo && companyData.logo instanceof File) {
        formData.append('logo', companyData.logo);
      }
      // If logo path is entered, add it as logo_url
      if (companyData.logo_url && typeof companyData.logo_url === 'string') {
        formData.append('logo_url', companyData.logo_url);
      }
      await axios.put(
        `http://localhost:5000/api/companies/${companyId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setSuccess(true);
    } catch (err) {
      setError('Failed to update company');
    } finally {
      setLoading(false);
    }
  };

  return { updateCompany, loading, error, success };
};

export default useUpdateCompany;