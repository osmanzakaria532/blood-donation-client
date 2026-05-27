/* eslint-disable no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const normalizeStatus = (status) => {
  if (!status) return 'active';
  return status === 'block' ? 'blocked' : status;
};

const AllUsers = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [filter, setFilter] = useState('all');
  // const isAdmin = user?.email === 'osmanzakaria@gmail.com';

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

  const filteredUsers = useMemo(() => {
    if (filter === 'all') return users;

    return users.filter((u) => normalizeStatus(u.status) === filter);
  }, [filter, users]);

  const handleUpdateStatus = async (targetUser) => {
    const current = normalizeStatus(targetUser.status);
    const newStatus = current === 'blocked' ? 'active' : 'blocked';

    try {
      await axiosSecure.patch(`/users/${targetUser._id}/status`, { status: newStatus });
      toast.success('User status updated');
      refetch();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleMakeVolunteer = async (targetUser) => {
    if (targetUser.role === 'admin') {
      toast.info('Admin role cannot be changed');
      return;
    }
    if (targetUser.role === 'volunteer') return;

    try {
      await axiosSecure.patch(`/users/${targetUser._id}/role`, { role: 'volunteer' });
      toast.success('User role updated');
      refetch();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleMakeDonor = async (targetUser) => {
    if (targetUser.role === 'admin') {
      toast.info('Admin role cannot be changed');
      return;
    }
    if (targetUser.role === 'donor') return;

    try {
      await axiosSecure.patch(`/users/${targetUser._id}/role`, { role: 'donor' });
      toast.success('User role updated');
      refetch();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleMakeAdmin = async (targetUser) => {
    if (targetUser.role === 'admin') return;
    try {
      await axiosSecure.patch(`/users/${targetUser._id}/role`, { role: 'admin' });
      toast.success('User role updated');
      refetch();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
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
            onClick={() => setFilter('blocked')}
            className={`px-4 py-2 rounded-lg text-white text-sm md:text-base transition ${
              filter === 'blocked' ? 'bg-red-700' : 'bg-red-600 hover:bg-red-700'
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
              {filteredUsers.map((targetUser) => {
                const isSelf = user?.email === targetUser?.email;
                const status = normalizeStatus(targetUser.status);
                return (
                  <tr key={targetUser._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={targetUser.photoURL}
                        alt={targetUser.displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-gray-900">{targetUser.displayName}</span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">{targetUser.email}</td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                        {targetUser.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          status === 'blocked'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center space-x-2">
                      {!isSelf && (
                        <>
                          {status !== 'blocked' && (
                            <>
                              {/* <button
                                onClick={() => handleMakeVolunteer(targetUser)}
                                disabled={targetUser.role !== 'donor'}
                                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                              >
                                Make Volunteer
                              </button> */}
                              {targetUser.role === 'volunteer' ? (
                                <button
                                  onClick={() => handleMakeDonor(targetUser)}
                                  className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                                >
                                  Make Donor
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleMakeVolunteer(targetUser)}
                                  disabled={targetUser.role !== 'donor'}
                                  className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                                >
                                  Make Volunteer
                                </button>
                              )}

                              <button
                                onClick={() => handleMakeAdmin(targetUser)}
                                disabled={targetUser.role === 'admin'}
                                className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
                              >
                                Make Admin
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleUpdateStatus(targetUser)}
                            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
                          >
                            {status === 'blocked' ? 'Unblock' : 'Block'}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <p className="text-center py-6 text-gray-500">No users found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
