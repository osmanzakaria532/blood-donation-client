/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../Hooks/useAuth';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(`/donationRequest/${id}`);
        if (isMounted) {
          setRequest(res.data);
        }
      } catch (error) {
        if (isMounted) {
          toast.error('Failed to load donation request.');
          navigate('/donation-requests');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchDetails();
    }
    return () => {
      isMounted = false;
    };
  }, [axiosSecure, id, navigate]);

  const handleConfirmDonate = async () => {
    if (!request?._id) return;
    setUpdating(true);
    try {
      await axiosSecure.patch(`/donationRequest/${request._id}`, {
        status: 'inprogress',
        donorName: user?.displayName || 'Anonymous',
        donorEmail: user?.email || '',
      });
      toast.success('Donation request updated to in progress.');
      setShowModal(false);
      setRequest((prev) =>
        prev
          ? {
              ...prev,
              status: 'inprogress',
              donorName: user?.displayName || 'Anonymous',
              donorEmail: user?.email || '',
            }
          : prev,
      );
    } catch (error) {
      toast.error('Failed to update donation request.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">No request found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-rose-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Donation Request Details</h1>
            <p className="text-gray-500">Request ID: {request._id}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              request.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : request.status === 'inprogress'
                  ? 'bg-blue-100 text-blue-800'
                  : request.status === 'done'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            }`}
          >
            {request.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">Recipient Info</h2>
            <p>
              <span className="font-medium">Name:</span> {request.recipientName}
            </p>
            <p>
              <span className="font-medium">Blood Group:</span> {request.recipientBloodGroup}
            </p>
            <p>
              <span className="font-medium">Location:</span> {request.recipientDistrict}
              {request.recipientUpazila ? `, ${request.recipientUpazila}` : ''}
            </p>
            <p>
              <span className="font-medium">Hospital:</span> {request.hospitalName}
            </p>
            <p>
              <span className="font-medium">Address:</span> {request.recipientAddress}
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-700">Schedule & Requester</h2>
            <p>
              <span className="font-medium">Donation Date:</span> {request.donationDate}
            </p>
            <p>
              <span className="font-medium">Donation Time:</span> {request.donationTime}
            </p>
            <p>
              <span className="font-medium">Requester Name:</span> {request.requesterName}
            </p>
            <p>
              <span className="font-medium">Requester Email:</span> {request.requesterEmail}
            </p>
            {request.message && (
              <p>
                <span className="font-medium">Message:</span> {request.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/donation-requests')}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
          >
            Back to Requests
          </button>
          <button
            onClick={() => setShowModal(true)}
            disabled={request.status !== 'pending'}
            className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Donate Now
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Confirm Donation</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Donor Name</label>
                <input
                  type="text"
                  value={user?.displayName || ''}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Donor Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDonate}
                disabled={updating}
                className="px-4 py-2 rounded bg-red-600 text-white font-semibold disabled:opacity-50"
              >
                {updating ? 'Confirming...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetails;
