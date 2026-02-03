/* eslint-disable no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useAuth } from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: users = [] } = useQuery({
    queryKey: ['users', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?email=${user?.email}`);
      return res.data;
    },
  });
  // console.log(users);

  const handleUpdateUserInfo = (e) => {
    e.preventDefault();
    console.log('user info updated', e);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-rose-50 py-8 px-4 font-[Poppins] text-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        {users.map((profileUser) => (
          <div key={profileUser._id}>
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-44 bg-linear-to-br from-red-600 to-red-800"></div>

              <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 px-10 pb-8 -mt-20">
                {/* Avatar */}
                <div className="w-36 h-36 rounded-full border-4 border-white bg-linear-to-br from-red-200 to-red-300 flex items-center justify-center text-4xl font-bold text-red-800 shadow-xl overflow-hidden">
                  <img
                    src={profileUser?.photoURL}
                    alt={profileUser.displayName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* profileUser Info */}
                <div className="text-center md:text-left md:pb-4">
                  <h1 className=" text-3xl font-semibold capitalize">{profileUser.displayName}</h1>
                  <span className="inline-block mt-2 px-4 py-1 text-sm font-medium text-white rounded-full bg-linear-to-br from-red-600 to-red-800 capitalize tracking-wide">
                    {profileUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleUpdateUserInfo} className="bg-white rounded-2xl shadow-xl p-10">
              {/* Form Header */}
              <div className="flex justify-between items-center border-b-2 border-red-100 pb-6 mb-10">
                <h2 className="font-['DM_Serif_Display'] text-2xl flex items-center gap-3">
                  <span>🩸</span> Profile Information
                </h2>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-full font-semibold text-white bg-linear-to-br from-red-600 to-red-800 shadow hover:-translate-y-0.5 transition"
                >
                  ✏️ Edit Profile
                </button>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div>
                  <label className="block mb-2 text-sm font-semibold uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled
                    className="w-full px-5 py-3 rounded-xl border-2 border-red-100 bg-red-50 text-gray-500 cursor-not-allowed focus:outline-none capitalize"
                    value={profileUser.displayName}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-semibold uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    className="w-full px-5 py-3 rounded-xl border-2 border-yellow-300 bg-yellow-50 text-gray-500 cursor-not-allowed focus:outline-none "
                    value={profileUser.email}
                  />
                </div>

                {/* Blood Group */}
                <div>
                  <label className="block mb-2 text-sm font-semibold uppercase tracking-wide">
                    Blood Group
                  </label>
                  <select
                    disabled
                    className="w-full px-5 py-3 rounded-xl border-2 border-red-100 bg-red-50 text-gray-500 cursor-not-allowed focus:outline-none uppercase"
                  >
                    <option>{profileUser.bloodGroup}</option>
                  </select>
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block mb-2 text-sm font-semibold uppercase tracking-wide">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    disabled
                    className="w-full px-5 py-3 rounded-xl border-2 border-red-100 bg-red-50 text-gray-500 cursor-not-allowed focus:outline-none"
                    value={profileUser.photoURL}
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block mb-2 text-sm font-semibold uppercase tracking-wide">
                    District
                  </label>
                  <input
                    type="text"
                    disabled
                    className="w-full px-5 py-3 rounded-xl border-2 border-red-100 bg-red-50 text-gray-500 cursor-not-allowed focus:outline-none capitalize"
                    value={profileUser.district}
                  />
                </div>

                {/* Upazila */}
                <div>
                  <label className="block mb-2 text-sm font-semibold uppercase tracking-wide">
                    Upazila
                  </label>
                  <input
                    type="text"
                    disabled
                    className="w-full px-5 py-3 rounded-xl border-2 border-red-100 bg-red-50 text-gray-500 cursor-not-allowed focus:outline-none capitalize"
                    value={profileUser.upazila}
                  />
                </div>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
