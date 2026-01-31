import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';

const DashboardLayout = () => {
  // ===== USER (later from Firebase) =====
  const authUser = {
    name: 'Rahim',
    role: 'admin', // donor | volunteer | admin
  };

  // ===== Sidebar state (Saved) =====
  const [open, setOpen] = useState(() => {
    const saved = localStorage.getItem('sidebar');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('sidebar', JSON.stringify(open));
  }, [open]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-red-600 text-white transition-all duration-300
        ${open ? 'w-64' : 'w-16'}
        fixed md:relative z-40 h-full`}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between p-4 border-b border-red-500 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <span className={`font-bold text-xl ${!open && 'hidden'}`}>
            <Link to="/">BloodCare</Link>
          </span>
          <button className="text-xl">☰</button>
        </div>

        {/* Menu */}
        <div className="flex flex-col justify-between h-[calc(100%-64px)]">
          <ul className="mt-4 space-y-2">
            {/* Dashboard */}
            <li>
              <NavLink to="/dashboard" className="flex items-center gap-3 p-3 hover:bg-red-500">
                🏠 {open && <span>Dashboard</span>}
              </NavLink>
            </li>

            {/* Profile */}
            <li>
              <NavLink
                to="/dashboard/profile"
                className="flex items-center gap-3 p-3 hover:bg-red-500"
              >
                👤 {open && <span>Profile</span>}
              </NavLink>
            </li>

            {/* Donor */}
            {authUser.role === 'donor' && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/create-donation-request"
                    className="flex items-center gap-3 p-3 hover:bg-red-500"
                  >
                    🩸 {open && <span>Create Donation Request</span>}
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/my-donation-requests"
                    className="flex items-center gap-3 p-3 hover:bg-red-500"
                  >
                    📋 {open && <span>My Donation Requests</span>}
                  </NavLink>
                </li>
              </>
            )}

            {/* Volunteer & Admin */}
            {(authUser.role === 'volunteer' || authUser.role === 'admin') && (
              <li>
                <NavLink
                  to="/dashboard/all-blood-donation-request"
                  className="flex items-center gap-3 p-3 hover:bg-red-500"
                >
                  🗂 {open && <span>All Donation Requests</span>}
                </NavLink>
              </li>
            )}

            {/* Admin only */}
            {authUser.role === 'admin' && (
              <li>
                <NavLink
                  to="/dashboard/all-users"
                  className="flex items-center gap-3 p-3 hover:bg-red-500"
                >
                  👥 {open && <span>All Users</span>}
                </NavLink>
              </li>
            )}
          </ul>

          {/* Logout */}
          <ul>
            <li>
              <button className="flex items-center gap-3 p-3 w-full hover:bg-red-500 text-left">
                🚪 {open && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
