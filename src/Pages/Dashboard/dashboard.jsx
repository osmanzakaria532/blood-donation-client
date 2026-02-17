/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { FaDonate, FaTint, FaUsers } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import useRole from '../../Hooks/useRole';

const Dashboard = () => {
  const { role } = useRole();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFunding: 0,
    totalDonationRequests: 0,
  });

  const [recentLoading, setRecentLoading] = useState(true);
  const [recentRequests, setRecentRequests] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      if (role !== 'admin' && role !== 'volunteer') {
        setStatsLoading(false);
        return;
      }
      setStatsLoading(true);
      try {
        const res = await axiosSecure.get('/admin-stats');
        if (isMounted) {
          setStats({
            totalUsers: res.data?.totalUsers || 0,
            totalFunding: res.data?.totalFunding || 0,
            totalDonationRequests: res.data?.totalDonationRequests || 0,
          });
        }
      } catch (error) {
        if (isMounted) {
          setStats({
            totalUsers: 0,
            totalFunding: 0,
            totalDonationRequests: 0,
          });
        }
      } finally {
        if (isMounted) {
          setStatsLoading(false);
        }
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [axiosSecure, role]);

  useEffect(() => {
    let isMounted = true;
    const fetchRecent = async () => {
      if (!user?.email || role !== 'donor') {
        setRecentLoading(false);
        return;
      }
      setRecentLoading(true);
      try {
        const res = await axiosSecure.get('/donationRequest/recent', {
          params: { email: user.email, limit: 3 },
        });
        if (isMounted) {
          setRecentRequests(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        if (isMounted) {
          setRecentRequests([]);
          toast.error('Failed to load recent requests.');
        }
      } finally {
        if (isMounted) {
          setRecentLoading(false);
        }
      }
    };

    fetchRecent();
    return () => {
      isMounted = false;
    };
  }, [axiosSecure, role, user?.email]);

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      inprogress: 'bg-blue-100 text-blue-800',
      done: 'bg-green-100 text-green-800',
      canceled: 'bg-red-100 text-red-800',
    };
    const labels = {
      pending: 'Pending',
      inprogress: 'In Progress',
      done: 'Done',
      canceled: 'Canceled',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {labels[status] || status}
      </span>
    );
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axiosSecure.patch(
        `/donationRequest/${id}`,
        { status },
        { headers: { 'x-user-email': user?.email } },
      );
      setRecentRequests((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item)),
      );
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await axiosSecure.delete(`/donationRequest/${deleteId}`, {
        headers: { 'x-user-email': user?.email },
      });
      setRecentRequests((prev) => prev.filter((item) => item._id !== deleteId));
      setDeleteId(null);
      toast.success('Request deleted');
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        {/* Welcome Section */}
        <div className="bg-white p-6 rounded shadow mb-6 flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Welcome back, <span className="text-red-600">{user?.displayName}</span>
            </h2>
            <p className="text-gray-600">Thank you for being a life saver</p>
          </div>
          <Link
            to="/dashboard/create-donation-request"
            className="mt-4 md:mt-0 bg-red-600 text-white px-6 py-3 rounded"
          >
            + Create New Request
          </Link>
        </div>

        {/* Featured Statistics Cards */}
        {(role === 'admin' || role === 'volunteer') && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-6 rounded shadow flex items-center gap-4">
              <FaUsers className="text-red-600 text-3xl" />
              <div>
                <p className="text-2xl font-bold">{statsLoading ? '...' : stats.totalUsers}</p>
                <p className="text-gray-600">Total Donors</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded shadow flex items-center gap-4">
              <FaDonate className="text-green-600 text-3xl" />
              <div>
                <p className="text-2xl font-bold">
                  {statsLoading ? '...' : `$${stats.totalFunding}`}
                </p>
                <p className="text-gray-600">Total Funding</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded shadow flex items-center gap-4">
              <FaTint className="text-blue-600 text-3xl" />
              <div>
                <p className="text-2xl font-bold">
                  {statsLoading ? '...' : stats.totalDonationRequests}
                </p>
                <p className="text-gray-600">Blood Donation Requests</p>
              </div>
            </div>
          </div>
        )}

        {/* Donor Recent Requests */}
        {role === 'donor' && (
          <>
            {recentLoading && (
              <div className="bg-white p-6 rounded shadow text-center">Loading...</div>
            )}

            {!recentLoading && recentRequests.length === 0 && (
              <div className="bg-white p-10 rounded shadow text-center">
                <h3 className="text-2xl font-bold mb-2">No Donation Requests Yet</h3>
                <p className="text-gray-600">Create your first donation request</p>
              </div>
            )}

            {!recentLoading && recentRequests.length > 0 && (
              <div className="bg-white rounded shadow">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Recipient</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Date & Time</th>
                      <th className="p-3">Blood</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Donor Info</th>
                      <th className="p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((item) => (
                      <tr key={item._id} className="border-t">
                        <td className="p-3 font-medium">{item.recipientName}</td>
                        <td className="p-3">
                          {item.recipientDistrict}
                          {item.recipientUpazila ? `, ${item.recipientUpazila}` : ''}
                        </td>
                        <td className="p-3">
                          {item.donationDate} <br /> {item.donationTime}
                        </td>
                        <td className="p-3">
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                            {item.recipientBloodGroup}
                          </span>
                        </td>
                        <td className="p-3">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="p-3 text-sm text-gray-600">
                          {item.status === 'inprogress' ? (
                            <div>
                              <div>{item.donorName || 'N/A'}</div>
                              <div className="text-xs">{item.donorEmail || ''}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="p-3 space-x-2">
                          {item.status === 'inprogress' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(item._id, 'done')}
                                className="bg-green-600 text-white px-3 py-1 rounded"
                              >
                                Done
                              </button>
                              <button
                                onClick={() => handleStatusChange(item._id, 'canceled')}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {(item.status === 'pending' || item.status === 'inprogress') && (
                            <button
                              onClick={() =>
                                navigate(`/dashboard/edit-donation-request/${item._id}`)
                              }
                              className="bg-indigo-600 text-white px-3 py-1 rounded"
                            >
                              Edit
                            </button>
                          )}
                          <button
                            onClick={() => navigate(`/donation-details/${item._id}`)}
                            className="bg-blue-600 text-white px-3 py-1 rounded"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setDeleteId(item._id)}
                            className="bg-gray-600 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!recentLoading && recentRequests.length > 0 && (
              <div className="mt-4">
                <Link
                  to="/dashboard/my-donation-requests"
                  className="inline-block bg-red-600 text-white px-4 py-2 rounded"
                >
                  View My All Request
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {role === 'donor' && deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80 text-center">
            <h3 className="text-xl font-bold mb-4">Confirm Delete?</h3>
            <div className="flex justify-between">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
