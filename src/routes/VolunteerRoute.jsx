import Loading from '../Components/_UI/Loading';
import { useAuth } from '../Hooks/useAuth';
import useRole from '../Hooks/useRole';

const VolunteerRoute = ({ children }) => {
  const { loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <Loading />;
  }

  if (role !== 'admin' && role !== 'volunteer') {
    return <p>Forbidden access</p>;
  }

  return children;
};

export default VolunteerRoute;
