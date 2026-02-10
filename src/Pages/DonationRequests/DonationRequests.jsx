/* eslint-disable no-unused-vars */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const DonationRequests = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchPendingRequests = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get('/donationRequest/pending');
        if (isMounted) {
          setRequests(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        if (isMounted) {
          setRequests([]);
          toast.error('Failed to load pending donation requests.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPendingRequests();
    return () => {
      isMounted = false;
    };
  }, [axiosSecure]);

  const pendingRequests = useMemo(() => {
    return requests.filter((req) => (req.status || '').toLowerCase() === 'pending');
  }, [requests]);

  const viewDetails = (requestId) => {
    if (!user) {
      toast.error('Please log in to view donation request details.');
      navigate('/auth/sign-in');
      return;
    }

    navigate(`/donation-details/${requestId}`);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 to-purple-700 p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-white p-6 rounded-xl shadow mb-8 text-center">
          <h1 className="text-4xl text-red-600 mb-2">Blood Donation Requests</h1>
          <p className="text-gray-600 text-lg">Help save lives by donating blood</p>
        </header>

        {/* Loading */}
        {loading && (
          <div className="bg-white p-16 rounded-xl shadow text-center">
            <div className="text-4xl mb-4">Loading...</div>
            <p className="text-gray-500">Fetching pending donation requests</p>
          </div>
        )}

        {/* Card View */}
        {!loading && pendingRequests.length === 0 ? (
          <div className="bg-white p-16 rounded-xl shadow text-center">
            {/* <div className="text-6xl mb-4">ðŸ©¸</div> */}
            <h2 className="text-gray-600 mb-2 text-2xl">No Pending Requests</h2>
            <p className="text-gray-400">
              There are currently no blood donation requests available.
            </p>
          </div>
        ) : (
          <>
            {!loading && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {pendingRequests.map((req) => (
                  <div
                    key={req._id}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-600 to-red-400"></div>
                    <div className="text-white bg-red-600 font-bold text-2xl px-6 py-3 rounded-lg mb-4 shadow-md inline-block">
                      {req.recipientBloodGroup}
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-500 font-semibold">Recipient:</p>
                      <p className="text-gray-800">{req.recipientName}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-500 font-semibold">Location:</p>
                      <p className="text-gray-800">
                        {req.recipientDistrict}
                        {req.recipientUpazila ? `, ${req.recipientUpazila}` : ''}
                      </p>
                    </div>

                    <div className="mb-4 flex justify-between">
                      <div>
                        <p className="text-gray-500 font-semibold">Date:</p>
                        <p className="text-gray-800">{formatDate(req.donationDate)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-semibold">Time:</p>
                        <p className="text-gray-800">{req.donationTime}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => viewDetails(req._id)}
                      className="w-full bg-linear-to-br from-indigo-500 to-purple-700 text-white py-2 font-semibold rounded-lg hover:shadow-md transition"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DonationRequests;
