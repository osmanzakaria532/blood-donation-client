import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const MyDonationRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchRequests = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const res = await axiosSecure.get('/donationRequest', {
          params: { email: user.email },
        });
        if (isMounted) {
          setRequests(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        if (isMounted) {
          setRequests([]);
          toast.error('Failed to load your donation requests.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRequests();
    return () => {
      isMounted = false;
    };
  }, [axiosSecure, user?.email]);

  const filteredRequests = useMemo(() => {
    return filter === 'all' ? requests : requests.filter((req) => req.status === filter);
  }, [filter, requests]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const statusStyle = {
    pending: 'bg-yellow-100 text-yellow-800',
    inprogress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axiosSecure.patch(
        `/donationRequest/${id}`,
        { status },
        { headers: { 'x-user-email': user?.email } },
      );
      toast.success('Status updated');
      setRequests((prev) => prev.map((r) => (r._id === id ? { ...r, status } : r)));
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
      toast.success('Donation request deleted');
      setRequests((prev) => prev.filter((r) => r._id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">My Donation Requests</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'inprogress', 'done', 'canceled'].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              filter === item
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {item === 'all' ? 'All' : item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div className="bg-white p-6 rounded-lg shadow">Loading...</div>}

      {!loading && currentData.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600">
          No donation requests found.
        </div>
      )}

      {!loading && currentData.length > 0 && (
        <div className="hidden lg:block bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                  Recipient
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Blood</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Donor</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentData.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{req.recipientName}</td>
                  <td className="px-6 py-4">
                    {req.recipientDistrict}
                    {req.recipientUpazila ? `, ${req.recipientUpazila}` : ''}
                  </td>
                  <td className="px-6 py-4">
                    {req.donationDate}
                    <div className="text-xs text-gray-500">{req.donationTime}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm">
                      {req.recipientBloodGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${statusStyle[req.status]}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {req.status === 'inprogress' ? (
                      <div>
                        <div>{req.donorName || 'N/A'}</div>
                        <div className="text-xs">{req.donorEmail || ''}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    {req.status === 'inprogress' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(req._id, 'done')}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                        >
                          Done
                        </button>
                        <button
                          onClick={() => handleStatusChange(req._id, 'canceled')}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {(req.status === 'pending' || req.status === 'inprogress') && (
                      <button
                        onClick={() => navigate(`/dashboard/edit-donation-request/${req._id}`)}
                        className="px-3 py-1 text-sm bg-indigo-600 text-white rounded"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/donation-details/${req._id}`)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setDeleteId(req._id)}
                      className="px-3 py-1 text-sm bg-gray-700 text-white rounded"
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

      {!loading && currentData.length > 0 && (
        <div className="lg:hidden space-y-4">
          {currentData.map((req) => (
            <div key={req._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between">
                <h3 className="font-semibold">{req.recipientName}</h3>
                <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                  {req.recipientBloodGroup}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {req.recipientDistrict}
                {req.recipientUpazila ? `, ${req.recipientUpazila}` : ''}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {req.donationDate} â€¢ {req.donationTime}
              </p>
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${statusStyle[req.status]}`}
              >
                {req.status}
              </span>
              {req.status === 'inprogress' && (
                <div className="mt-2 text-xs text-gray-600">
                  {req.donorName || 'N/A'} {req.donorEmail ? `(${req.donorEmail})` : ''}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                {req.status === 'inprogress' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(req._id, 'done')}
                      className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => handleStatusChange(req._id, 'canceled')}
                      className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                    >
                      Cancel
                    </button>
                  </>
                )}
                {(req.status === 'pending' || req.status === 'inprogress') && (
                  <button
                    onClick={() => navigate(`/dashboard/edit-donation-request/${req._id}`)}
                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => navigate(`/donation-details/${req._id}`)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                >
                  View
                </button>
                <button
                  onClick={() => setDeleteId(req._id)}
                  className="px-3 py-1 text-sm bg-gray-700 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredRequests.length > 0 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <button
            onClick={() =>
              setCurrentPage((prev) =>
                prev * itemsPerPage < filteredRequests.length ? prev + 1 : prev,
              )
            }
            className="px-4 py-2 border rounded disabled:opacity-50"
            disabled={currentPage * itemsPerPage >= filteredRequests.length}
          >
            Next
          </button>
        </div>
      )}

      {deleteId && (
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

export default MyDonationRequests;
