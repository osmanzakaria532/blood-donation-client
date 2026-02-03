import { useEffect, useState } from 'react';

const MyDonationRequests = () => {
  // ===== Sample Data (later API থেকে আসবে) =====
  const allRequests = [
    {
      id: 1,
      recipientName: 'John Doe',
      location: 'Dhaka Medical College Hospital',
      date: '2024-02-10',
      time: '10:00 AM',
      bloodType: 'A+',
      status: 'pending',
    },
    {
      id: 2,
      recipientName: 'Sarah Ahmed',
      location: 'Square Hospital, Dhaka',
      date: '2024-02-08',
      time: '2:30 PM',
      bloodType: 'B+',
      status: 'inprogress',
    },
    {
      id: 3,
      recipientName: 'Rahim Khan',
      location: 'Chittagong Medical College',
      date: '2024-02-05',
      time: '9:00 AM',
      bloodType: 'O+',
      status: 'done',
    },
    {
      id: 4,
      recipientName: 'Fatima Begum',
      location: 'Rajshahi Medical College',
      date: '2024-02-03',
      time: '11:30 AM',
      bloodType: 'AB+',
      status: 'canceled',
    },
    {
      id: 5,
      recipientName: 'Michael Smith',
      location: 'Apollo Hospital, Dhaka',
      date: '2024-02-12',
      time: '3:00 PM',
      bloodType: 'A-',
      status: 'pending',
    },
  ];

  // ===== States =====
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // ===== Filter Logic =====
  const filteredRequests =
    filter === 'all' ? allRequests : allRequests.filter((req) => req.status === filter);

  // ===== Pagination Logic =====
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [filter]);

  // ===== Status Badge =====
  const statusStyle = {
    pending: 'bg-yellow-100 text-yellow-800',
    inprogress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold mb-6">My Donation Requests</h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'inprogress', 'done', 'canceled'].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-lg text-sm font-medium
              ${
                filter === item
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {item === 'all' ? 'All' : item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Recipient</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Location</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Blood</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentData.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{req.recipientName}</td>
                <td className="px-6 py-4">{req.location}</td>
                <td className="px-6 py-4">
                  {req.date}
                  <div className="text-xs text-gray-500">{req.time}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm">
                    {req.bloodType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${statusStyle[req.status]}`}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {currentData.map((req) => (
          <div key={req.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between">
              <h3 className="font-semibold">{req.recipientName}</h3>
              <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                {req.bloodType}
              </span>
            </div>

            <p className="text-sm text-gray-600 mt-1">{req.location}</p>
            <p className="text-sm text-gray-500 mt-1">
              {req.date} • {req.time}
            </p>

            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${statusStyle[req.status]}`}
            >
              {req.status}
            </span>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
    </div>
  );
};

export default MyDonationRequests;
