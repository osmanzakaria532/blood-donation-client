import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../Hooks/useAuth';

const Login = () => {
  const {
    logInUser,
    logInWithGoogle,
    loginUserToBackend,
    googleLoginToBackend,
    saveUserToBackend,
  } = useAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Email & Password Login
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await logInUser(data.email, data.password);

      const res = await loginUserToBackend(data.email, data.password);
      localStorage.setItem('access-token', res.token);

      toast.success('Welcome back! Thank you for being a life saver ❤️');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await logInWithGoogle();
      const user = result.user;

      await saveUserToBackend({
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      });

      const res = await googleLoginToBackend(user.email);
      localStorage.setItem('access-token', res.token);

      toast.success('Login successful! Together we save lives ❤️');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Google login failed! Please try again.', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div>
        <h2 className="text-[42px] font-extrabold text-center">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-6">Continue your journey of saving lives ❤️</p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-96">
          {/* Email */}
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              className="input w-full"
              placeholder="Enter your email"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </fieldset>

          {/* Password */}
          <fieldset className="fieldset">
            <label className="label">Password</label>
            <input
              type="password"
              className="input w-full"
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </fieldset>

          <button
            type="submit"
            className="btn bg-primary w-full mt-4 text-white"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login to Continue Helping'}
          </button>

          <div className="divider my-4">OR CONTINUE WITH</div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline w-full flex items-center justify-center gap-2"
            disabled={loading}
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </button>

          <p className="mt-4 text-center text-sm text-gray-500">
            Your information is safe and only used to connect blood donors with patients in need.
          </p>

          <p className="mt-4 text-center">
            New here? Join us and help save lives{' '}
            <Link to="/auth/register" className="text-primary font-semibold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
