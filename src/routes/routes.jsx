import { createBrowserRouter } from 'react-router';
import DashboardLayout from '../Layouts/DashboardLayout';
import RootLayout from '../Layouts/RootLayout';
import Registration from '../Pages/Auth/Registratrion/Registration';
import SignIn from '../Pages/Auth/SignIn/SignIn';
import Dashboard from '../Pages/Dashboard/dashboard';
import Profile from '../Pages/Dashboard/Profile/profile';
import DonationRequests from '../Pages/DonationRequests/DonationRequests';
import Home from '../Pages/Home/Home';
import MyDonationRequests from '../Pages/Dashboard/MyDonationRequests/MyDonationRequests';

// const role = 'donor'; // donor | volunteer | admin

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'donation-requests',
        element: <DonationRequests />,
      },
    ],
  },
  {
    path: '/auth',
    // element: <div>404 Not Found</div>,
    children: [
      {
        path: 'registratrion',
        element: <Registration />,
        loader: () => fetch('/bd-divisions-district-upazila-en.json').then((res) => res.json()),
      },
      {
        path: 'sign-in',
        element: <SignIn />,
      },
    ],
  },

  //

  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'my-donation-requests',
        element: <MyDonationRequests />,
      },
    ],
  },
]);

export default router;
