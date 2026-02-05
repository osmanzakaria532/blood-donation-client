/* eslint-disable react-hooks/set-state-in-effect */
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoURL, setPhotoURL] = useState('');

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

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    if (users.length) {
      reset(users[0]);
      setPhotoURL(users[0].photoURL);
    }
  }, [users, reset]);

  const handleUpdateUserInfo = async (data) => {
    let finalPhotoURL = photoURL;

    if (selectedFile) {
      const formData = new FormData();
      formData.append('image', selectedFile);

      try {
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGEBB_API_KEY}`,
          { method: 'POST', body: formData },
        );
        const imgData = await res.json();
        finalPhotoURL = imgData.data.url;
      } catch (err) {
        console.log('Image upload error:', err);
      }
    }

    const updatedUser = {
      displayName: data.displayName,
      bloodGroup: data.bloodGroup,
      district: data.district,
      upazila: data.upazila,
      photoURL: finalPhotoURL,
    };

    try {
      await axiosSecure.patch(`/users/${users[0]._id}`, updatedUser);
      setIsEditing(false);
      setSelectedFile(null);
      setPhotoURL(finalPhotoURL);
      setValue('photoURL', finalPhotoURL);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 to-rose-50 py-2 md:py-6 px-2 md:px-6 lg:px-8  text-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        {users.map((profileUser) => (
          <div key={profileUser._id} className="space-y-6">
            {/* Profile Header */}
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-22 md:h-44 bg-linear-to-br from-red-600 to-red-800"></div>
              <div className="relative flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 px-6 sm:px-10 pb-4 sm:pb-8 -mt-20">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white bg-linear-to-br from-red-200 to-red-300 flex items-center justify-center text-3xl sm:text-4xl font-bold text-red-800 shadow-xl overflow-hidden">
                  <img
                    src={profileUser.photoURL}
                    alt={profileUser.displayName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                <div className="text-center sm:text-left sm:pb-4">
                  <h1 className="text-2xl sm:text-3xl font-semibold capitalize">
                    {profileUser.displayName}
                  </h1>
                  <div className="space-x-2.5">
                    <span className="inline-block mt-2 px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium text-white rounded-full bg-linear-to-br from-red-600 to-red-800 capitalize tracking-wide">
                      {profileUser.role}
                    </span>
                    <span className="inline-block mt-2 px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium text-white rounded-full bg-linear-to-br from-green-600 to-red-800 capitalize tracking-wide">
                      {profileUser.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <form
              onSubmit={handleSubmit(handleUpdateUserInfo)}
              className="bg-white rounded-2xl shadow-xl p-4 md:p-6 space-y-6"
            >
              <div className="flex justify-between items-center m border-b-2 border-red-100 pb-4 sm:pb-6 mb-6 sm:mb-10">
                <h2 className="font-['DM_Serif_Display'] text-xl sm:text-2xl flex items-center gap-2 sm:gap-3">
                  <span className="w-5  md:w-auto">🩸</span>
                  <span className="block md:hidden text-sm">Information</span>
                  <span className="hidden md:block">Profile Information</span>
                </h2>

                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-3 md:px-6 py-1 md:py-3 rounded-full font-semibold text-white bg-linear-to-br from-red-600 to-red-800 text-sm sm:text-base"
                  >
                    <span className="md:hidden">✏️ Edit</span>
                    <span className="hidden md:block"> ✏️ Edit Profile</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-white bg-green-600 text-sm sm:text-base"
                  >
                    💾 Save Changes
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block mb-1 text-sm font-semibold uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('displayName')}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 sm:px-5 sm:py-3 rounded-xl border-2 ${
                      isEditing ? 'bg-white border-red-300' : 'bg-red-50 border-red-100'
                    } focus:outline-none capitalize text-sm sm:text-base`}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    disabled
                    className="w-full px-4 py-2 sm:px-5 sm:py-3 rounded-xl border-2 border-yellow-300 bg-yellow-50 text-gray-500 cursor-not-allowed focus:outline-none text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold uppercase tracking-wide">
                    Blood Group
                  </label>
                  <select
                    {...register('bloodGroup')}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 sm:px-5 sm:py-3 rounded-xl border-2 ${
                      isEditing ? 'bg-white border-red-300' : 'bg-red-50 border-red-100'
                    } focus:outline-none text-sm sm:text-base uppercase`}
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold uppercase tracking-wide">
                    Avatar
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedFile ? selectedFile.name : photoURL}
                    placeholder="Click to choose avatar"
                    onClick={() => isEditing && setIsModalOpen(true)}
                    className="w-full px-4 py-2 sm:px-5 sm:py-3 rounded-xl border-2 border-red-100 bg-red-50 text-gray-500 cursor-pointer focus:outline-none text-sm sm:text-base"
                  />

                  {isModalOpen && (
                    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                      <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-md space-y-4 shadow-lg overflow-y-auto max-h-[80vh]">
                        <h2 className="text-lg sm:text-xl font-semibold">Choose Avatar</h2>
                        <div>
                          <label className="block mb-1 font-medium text-sm sm:text-base">
                            Upload File
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              setSelectedFile(e.target.files[0]);
                              setPhotoURL('');
                            }}
                            className="w-full px-3 py-2 border rounded text-sm sm:text-base"
                          />
                        </div>

                        <div>
                          <label className="block mb-1 font-medium text-sm sm:text-base">
                            Or Paste Image URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={photoURL}
                            onChange={(e) => {
                              setPhotoURL(e.target.value);
                              setSelectedFile(null);
                            }}
                            className="w-full px-3 py-2 border rounded focus:outline-none text-sm sm:text-base"
                          />
                        </div>

                        <div className="flex justify-end gap-2 sm:gap-3 mt-4">
                          <button
                            onClick={() => {
                              setSelectedFile(null);
                              setPhotoURL(profileUser.photoURL);
                              setIsModalOpen(false);
                            }}
                            className="px-3 py-2 sm:px-4 sm:py-2 rounded bg-gray-200 text-sm sm:text-base"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-3 py-2 sm:px-4 sm:py-2 rounded bg-red-600 text-white text-sm sm:text-base"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold uppercase tracking-wide">
                    District
                  </label>
                  <input
                    type="text"
                    {...register('district')}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 sm:px-5 sm:py-3 rounded-xl border-2 ${
                      isEditing ? 'bg-white border-red-300' : 'bg-red-50 border-red-100'
                    } focus:outline-none capitalize text-sm sm:text-base`}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold uppercase tracking-wide">
                    Upazila
                  </label>
                  <input
                    type="text"
                    {...register('upazila')}
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 sm:px-5 sm:py-3 rounded-xl border-2 ${
                      isEditing ? 'bg-white border-red-300' : 'bg-red-50 border-red-100'
                    } focus:outline-none capitalize text-sm sm:text-base`}
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
