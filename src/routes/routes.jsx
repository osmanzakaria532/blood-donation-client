import { createBrowserRouter } from 'react-router';
import RootLayout from '../Layouts/RootLayout';

// const role = 'donor'; // donor | volunteer | admin

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <p>home</p>,
        // loader: () => import('../Components/Home.jsx').then((module) => module.default),
        // lazy: () => import('../Components/Home.jsx').then((module) => ({ element: <module.default /> })),
        // Component: () => import('../Components/Home.jsx').then((module) => module.default),
      },
      {
        path: 'donation-requests',
        element: <p>Donation Requests</p>,
      },
    ],
  },
]);

export default router;
