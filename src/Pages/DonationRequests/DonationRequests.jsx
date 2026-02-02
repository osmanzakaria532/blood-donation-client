/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/immutability */
// BloodDonationRequests.jsx
import { useState } from 'react';

// Sample donation requests data
const donationRequests = [
  {
    id: 1,
    recipientName: 'Ahmed Hassan',
    location: 'Chittagong Medical College Hospital',
    bloodGroup: 'A+',
    date: '2024-12-28',
    time: '10:00 AM',
  },
  {
    id: 2,
    recipientName: 'Fatima Rahman',
    location: 'Imperial Hospital, Agrabad',
    bloodGroup: 'O-',
    date: '2024-12-27',
    time: '2:30 PM',
  },
  {
    id: 3,
    recipientName: 'Mohammad Ali',
    location: 'Chevron Clinical Laboratory',
    bloodGroup: 'B+',
    date: '2024-12-29',
    time: '9:00 AM',
  },
  {
    id: 4,
    recipientName: 'Nusrat Jahan',
    location: 'Max Hospital, Nasirabad',
    bloodGroup: 'AB+',
    date: '2024-12-27',
    time: '4:00 PM',
  },
  {
    id: 5,
    recipientName: 'Karim Uddin',
    location: 'General Hospital, Pahartali',
    bloodGroup: 'O+',
    date: '2024-12-30',
    time: '11:30 AM',
  },
  {
    id: 6,
    recipientName: 'Ayesha Siddiqua',
    location: 'Surgiscope Hospital',
    bloodGroup: 'A-',
    date: '2024-12-28',
    time: '3:00 PM',
  },
];

const DonationRequests = () => {
  const [view, setView] = useState('card');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const viewDetails = (requestId) => {
    if (!isLoggedIn) {
      alert('Please log in to view donation request details.');
      window.location.href = 'donation-details';
    } else {
      window.location.href = `donation-details/${requestId}`;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-500 to-purple-700 p-5">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="bg-white p-6 rounded-xl shadow mb-8 text-center">
          <h1 className="text-4xl text-red-600 mb-2">🩸 Blood Donation Requests</h1>
          <p className="text-gray-600 text-lg">Help save lives by donating blood</p>
        </header>

        {/* View Toggle */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-6 py-2 font-semibold rounded-lg border-2 transition ${
              view === 'card'
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'bg-white text-indigo-500 border-indigo-500'
            }`}
            onClick={() => setView('card')}
          >
            Card View
          </button>
          <button
            className={`px-6 py-2 font-semibold rounded-lg border-2 transition ${
              view === 'table'
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'bg-white text-indigo-500 border-indigo-500'
            }`}
            onClick={() => setView('table')}
          >
            Table View
          </button>
        </div>

        {/* Card View */}
        {donationRequests.length === 0 ? (
          <div className="bg-white p-16 rounded-xl shadow text-center">
            <div className="text-6xl mb-4">🩸</div>
            <h2 className="text-gray-600 mb-2 text-2xl">No Pending Requests</h2>
            <p className="text-gray-400">
              There are currently no blood donation requests available.
            </p>
          </div>
        ) : (
          <>
            {view === 'card' && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {donationRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-600 to-red-400"></div>
                    <div className="text-white bg-red-600 font-bold text-2xl px-6 py-3 rounded-lg mb-4 shadow-md inline-block">
                      {req.bloodGroup}
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-500 font-semibold">Recipient:</p>
                      <p className="text-gray-800">{req.recipientName}</p>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-500 font-semibold">Location:</p>
                      <p className="text-gray-800">{req.location}</p>
                    </div>

                    <div className="mb-4 flex justify-between">
                      <div>
                        <p className="text-gray-500 font-semibold">Date:</p>
                        <p className="text-gray-800">{formatDate(req.date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 font-semibold">Time:</p>
                        <p className="text-gray-800">{req.time}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => viewDetails(req.id)}
                      className="w-full bg-linear-to-br from-indigo-500 to-purple-700 text-white py-2 font-semibold rounded-lg hover:shadow-md transition"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {view === 'table' && (
              <div className="overflow-x-auto bg-white p-6 rounded-xl shadow-lg">
                <table className="w-full table-auto border-collapse">
                  <thead className="bg-linear-to-br from-indigo-500 to-purple-700 text-white">
                    <tr>
                      <th className="py-3 px-4 text-left">Blood Group</th>
                      <th className="py-3 px-4 text-left">Recipient Name</th>
                      <th className="py-3 px-4 text-left">Location</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Time</th>
                      <th className="py-3 px-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4">
                          <span className="inline-block bg-red-600 text-white font-bold px-3 py-1 rounded-md">
                            {req.bloodGroup}
                          </span>
                        </td>
                        <td className="py-2 px-4">{req.recipientName}</td>
                        <td className="py-2 px-4">{req.location}</td>
                        <td className="py-2 px-4">{formatDate(req.date)}</td>
                        <td className="py-2 px-4">{req.time}</td>
                        <td className="py-2 px-4">
                          <button
                            onClick={() => viewDetails(req.id)}
                            className="bg-linear-to-br from-indigo-500 to-purple-700 text-white px-4 py-1 rounded-md font-semibold hover:shadow-md transition"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DonationRequests;
