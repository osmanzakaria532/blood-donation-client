import { createBrowserRouter } from 'react-router';
import RootLayout from '../Layouts/RootLayout';
import Registration from '../Pages/Auth/Registratrion/Registration';
import SignIn from '../Pages/Auth/SignIn/SignIn';
import DonationRequests from '../Pages/DonationRequests/DonationRequests';
import Home from '../Pages/Home/Home';

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
]);

export default router;
