import { createBrowserRouter } from 'react-router';
import DashboardLayout from '../Layouts/DashboardLayout';
import RootLayout from '../Layouts/RootLayout';
import Registration from '../Pages/Auth/Registratrion/Registration';
import SignIn from '../Pages/Auth/SignIn/SignIn';
import CreateDonationRequest from '../Pages/CreateDonationRequest/CreateDonationRequest';
import AllBloodDonationRequest from '../Pages/Dashboard/AllBloodDonationRequest/AllBloodDonationRequest';
import AllUsers from '../Pages/Dashboard/AllUsers/AllUsers';
import Dashboard from '../Pages/Dashboard/dashboard';
import MyDonationRequests from '../Pages/Dashboard/MyDonationRequests/MyDonationRequests';
import Profile from '../Pages/Dashboard/Profile/profile';
import Home from '../Pages/Home/Home';
import AdminRouter from './AdminRoute';
import DonationRequests from '../Pages/DonationRequests/DonationRequests';
import DonationDetails from '../Pages/DonationDetails/DonationDetails';
import SearchDonors from '../Pages/SearchDonors/SearchDonors';

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
      {
        path: 'donation-details',
        element: <DonationDetails />,
      },
      {
        path: 'search-donors',
        element: <SearchDonors />,
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

      {
        path: 'all-blood-donation-request',
        element: <AllBloodDonationRequest />,
      },
      {
        path: 'all-users',
        element: (
          <AdminRouter>
            <AllUsers />,
          </AdminRouter>
        ),
      },
    ],
  },
]);

export default router;
