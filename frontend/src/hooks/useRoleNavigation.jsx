import { useNavigate } from 'react-router-dom';

export function useRoleNavigation() {
  const navigate = useNavigate();
  return (role) => navigate(`/login/${role.toLowerCase()}`);
}