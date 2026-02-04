import React, { useState } from 'react';

// Sample user data (আপনি পরে API থেকে fetch করতে পারেন)
const initialUsers = [
  {
    id: 1,
    name: 'রহিম আহমেদ',
    email: 'rahim@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Rahim+Ahmed&background=0D8ABC&color=fff',
    role: 'donor',
    status: 'active',
  },
  {
    id: 2,
    name: 'করিম হোসেন',
    email: 'karim@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Karim+Hossen&background=F56565&color=fff',
    role: 'volunteer',
    status: 'active',
  },
  {
    id: 3,
    name: 'সালমা খাতুন',
    email: 'salma@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Salma+Khatun&background=ED8936&color=fff',
    role: 'donor',
    status: 'blocked',
  },
  {
    id: 4,
    name: 'নাজমুল ইসলাম',
    email: 'nazmul@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Nazmul+Islam&background=48BB78&color=fff',
    role: 'admin',
    status: 'active',
  },
  {
    id: 5,
    name: 'ফাতেমা বেগম',
    email: 'fatema@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Fatema+Begum&background=9F7AEA&color=fff',
    role: 'volunteer',
    status: 'active',
  },
  {
    id: 6,
    name: 'আব্দুল হাসান',
    email: 'abdul@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Abdul+Hasan&background=667EEA&color=fff',
    role: 'donor',
    status: 'blocked',
  },
  {
    id: 7,
    name: 'সুমাইয়া আক্তার',
    email: 'sumaiya@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Sumaiya+Akter&background=F687B3&color=fff',
    role: 'donor',
    status: 'active',
  },
  {
    id: 8,
    name: 'মাহমুদ হাসান',
    email: 'mahmud@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Mahmud+Hasan&background=38B2AC&color=fff',
    role: 'volunteer',
    status: 'active',
  },
];

const roleColors = {
  donor: 'bg-blue-100 text-blue-800',
  volunteer: 'bg-green-100 text-green-800',
  admin: 'bg-purple-100 text-purple-800',
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  blocked: 'bg-red-100 text-red-800',
};

const AllUsers = () => {
  const [users, setUsers] = useState(initialUsers);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [openDropdown, setOpenDropdown] = useState(null);

  const filteredUsers = filter === 'all' ? users : users.filter((u) => u.status === filter);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const usersToShow = filteredUsers.slice(startIndex, endIndex);

  // Actions
  const blockUser = (id) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'blocked' } : u)));

  const unblockUser = (id) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'active' } : u)));

  const makeVolunteer = (id) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: 'volunteer' } : u)));

  const makeAdmin = (id) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: 'admin' } : u)));

  const toggleDropdown = (id) => setOpenDropdown(openDropdown === id ? null : id);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">All Users</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setFilter('all');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-white text-sm md:text-base transition duration-200 ${
              filter === 'all' ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => {
              setFilter('active');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-white text-sm md:text-base transition duration-200 ${
              filter === 'active' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => {
              setFilter('blocked');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-lg text-white text-sm md:text-base transition duration-200 ${
              filter === 'blocked' ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Blocked
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersToShow.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap flex items-center">
                    <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        roleColors[user.role]
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        statusColors[user.status]
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center relative">
                    <button
                      onClick={() => toggleDropdown(user.id)}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition duration-150"
                    >
                      <i className="fas fa-ellipsis-v text-gray-600"></i>
                    </button>
                    {openDropdown === user.id && (
                      <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                        <div className="py-1">
                          {user.status === 'active' ? (
                            <button
                              onClick={() => blockUser(user.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <i className="fas fa-ban mr-3 text-red-500"></i> Block User
                            </button>
                          ) : (
                            <button
                              onClick={() => unblockUser(user.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <i className="fas fa-unlock mr-3 text-green-500"></i> Unblock User
                            </button>
                          )}
                          {user.role === 'donor' && (
                            <button
                              onClick={() => makeVolunteer(user.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <i className="fas fa-hands-helping mr-3 text-green-500"></i> Make
                              Volunteer
                            </button>
                          )}
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => makeAdmin(user.id)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <i className="fas fa-user-shield mr-3 text-purple-500"></i> Make Admin
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="md:hidden divide-y divide-gray-200">
          {usersToShow.map((user) => (
            <div
              key={user.id}
              className="p-4 hover:bg-gray-50 transition duration-150 flex items-start justify-between"
            >
              <div className="flex items-center space-x-3 flex-1">
                <img
                  className="h-12 w-12 rounded-full shrink-0"
                  src={user.avatar}
                  alt={user.name}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${roleColors[user.role]}`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${statusColors[user.status]}`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative ml-2">
                <button
                  onClick={() => toggleDropdown(user.id)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition duration-150"
                >
                  <i className="fas fa-ellipsis-v text-gray-600"></i>
                </button>
                {openDropdown === user.id && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                    <div className="py-1">
                      {user.status === 'active' ? (
                        <button
                          onClick={() => blockUser(user.id)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <i className="fas fa-ban mr-3 text-red-500"></i> Block User
                        </button>
                      ) : (
                        <button
                          onClick={() => unblockUser(user.id)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <i className="fas fa-unlock mr-3 text-green-500"></i> Unblock User
                        </button>
                      )}
                      {user.role === 'donor' && (
                        <button
                          onClick={() => makeVolunteer(user.id)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <i className="fas fa-hands-helping mr-3 text-green-500"></i> Make
                          Volunteer
                        </button>
                      )}
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => makeAdmin(user.id)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        >
                          <i className="fas fa-user-shield mr-3 text-purple-500"></i> Make Admin
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-semibold">
              {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)}
            </span>{' '}
            of <span className="font-semibold">{filteredUsers.length}</span> users
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fas fa-chevron-left mr-1"></i> Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <i className="fas fa-chevron-right ml-1"></i>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllUsers;
