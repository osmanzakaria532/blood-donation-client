/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const EditDonationRequest = () => {
  const divisionsDistrictUpazila = useLoaderData();
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm();

  const selectedDivision = useWatch({ control, name: 'recipientDivision' });
  const selectedDistrict = useWatch({ control, name: 'recipientDistrict' });

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

          if (district.upazilas.length === 0) return [];

          if (typeof district.upazilas[0] === 'string') {
            return district.upazilas;
          } else if (typeof district.upazilas[0] === 'object' && district.upazilas[0].name) {
            return district.upazilas.map((u) => u.name);
          }

          return [];
        })()
      : [];

  useEffect(() => {
    let isMounted = true;
    const fetchRequest = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(`/donationRequest/${id}`);
        if (isMounted && res.data) {
          const data = res.data;
          setValue('recipientName', data.recipientName || '');
          setValue('recipientBloodGroup', data.recipientBloodGroup || '');
          setValue('recipientDivision', data.recipientDivision || '');
          setValue('recipientDistrict', data.recipientDistrict || '');
          setValue('recipientUpazila', data.recipientUpazila || '');
          setValue('hospitalName', data.hospitalName || '');
          setValue('recipientAddress', data.recipientAddress || '');
          setValue('date', data.donationDate || '');
          setValue('time', data.donationTime || '');
          setValue('message', data.message || '');
        }
      } catch (error) {
        toast.error('Failed to load donation request');
        navigate('/dashboard/my-donation-requests');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) fetchRequest();
    return () => {
      isMounted = false;
    };
  }, [axiosSecure, id, navigate, setValue]);

  const handleUpdate = async (data) => {
    try {
      await axiosSecure.put(
        `/donationRequest/${id}`,
        {
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
        },
        { headers: { 'x-user-email': user?.email } },
      );
      toast.success('Donation request updated');
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      toast.error('Failed to update request');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-pink-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto flex items-center justify-center bg-red-500 rounded-full mb-4">
            â¤ï¸
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Update Donation Request</h1>
          <p className="text-gray-500">Edit your donation request information</p>
        </div>

        {loading ? (
          <div className="bg-white p-6 rounded-xl shadow text-center">Loading...</div>
        ) : (
          <form
            onSubmit={handleSubmit(handleUpdate)}
            className="bg-white rounded-2xl shadow-xl p-6 space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold mb-3">Recipient Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Recipient Name"
                  className="input"
                  {...register('recipientName', { required: true })}
                />

                <div>
                  <select
                    className="input"
                    {...register('recipientBloodGroup', { required: true })}
                  >
                    <option value="">Select Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                      <option key={bg}>{bg}</option>
                    ))}
                  </select>
                  {errors.recipientBloodGroup && (
                    <p className="text-red-700 mt-2 italic">Blood Group is required</p>
                  )}
                </div>

                <div>
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
                    rows="3"
                    placeholder="Full Address"
                    className="input pt-1.5"
                    {...register('recipientAddress', { required: true })}
                  />
                  {errors.recipientAddress && (
                    <p className="text-red-700 mt-2 italic">Address is required</p>
                  )}
                </div>
              </div>
            </div>

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

            <textarea
              rows="4"
              placeholder="Write request message"
              className="input"
              {...register('message')}
            />

            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg">
              Update Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditDonationRequest;
