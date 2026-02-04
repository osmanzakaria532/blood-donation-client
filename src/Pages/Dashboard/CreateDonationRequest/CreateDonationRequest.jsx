/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';

const CreateDonationRequest = () => {
  const [district, setDistrict] = useState('');
  const [upazilas, setUpazilas] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);

  const upazilaData = {
    Dhaka: ['Dhamrai', 'Dohar', 'Keraniganj', 'Savar', 'Mirpur', 'Gulshan'],
    Chattogram: ['Anwara', 'Boalkhali', 'Hathazari', 'Raozan'],
    Rajshahi: ['Bagha', 'Bagmara', 'Charghat'],
    Khulna: ['Batiaghata', 'Dumuria', 'Paikgachha'],
    Barishal: ['Agailjhara', 'Babuganj', 'Bakerganj'],
    Sylhet: ['Balaganj', 'Beanibazar', 'Golapganj'],
    Rangpur: ['Badarganj', 'Gangachhara', 'Kaunia'],
    Mymensingh: ['Bhaluka', 'Fulbaria', 'Gaffargaon'],
  };

  useEffect(() => {
    if (district) {
      setUpazilas(upazilaData[district]);
    } else {
      setUpazilas([]);
    }
  }, [district]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isBlocked) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const form = e.target;

    const data = {
      requesterName: form.requesterName.value,
      requesterEmail: form.requesterEmail.value,
      recipientName: form.recipientName.value,
      bloodGroup: form.bloodGroup.value,
      district: form.district.value,
      upazila: form.upazila.value,
      hospital: form.hospital.value,
      address: form.address.value,
      date: form.date.value,
      time: form.time.value,
      message: form.message.value,
      status: 'pending',
    };

    console.log('Donation Request:', data);
    alert('✅ Donation request submitted successfully!');
    form.reset();
    setDistrict('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-pink-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-red-500 rounded-full mb-4">
            ❤️
          </div>
          <h1 className="text-3xl font-bold text-gray-800">রক্তদান অনুরোধ তৈরি করুন</h1>
          <p className="text-gray-500">Create Blood Donation Request</p>
        </div>

        {/* Blocked Warning */}
        {isBlocked && (
          <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="font-bold text-red-700">Access Denied</p>
            <p className="text-sm text-red-600">
              Your account is blocked. You cannot create a request.
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          {/* Requester Info */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Requester Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="requesterName"
                value="Mohammad Rahim"
                readOnly
                className="input bg-gray-100"
              />
              <input
                name="requesterEmail"
                value="rahim@example.com"
                readOnly
                className="input bg-gray-100"
              />
            </div>
          </div>

          {/* Recipient Info */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Recipient Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input name="recipientName" placeholder="Recipient Name" required className="input" />

              <select name="bloodGroup" required className="input">
                <option value="">Select Blood Group</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                  <option key={bg}>{bg}</option>
                ))}
              </select>

              <select
                name="district"
                required
                className="input"
                onChange={(e) => setDistrict(e.target.value)}
              >
                <option value="">Select District</option>
                {Object.keys(upazilaData).map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>

              <select name="upazila" required className="input">
                <option value="">Select Upazila</option>
                {upazilas.map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Donation Location</h2>
            <input name="hospital" placeholder="Hospital Name" required className="input mb-4" />
            <textarea
              name="address"
              rows="3"
              placeholder="Full Address"
              required
              className="input"
            />
          </div>

          {/* Schedule */}
          <div className="grid md:grid-cols-2 gap-4">
            <input name="date" type="date" required className="input" />
            <input name="time" type="time" required className="input" />
          </div>

          {/* Message */}
          <textarea
            name="message"
            rows="4"
            placeholder="Write request message"
            required
            className="input"
          />

          {/* Submit */}
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDonationRequest;
