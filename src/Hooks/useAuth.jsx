import { useContext } from 'react';
import AuthContext from '../Context/AuthContext';

// Custom hook to use auth context
export const useAuth = () => {
  const authInfo = useContext(AuthContext);

  return authInfo;
};
