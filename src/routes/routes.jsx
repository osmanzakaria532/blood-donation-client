import { createBrowserRouter } from 'react-router';
import DashboardLayout from '../Layouts/DashboardLayout';
import RootLayout from '../Layouts/RootLayout';
import Registration from '../Pages/Auth/Registratrion/Registration';
import SignIn from '../Pages/Auth/SignIn/SignIn';
import AllBloodDonationRequest from '../Pages/Dashboard/AllBloodDonationRequest/AllBloodDonationRequest';
import AllUsers from '../Pages/Dashboard/AllUsers/AllUsers';
import CreateDonationRequest from '../Pages/Dashboard/CreateDonationRequest/CreateDonationRequest';
import Dashboard from '../Pages/Dashboard/dashboard';
import Funding from '../Pages/Dashboard/Funding/Funding';
import MyDonationRequests from '../Pages/Dashboard/MyDonationRequests/MyDonationRequests';
import Profile from '../Pages/Dashboard/Profile/profile';
import DonationDetails from '../Pages/DonationDetails/DonationDetails';
import DonationRequests from '../Pages/DonationRequests/DonationRequests';
import Home from '../Pages/Home/Home';
import SearchDonors from '../Pages/SearchDonors/SearchDonors';
import AdminRouter from './AdminRoute';

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
      {
        path: 'funding',
        element: <Funding />,
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
        path: 'create-donation-request',
        element: <CreateDonationRequest />,
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
