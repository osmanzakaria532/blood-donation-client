import Loading from '../Components/_UI/Loading';
import { useAuth } from '../Hooks/useAuth';
import useRole from '../Hooks/useRole';

const AdminRouter = ({ children }) => {
  const { loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <Loading />;
  }
  if (role !== 'admin') {
    // return <Forbidden />;
    return <p>Forbidden access</p>;
  }
  //   return {children: <>{user && role === 'admin' && <Outlet />}</>,};
  return children;
};

export default AdminRouter;
