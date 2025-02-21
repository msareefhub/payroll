import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';
import { lazy } from 'react';

// project import
// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthOtp = Loadable(lazy(() => import('pages/authentication/Otp')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <AuthLogin />
    },
    {
      path: 'otp',
      element: <AuthOtp />
    }
  ]
};

export default LoginRoutes;
