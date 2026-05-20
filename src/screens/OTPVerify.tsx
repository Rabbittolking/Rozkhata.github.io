import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function OTPVerify() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || '+919876543210';
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple chars
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit complete OTP
    if (index === 5 && value && newOtp.every(v => v !== '')) {
      handleComplete();
    }
  };

  useEffect(() => {
    // Show demo OTP toast and notification after a short delay
    const timer = setTimeout(() => {
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
           new Notification("RozKhata OTP", { body: "Your login OTP is 123456" });
        } else if (Notification.permission !== "denied") {
           Notification.requestPermission().then(permission => {
             if (permission === "granted") {
               new Notification("RozKhata OTP", { body: "Your login OTP is 123456" });
             }
           });
        }
      }
      alert("Demo OTP Alert: Please enter 123456 to login.");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleComplete = () => {
    // Mock login success
    localStorage.setItem('isLoggedIn', 'true');
    // Clear old app lock pin on fresh login via OTP so they can reset it if they forgot
    localStorage.removeItem('appLockPin');
    navigate('/home', { replace: true });
  };

  return (
    <div className="flex-1 bg-white flex flex-col pt-4">
      <div className="px-4 flex items-center h-14 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold ml-2">{t('verifyOtp')}</h1>
      </div>

      <div className="p-6 flex flex-col items-center flex-1">
        <p className="text-gray-500 mt-8">{t('otpSentTo')}</p>
        <p className="font-bold text-lg font-mono tracking-wide mt-1 mb-10">{phone}</p>

        <div className="flex gap-2 justify-center mb-8 w-full max-w-[320px]">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => inputRefs.current[i] = el}
              type="tel"
              inputMode="numeric"
              value={digit}
              onChange={e => handleChange(i, e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => handleKeyDown(i, e)}
              className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-bold focus:border-blue-500 focus:outline-none transition-colors select-all"
            />
          ))}
        </div>

        <p className="text-sm text-gray-400">
          {t('expireIn')} <span className="font-bold text-gray-700">00:45</span>
        </p>

        <button className="mt-6 text-blue-600 font-semibold text-sm">
          {t('resendOtp')}
        </button>
        
        <button
           onClick={handleComplete}
           disabled={otp.some(v => v === '')}
           className="mt-auto w-full bg-blue-600 text-white font-semibold rounded-xl py-4 hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {t('verifyLogin')}
        </button>
      </div>
    </div>
  );
}
