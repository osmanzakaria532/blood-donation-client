const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Total Requests</h3>
          <p className="text-3xl font-bold text-red-600">12</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">My Donations</h3>
          <p className="text-3xl font-bold text-red-600">5</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Status</h3>
          <p className="text-lg font-medium text-green-600">Active</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
