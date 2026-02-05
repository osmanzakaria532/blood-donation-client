import { useState } from 'react';
import { FaDonate, FaTint, FaUsers } from 'react-icons/fa'; // icons for stats
import { Link } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import useRole from '../../Hooks/useRole';

const Dashboard = () => {
  const { role } = useRole();
  const { user } = useAuth();

  // Sample data (later will come from backend)
  const [donationRequests, setDonationRequests] = useState([
    {
      id: 1,
      recipientName: 'Fatima Khatun',
      district: 'Chattogram',
      upazila: 'Patenga',
      date: '2026-02-15',
      time: '10:00 AM',
      bloodGroup: 'B+',
      status: 'inprogress',
      donorInfo: { name: 'Karim Ahmed', email: 'karim@example.com' },
    },
    {
      id: 2,
      recipientName: 'Abdul Jabbar',
      district: 'Chattogram',
      upazila: 'Kotwali',
      date: '2026-02-10',
      time: '2:30 PM',
      bloodGroup: 'O+',
      status: 'done',
      donorInfo: { name: 'Salma Begum', email: 'salma@example.com' },
    },
    {
      id: 3,
      recipientName: 'Nasrin Akter',
      district: 'Chattogram',
      upazila: 'Halishahar',
      date: '2026-02-20',
      time: '11:00 AM',
      bloodGroup: 'A+',
      status: 'pending',
      donorInfo: null,
    },
  ]);

  const [deleteId, setDeleteId] = useState(null);

  // Sample stats (replace with API data later)
  const totalUsers = 120;
  const totalFunding = 5400; // assume currency in USD
  const totalRequests = donationRequests.length;

  // Status badge
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
        {labels[status]}
      </span>
    );
  };

  // Status change
  const changeStatus = (id, newStatus) => {
    const updated = donationRequests.map((item) =>
      item.id === id ? { ...item, status: newStatus } : item,
    );
    setDonationRequests(updated);
  };

  // Delete confirm
  const confirmDelete = () => {
    setDonationRequests(donationRequests.filter((d) => d.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        {/* Welcome Section */}
        <div className="bg-white p-6 rounded shadow mb-6 flex flex-col md:flex-row justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Welcome back,{' '}
              <span className="text-red-600">
                {role === 'admin' ? <span>{user?.displayName}</span> : user?.displayName}
              </span>
            </h2>
            <p className="text-gray-600">Thank you for being a life saver ❤️</p>
          </div>
          <Link
            to="/dashboard/create-donation-request"
            className="mt-4 md:mt-0 bg-red-600 text-white px-6 py-3 rounded"
          >
            + Create New Request
          </Link>
        </div>

        {/* Featured Statistics Cards */}
        {role === 'admin' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-6 rounded shadow flex items-center gap-4">
              <FaUsers className="text-red-600 text-3xl" />
              <div>
                <p className="text-2xl font-bold">{totalUsers}</p>
                <p className="text-gray-600">Total Donors</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded shadow flex items-center gap-4">
              <FaDonate className="text-green-600 text-3xl" />
              <div>
                <p className="text-2xl font-bold">${totalFunding}</p>
                <p className="text-gray-600">Total Funding</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded shadow flex items-center gap-4">
              <FaTint className="text-blue-600 text-3xl" />
              <div>
                <p className="text-2xl font-bold">{totalRequests}</p>
                <p className="text-gray-600">Blood Donation Requests</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {donationRequests.length === 0 && (
          <div className="bg-white p-10 rounded shadow text-center">
            <h3 className="text-2xl font-bold mb-2">No Donation Requests Yet</h3>
            <p className="text-gray-600">Create your first donation request</p>
          </div>
        )}

        {/* Desktop table */}
        {donationRequests.length > 0 && (
          <div className="hidden lg:block bg-white rounded shadow">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Recipient</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Date & Time</th>
                  <th className="p-3">Blood</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {donationRequests.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3 font-medium">{item.recipientName}</td>
                    <td className="p-3">
                      {item.district}, {item.upazila}
                    </td>
                    <td className="p-3">
                      {item.date} <br /> {item.time}
                    </td>
                    <td className="p-3">
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                        {item.bloodGroup}
                      </span>
                    </td>
                    <td className="p-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-3 space-x-2">
                      {item.status === 'inprogress' && (
                        <>
                          <button
                            onClick={() => changeStatus(item.id, 'done')}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Done
                          </button>
                          <button
                            onClick={() => changeStatus(item.id, 'canceled')}
                            className="bg-red-600 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setDeleteId(item.id)}
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

        {/* Mobile cards */}
        <div className="lg:hidden space-y-4">
          {donationRequests.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-lg">{item.recipientName}</h3>
              <p className="text-gray-600 text-sm">
                {item.district}, {item.upazila}
              </p>

              <div className="flex justify-between mt-3">
                <span>{item.date}</span>
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  {item.bloodGroup}
                </span>
              </div>

              <div className="mt-2">
                <StatusBadge status={item.status} />
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="bg-gray-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80 text-center">
            <h3 className="text-xl font-bold mb-4">Confirm Delete?</h3>
            <div className="flex justify-between">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded">
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
