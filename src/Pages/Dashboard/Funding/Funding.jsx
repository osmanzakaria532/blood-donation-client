import { useState } from 'react';

/* Dummy Data */
const initialFunds = [
  { id: 1, userName: 'Rahim Uddin', amount: 500, date: '2025-01-10' },
  { id: 2, userName: 'Karim Ahmed', amount: 1000, date: '2025-01-12' },
  { id: 3, userName: 'John Doe', amount: 750, date: '2025-01-15' },
];

/* Modal Component */
function FundModal({ onClose, onAddFund }) {
  const [amount, setAmount] = useState('');

  const handleConfirm = () => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    onAddFund({
      id: Date.now(),
      userName: 'Logged In User',
      amount: Number(amount),
      date: new Date().toISOString().slice(0, 10),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-80 p-6">
        <h3 className="text-lg font-semibold mb-4">Give Fund</h3>

        <input
          type="number"
          placeholder="Enter fund amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* Main Page */
const Funding = () => {
  const [funds, setFunds] = useState(initialFunds);
  const [showModal, setShowModal] = useState(false);

  const totalFund = funds.reduce((sum, fund) => sum + fund.amount, 0);

  const addFund = (newFund) => {
    setFunds([newFund, ...funds]);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Funding</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Give Fund
        </button>
      </div>

      {/* Total Fund */}
      <div className="mb-4 text-lg font-medium">
        Total Fund Collected: <span className="text-red-600 font-semibold">{totalFund} ৳</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border">Donor Name</th>
              <th className="text-left px-4 py-2 border">Amount</th>
              <th className="text-left px-4 py-2 border">Date</th>
            </tr>
          </thead>
          <tbody>
            {funds.map((fund) => (
              <tr key={fund.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{fund.userName}</td>
                <td className="px-4 py-2 border">{fund.amount} ৳</td>
                <td className="px-4 py-2 border">{fund.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && <FundModal onClose={() => setShowModal(false)} onAddFund={addFund} />}
    </div>
  );
};

export default Funding;
