import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import './i18n/setup';
import Home from './pages/Home';
import ISOCreate from './pages/ISOCreate';
import ListingCreate from './pages/ListingCreate';
import ListingDetail from './pages/ListingDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AuthCallback from './pages/AuthCallback';

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/iso/new", element: <ISOCreate /> },
  { path: "/listing/new", element: <ListingCreate /> },
  { path: "/listing/:id", element: <ListingDetail /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/profile", element: <Profile /> },
  { path: "/checkout/:listingId", element: <Checkout /> },
  { path: "/orders", element: <Orders /> },
  { path: "/auth/callback", element: <AuthCallback /> },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
