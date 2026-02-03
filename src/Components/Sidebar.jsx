import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useAuth } from '../Hooks/useAuth';

const Sidebar = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebar', JSON.stringify(open));
  }, [open]);

  const handleSignOut = () => {
    logOut().then(() => {
      toast.success('Sign Out Successfully');
      navigate('/');
    });
  };
  //
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-red-600 text-white
      transition-all duration-300 ${open ? 'w-64' : 'w-16'}
      `}
    >
      {/* Header */}
      <div
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between h-16 px-4 border-b border-red-500 cursor-pointer"
      >
        {open && (
          <Link to="/" className="font-bold text-lg">
            🩸 BloodCare
          </Link>
        )}
        <span className="text-xl">☰</span>
      </div>

      {/* Menu */}
      <nav className="mt-4 flex flex-col justify-between h-[calc(100%-64px)] pb-2.5">
        <ul className="space-y-1">
          <SidebarItem to="/dashboard" icon="🏠" label="Dashboard" open={open} />
          <SidebarItem to="/dashboard/profile" icon="👤" label="Profile" open={open} />
          <SidebarItem
            to="/dashboard/create-donation-request"
            icon="🩸"
            label="Create Request"
            open={open}
          />
          <SidebarItem
            to="/dashboard/my-donation-requests"
            icon="📋"
            label="My Donation Requests"
            open={open}
          />
          <SidebarItem
            to="/dashboard/all-blood-donation-request"
            icon="🗂"
            label="All Requests"
            open={open}
          />
          <SidebarItem to="/dashboard/all-users" icon="👥" label="All Users" open={open} />
        </ul>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 hover:bg-red-500"
        >
          🚪 {open && 'Logout'}
        </button>
      </nav>
    </aside>
  );
};

const SidebarItem = ({ to, icon, label, open }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 text-sm
       hover:bg-red-500
       ${isActive ? 'bg-red-700' : ''}`
    }
  >
    <span className="text-lg">{icon}</span>
    {open && <span>{label}</span>}
  </NavLink>
);

export default Sidebar;
