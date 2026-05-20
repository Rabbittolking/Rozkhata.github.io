import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, Lock, ShieldAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBiometrics } from '../lib/biometrics';

export default function AppLock() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hasCredential, authenticateBiometrics } = useBiometrics();

  const savedPin = localStorage.getItem('appLockPin');

  useEffect(() => {
    if (hasCredential && savedPin) {
      handleBiometricAuth();
    }
  }, [hasCredential]);

  const handleBiometricAuth = async () => {
    try {
      const success = await authenticateBiometrics();
      if (success) {
        navigate('/home', { replace: true });
      }
    } catch (e) {
      console.error(e);
      // Fallback to PIN
    }
  };

  const handlePinSubmit = () => {
    if (pin === savedPin) {
      navigate('/home', { replace: true });
    } else {
      setError('Incorrect PIN');
      setPin('');
    }
  };

  const handleForgotPin = () => {
    // Navigate to OTP for forgot PIN
    localStorage.removeItem('isLoggedIn'); // Force re-login
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center mb-6">
        <Lock size={40} />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">App Locked</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Enter your PIN to access RozKhata</p>

      <div className="flex justify-center gap-4 mb-4">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`w-14 h-16 rounded-xl flex items-center justify-center text-2xl font-bold bg-gray-50 dark:bg-gray-800 border-2 transition-colors ${
              pin.length > i 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-gray-200 dark:border-gray-700 text-transparent'
            }`}
          >
            {pin.length > i ? '•' : ''}
          </div>
        ))}
      </div>
      <input
        type="tel"
        maxLength={4}
        value={pin}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '');
          setPin(val);
          setError('');
          if (val.length === 4) {
             setTimeout(() => {
                if (val === savedPin) {
                   navigate('/home', { replace: true });
                } else {
                   setError('Incorrect PIN');
                   setPin('');
                }
             }, 100);
          }
        }}
        className="opacity-0 absolute w-full h-20 bottom-1/2 cursor-text"
        autoFocus
      />
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {hasCredential && (
        <button
          onClick={handleBiometricAuth}
          className="mt-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20"
        >
          <Fingerprint size={24} />
          Use Biometrics
        </button>
      )}

      <button 
        onClick={handleForgotPin}
        className="mt-auto pb-8 text-sm font-medium text-blue-600 dark:text-blue-400"
      >
        Forgot PIN?
      </button>
    </div>
  );
}
