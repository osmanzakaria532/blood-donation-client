/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const CreateDonationRequest = () => {
  const divisionsDistrictUpazila = useLoaderData();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  // Watch division and district for dynamic select
  const selectedDivision = useWatch({ control, name: 'recipientDivision' });
  const selectedDistrict = useWatch({ control, name: 'recipientDistrict' });

  // Generate dynamic lists
  const divisions = divisionsDistrictUpazila.divisions.map((d) => d.name);
  const districts = selectedDivision
    ? divisionsDistrictUpazila.divisions
        .find((d) => d.name === selectedDivision)
        ?.districts.map((d) => d.name) || []
    : [];
  const upazilas =
    selectedDivision && selectedDistrict
      ? (() => {
          const division = divisionsDistrictUpazila.divisions.find(
            (d) => d.name === selectedDivision,
          );
          if (!division) return [];

          const district = division.districts.find((d) => d.name === selectedDistrict);
          if (!district) return [];

          // Check if upazilas are string or object
          if (district.upazilas.length === 0) return [];

          if (typeof district.upazilas[0] === 'string') {
            // string array
            return district.upazilas;
          } else if (typeof district.upazilas[0] === 'object' && district.upazilas[0].name) {
            // object array
            return district.upazilas.map((u) => u.name);
          }

          return [];
        })()
      : [];

  // যখন user data আসে, তখন form এ setValue() দিয়ে update করো
  useEffect(() => {
    if (user) {
      setValue('name', user.displayName); // name input
      setValue('email', user.email); // email input
    }
  }, [user, setValue]);

  const handleCreationDonationRequest = async (data) => {
    try {
      // 1️⃣ donation request object তৈরি
      const donationRequestInfo = {
        requesterName: user?.displayName,
        requesterEmail: user?.email,
        recipientName: data.recipientName,
        recipientBloodGroup: data.recipientBloodGroup,
        recipientDivision: data.recipientDivision,
        recipientDistrict: data.recipientDistrict,
        recipientUpazila: data.recipientUpazila,
        hospitalName: data.hospitalName,
        recipientAddress: data.recipientAddress,
        donationDate: data.date,
        donationTime: data.time,
        message: data.message || '',
        status: 'pending', // default status
        createdAt: new Date(), // request create time
      };

      // 2️⃣ server এ POST request
      const res = await axiosSecure.post(`/donationRequest`, donationRequestInfo);

      // 3️⃣ success handle
      if (res.data?.insertedId) {
        alert('Donation request created successfully');
      }
    } catch (error) {
      console.error('Failed to create donation request', error);
      toast.error('Failed to create donation request. Try again.');
    }
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
        {/* {isBlocked && (

        )} */}

        <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6 rounded">
          <p className="font-bold text-red-700">Access Denied</p>
          <p className="text-sm text-red-600">
            Your account is blocked. You cannot create a request.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleCreationDonationRequest)}
          className="bg-white rounded-2xl shadow-xl p-6 space-y-6"
        >
          {/* Requester Info */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Requester Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                defaultValue={user?.displayName}
                readOnly
                className="input bg-gray-100 capitalize"
                {...register('name')}
              />
              <input
                value={user?.email}
                readOnly
                className="input bg-gray-100"
                {...register('email')}
              />
            </div>
          </div>

          {/* Recipient Info */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Recipient Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="recipientName"
                placeholder="Recipient Name"
                className="input"
                {...register('recipientName')}
              />

              <div>
                <select className="input" {...register('recipientBloodGroup', { required: true })}>
                  <option value="">Select Blood Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                    <option key={bg}>{bg}</option>
                  ))}
                </select>
                {errors.recipientBloodGroup && (
                  <p className="text-red-700 mt-2 italic">Blood Group is required</p>
                )}
              </div>

              <div className="">
                <select
                  {...register('recipientDivision', { required: 'Division is required' })}
                  className="input"
                >
                  <option value="">Select Division</option>
                  {divisions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.recipientDivision && (
                  <p className="text-red-700 mt-2 italic">Division is required</p>
                )}
              </div>

              <div>
                <select
                  {...register('recipientDistrict', { required: 'District is required' })}
                  className="input"
                  disabled={!selectedDivision}
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.recipientDistrict && (
                  <p className="text-red-700 mt-2 italic">District is required</p>
                )}
              </div>

              <div>
                <select
                  {...register('recipientUpazila', { required: 'Upazila is required' })}
                  className="input"
                  disabled={!selectedDistrict}
                >
                  <option value="">Select Upazila</option>
                  {upazilas.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
                {errors.recipientUpazila && (
                  <p className="text-red-700 mt-2 italic">Upazila is required</p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Donation Location</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  placeholder="Hospital Name"
                  className="input"
                  {...register('hospitalName', { required: true })}
                />
                {errors.hospitalName && (
                  <p className="text-red-700 mt-2 italic">Hospital Name is required</p>
                )}
              </div>
              <div>
                <textarea
                  name="address"
                  rows="3"
                  placeholder="Full Address"
                  className="input pt-1.5"
                  {...register('recipientAddress', { required: true })}
                />
                {errors.recipientAddress && (
                  <p className="text-red-700 mt-2 italic">District is required</p>
                )}
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input type="date" className="input" {...register('date', { required: true })} />
              {errors.date && <p className="text-red-700 mt-2 italic">Date is required</p>}
            </div>
            <div>
              <input type="time" className="input" {...register('time', { required: true })} />
              {errors.time && <p className="text-red-700 mt-2 italic">Time is required</p>}
            </div>
          </div>

          {/* Message */}
          <textarea
            rows="4"
            placeholder="Write request message"
            className="input"
            {...register('message')}
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
