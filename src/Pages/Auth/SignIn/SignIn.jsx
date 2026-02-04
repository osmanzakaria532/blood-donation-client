import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../Hooks/useAuth';

const SignIn = () => {
  const [show, setShow] = useState(false);
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignIn = (data) => {
    signInUser(data.email, data.password)
      .then((result) => {
        console.log(result.user);
        navigate('/');
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#FFF5F5] via-[#FFE5E9] to-[#FFF0F3] p-4 relative overflow-x-hidden">
      {/* Floating background blobs */}
      <div className="fixed top-[-50%] right-[-20%] w-[60%] h-[120%] rounded-full bg-gradient-radial from-[rgba(220,20,60,0.08)] to-transparent animate-[float_20s_ease-in-out_infinite] pointer-events-none"></div>
      <div className="fixed bottom-[-50%] left-[-20%] w-[60%] h-[120%] rounded-full bg-gradient-radial from-[rgba(255,107,135,0.08)] to-transparent animate-[float_25s_ease-in-out_infinite_reverse] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="relative text-center py-12 px-8 bg-linear-to-br from-[#DC143C] to-[#B12234] overflow-hidden">
            <span className="absolute text-[15rem] opacity-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-12 animate-pulse">
              🩸
            </span>
            <h1 className="relative z-10 font-serif text-white text-4xl font-bold mb-2 drop-shadow-md">
              🩸 LifeStream
            </h1>
            <p className="relative z-10 text-white/95">Welcome back to our life-saving community</p>
          </div>

          {/* Form */}
          <div className="p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1 animate-fadeIn">
                Login to Your Account
              </h2>
              <p className="text-gray-500 animate-fadeIn animate-delay-100">
                Continue saving lives with us
              </p>
            </div>

            <form onSubmit={handleSubmit(handleSignIn)} className="space-y-6">
              <div className="space-y-2 animate-fadeIn animate-delay-200">
                <label className="block text-gray-700 font-medium text-sm">
                  Email Address <span className="text-[#DC143C]">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#DC143C] focus:ring focus:ring-[#DC143C]/10 transition-all"
                    {...register('email', { required: 'Email is required' })}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
                    📧
                  </span>
                </div>
                {errors.email?.type === 'required' && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2 animate-fadeIn animate-delay-300">
                <label className="block text-gray-700 font-medium text-sm">
                  Password <span className="text-[#DC143C]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#DC143C] focus:ring focus:ring-[#DC143C]/10 transition-all"
                    {...register('password', { required: 'Password Is Required' })}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">
                    🔒
                  </span>
                  <span
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer text-xl"
                  >
                    👁️
                  </span>
                </div>
                {errors.password?.type === 'required' && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 animate-fadeIn animate-delay-500">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-[#DC143C]" />
                  Remember me
                </label>
                <Link href="#" className="text-[#DC143C] font-medium hover:text-[#B12234]">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-linear-to-br from-[#DC143C] to-[#B12234] text-white font-semibold rounded-xl shadow-md relative overflow-hidden hover:shadow-xl transition-all animate-fadeIn animate-delay-600"
              >
                <span>Login Now</span>
              </button>
            </form>

            <div className="flex items-center gap-4 my-8 text-gray-400 text-sm animate-fadeIn animate-delay-700">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span>or continue with</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 animate-fadeIn animate-delay-800">
              <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 hover:border-[#DC143C] hover:bg-[#FFF5F5] transition-all">
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 hover:border-[#DC143C] hover:bg-[#FFF5F5] transition-all">
                Facebook
              </button>
            </div>

            <div className="text-center text-gray-500 mt-6 animate-fadeIn animate-delay-900">
              Don't have an account?{' '}
              <Link
                to="/auth/registratrion"
                className="text-[#DC143C] font-semibold hover:text-[#B12234]"
              >
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
