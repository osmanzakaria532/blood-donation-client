import { useQuery } from '@tanstack/react-query';
import { useState } from 'react'; // ✅ NEW: filter state এর জন্য
import { toast } from 'react-toastify';
import { useAuth } from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const AllUsers = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // filter state (all | active | block)
  const [filter, setFilter] = useState('all');

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['users', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // filter
  const filteredUsers = filter === 'all' ? users : users.filter((user) => user.status === filter);

  const handleUpdateStatus = async (user) => {
    // ✅ status toggle logic clean রাখা হয়েছে
    const newStatus = {
      status: user.status === 'block' ? 'active' : 'block',
    };

    try {
      await axiosSecure.patch(`/users/${user._id}/status`, newStatus);
      toast.success('User status updated');

      refetch();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error(error);
    }
  };

  const handleUpdateRole = async (user) => {
    console.log('role update', user.role, user._id);
    const newRole = {
      role: user.role === 'donor' ? 'volunteer' : 'donor',
    };

    if (user.role === 'admin') {
      toast.info('Admin role cannot be changed');
      return;
    }

    try {
      await axiosSecure.patch(`/users/${user._id}/role`, newRole);
      toast.success('User status updated');

      refetch();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ✅ Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')} // ✅ filter set
            className={`px-4 py-2 rounded-lg text-white text-sm md:text-base transition ${
              filter === 'all' ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            All Users
          </button>

          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-white text-sm md:text-base transition ${
              filter === 'active' ? 'bg-green-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setFilter('block')}
            className={`px-4 py-2 rounded-lg text-white text-sm md:text-base transition ${
              filter === 'block' ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Blocked
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {/* ✅ users এর বদলে filteredUsers */}
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-900">{user.displayName}</span>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'block'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => handleUpdateRole(user)}
                      className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    >
                      {/* Volunteer */}
                      {user.role === 'donor' ? 'volunteer' : 'donor'}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(user)}
                      className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                    >
                      {user.status === 'block' ? 'Active' : 'Block'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ filteredUsers অনুযায়ী empty state */}
          {filteredUsers.length === 0 && (
            <p className="text-center py-6 text-gray-500">No users found</p>
          )}
        </div>

        {/* Pagination */}
        <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-sm text-gray-700">
            Showing{' '}
            <span class="font-semibold" id="showing-count">
              1-10
            </span>{' '}
            of{' '}
            <span class="font-semibold" id="total-count">
              {users.length}
            </span>{' '}
            users
          </div>
          <div class="flex gap-2">
            <button
              onclick="changePage('prev')"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-chevron-left mr-1"></i> Previous
            </button>
            <button
              onclick="changePage('next')"
              class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next <i class="fas fa-chevron-right ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
