/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Splash from './screens/Splash';
import Login from './screens/Login';
import OTPVerify from './screens/OTPVerify';
import AppLock from './screens/AppLock';
import MainLayout from './screens/MainLayout';
import Home from './screens/Home';
import Reminders from './screens/Reminders';
import Profile from './screens/Profile';
import AddCustomer from './screens/AddCustomer';
import CustomerDetails from './screens/CustomerDetails';
import AddTransaction from './screens/AddTransaction';
import Products from './screens/Products';
import Terms from './screens/Terms';
import Privacy from './screens/Privacy';
import { useDarkMode } from './lib/useDarkMode';
import { AdProvider } from './lib/admob';

export default function App() {
  useDarkMode(); // Initialize dark mode globally

  return (
    <AdProvider>
      <div className="bg-gray-100 dark:bg-gray-950 min-h-screen flex justify-center w-full transition-colors duration-200">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 min-h-screen shadow-xl relative overflow-hidden flex flex-col transition-colors duration-200 text-gray-900 dark:text-gray-100">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/otp" element={<OTPVerify />} />
              <Route path="/app-lock" element={<AppLock />} />
              
              <Route element={<MainLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/reminders" element={<Reminders />} />
                <Route path="/profile" element={<Profile />} />
              </Route>

              <Route path="/add-customer" element={<AddCustomer />} />
              <Route path="/customer/:id" element={<CustomerDetails />} />
              <Route path="/customer/:id/edit" element={<AddCustomer />} />
              <Route path="/customer/:id/add-transaction" element={<AddTransaction />} />
              <Route path="/customer/:id/edit-transaction/:txId" element={<AddTransaction />} />
              <Route path="/products" element={<Products />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </AdProvider>
  );
}

