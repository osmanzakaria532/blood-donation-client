/* eslint-disable no-unused-vars */
import axios from 'axios';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useAuth } from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const Registration = () => {
  const { registerUser, updateUserProfile } = useAuth();
  const [avatarName, setAvatarName] = useState('');
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    getValues, // ✅ ADD
  } = useForm();
  const divisionsDistrictUpazila = useLoaderData();

  // Watch division and district for dynamic select
  const selectedDivision = useWatch({ control, name: 'division' });
  const selectedDistrict = useWatch({ control, name: 'district' });

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

  const handleSubmitRegistration = (data) => {
    console.log('Registration Form Data:', data);

    const profileImg = data.photo[0];

    registerUser(data.email, data.password)
      .then(() => {
        const formData = new FormData();
        formData.append('image', profileImg);

        const image_api_url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB_API_KEY}`;

        axios.post(image_api_url, formData).then((res) => {
          const photoURL = res.data.data.url;

          // Convert all fields to lowercase before sending to DB
          const userInfo = {
            displayName: data.name.toLowerCase(),
            email: data.email.toLowerCase(),
            photoURL: photoURL,
            division: data.division.toLowerCase(),
            district: data.district.toLowerCase(),
            upazila: data.upazila.toLowerCase(),
            bloodGroup: data.bloodGroup.toLowerCase(),
          };

          axiosSecure
            .post('/users', userInfo)
            .then((res) => {
              if (res.data.insertedId) {
                Swal.fire({
                  position: 'top-end',
                  icon: 'success',
                  title: 'Created User in DB Successfully',
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
              reset();
            })
            .catch((error) => {
              console.log('Error creating User in DB', error);
            });

          // Update profile in Firebase
          const updateProfile = {
            displayName: data.name.toLowerCase(),
            photoURL: photoURL,
          };
          updateUserProfile(updateProfile)
            .then(() => {
              // console.log('Profile has been updated');
              toast.success('User Created Successfully');
              navigate('/');
            })
            .catch((error) => {
              console.log('Error updating profile', error);
            });
        });
      })
      .catch((error) => {
        // console.log('Creating user in Firebase', error);
        toast.error(error.code);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-rose-50 via-rose-100 to-rose-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-3xl w-full animate-slideUp">
        {/* Header */}
        <div className="bg-linear-to-br from-red-600 to-red-700 text-center p-12 relative overflow-hidden">
          <span className="absolute text-[15rem] opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-15deg] animate-pulse">
            🩸
          </span>
          <h1 className="text-4xl font-bold text-white relative z-10">🩸 LifeStream</h1>
          <p className="text-white/90 relative z-10 mt-2">Join our life-saving community</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleSubmitRegistration)} className="p-8 space-y-6">
          {/* Personal Info */}
          <div className="border-l-4 border-red-600 pl-3 font-semibold text-lg">
            Personal Information
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block font-medium mb-1">
                Full Name <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-red-600 focus:ring focus:ring-red-100"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name?.type === 'required' && (
                <p className="text-red-700 mt-2 italic">Name is required</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block font-medium mb-2">
                Avatar <span className="text-red-700">*</span>
              </label>
              <input
                type="file"
                className="file-input w-full"
                placeholder="Add Your Photo "
                {...register('photo', { required: 'Photo is required' })}
              />
              {errors.photo?.type === 'required' && (
                <p className="text-red-700 mt-2 italic">{errors.photo.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block font-medium mb-1">
                Email <span className="text-red-700">*</span>
              </label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-red-600 focus:ring focus:ring-red-100"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && <p className="text-red-700 mt-2 italic">{errors.email.message}</p>}
            </div>
          </div>

          {/* Location & Blood */}
          <div className="border-l-4 border-red-600 pl-3 font-semibold text-lg">
            Location Details & Blood
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Division <span className="text-red-700">*</span>
              </label>
              <select
                {...register('division', { required: 'Division is required' })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-red-600 focus:ring focus:ring-red-100"
              >
                <option value="">Select Division</option>
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.division && <p className="text-red-700 mt-2 italic">Division is required</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">
                District <span className="text-red-700">*</span>
              </label>
              <select
                {...register('district', { required: 'District is required' })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-red-600 focus:ring focus:ring-red-100"
                disabled={!selectedDivision}
              >
                <option value="">Select District</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.district && <p className="text-red-700 mt-2 italic">District is required</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">
                Upazila <span className="text-red-700">*</span>
              </label>
              <select
                {...register('upazila', { required: 'Upazila is required' })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-red-600 focus:ring focus:ring-red-100"
                disabled={!selectedDistrict}
              >
                <option value="">Select Upazila</option>
                {upazilas.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
              {errors.upazila && <p className="text-red-700 mt-2 italic">Upazila is required</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">
                Blood Group <span className="text-red-700">*</span>
              </label>
              <select
                {...register('bloodGroup', { required: 'Blood group is required' })}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-red-600 focus:ring focus:ring-red-100"
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
              {errors.bloodGroup && (
                <p className="text-red-700 mt-2 italic">{errors.bloodGroup.message}</p>
              )}
            </div>
          </div>

          {/* Security */}
          <div className="border-l-4 border-red-600 pl-3 font-semibold text-lg">Security</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Password <span className="text-red-700">*</span>
              </label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-red-600 focus:ring focus:ring-red-100"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-700 mt-2 italic">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1">
                Confirm Password <span className="text-red-700">*</span>
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-red-600 focus:ring focus:ring-red-100"
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: (value) => value === getValues('password') || 'Passwords do not match',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-700 mt-2 italic">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button className="w-full bg-linear-to-br from-red-600 to-red-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all mt-4">
            Register
          </button>

          <p className="text-center mt-4 text-gray-500">
            Already have an account?{' '}
            <a href="/auth/login" className="text-red-600 font-semibold">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
