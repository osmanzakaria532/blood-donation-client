import { Outlet } from 'react-router';
import Sidebar from '../Components/Sidebar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main content */}
      <div className="ml-14 p-1 md:p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
