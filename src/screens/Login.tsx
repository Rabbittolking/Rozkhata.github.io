import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Fingerprint, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBiometrics } from '../lib/biometrics';
import { SearchModal } from '../components/SearchModal';
import { countries } from '../lib/constants';

export default function Login() {
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hasCredential, authenticateBiometrics } = useBiometrics();

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 7) { // varied length depending on country
      navigate('/otp', { state: { phone: `${countryCode}${phone}` } });
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const success = await authenticateBiometrics();
      if (success) {
        localStorage.setItem('isLoggedIn', 'true');
        navigate('/home', { replace: true });
      }
    } catch (e: any) {
      console.error(e);
      if (e.message && e.message.includes('not enabled in this document')) {
         alert("Biometrics error: Please open the app in a new tab to use biometrics. It is restricted inside the preview window.");
      }
      // Biometric failed or was cancelled, user can still use OTP
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col p-6 pt-12">
      <div className="flex items-center gap-2 mb-12 text-blue-600">
        <img src="https://i.ibb.co/rKwQVx0x/1000049684-removebg-preview.png" alt="RozKhata" className="w-8 h-8 object-contain" />
        <h1 className="text-2xl font-bold">{t('appName')}</h1>
      </div>

      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('welcomeBack')}</h2>
        <p className="text-gray-500 mb-8">{t('loginToContinue')}</p>

        <div className="flex justify-center mb-10">
          <div className="w-32 h-32 bg-white rounded-[1.75rem] shadow-xl shadow-blue-900/5 flex items-center justify-center relative p-1.5 border border-blue-50">
            <img src="https://i.ibb.co/rKwQVx0x/1000049684-removebg-preview.png" alt="RozKhata Icon" className="w-full h-full object-contain" />
            <div className="absolute -right-2 top-0 bg-blue-500 text-white text-[10px] px-2 py-1 rounded-full shadow-sm font-bold tracking-wider z-10">
              OTP
            </div>
          </div>
        </div>

        <form onSubmit={handleSendOTP} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t('enterMobileNumber')}</label>
            <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors bg-white">
              <button 
                type="button"
                onClick={() => setCountryModalOpen(true)}
                className="bg-gray-50 border-r-2 border-gray-200 flex items-center px-4 hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-700 font-bold font-mono text-lg">{countryCode}</span>
                <ChevronDown size={16} className="text-gray-400 ml-1" />
              </button>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                className="flex-1 px-4 py-3 outline-none font-mono text-lg tracking-wider w-full"
                placeholder="00000 00000"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={phone.length < 7}
            className="w-full bg-blue-600 text-white font-semibold rounded-xl py-4 hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('sendOtp')}
          </button>
        </form>

        {hasCredential && (
          <>
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-400 uppercase tracking-widest font-medium">Or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            <button
              onClick={handleBiometricLogin}
              className="w-full bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <Fingerprint size={24} className="text-blue-500" />
              {t('loginWithBiometrics')}
            </button>
          </>
        )}
      </div>

      <div className="text-center pb-4 text-xs text-gray-400">
        {t('agreeTerms')}<br/>
        <span className="text-blue-600 font-medium">{t('terms')}</span>
      </div>

      <SearchModal
        isOpen={countryModalOpen}
        onClose={() => setCountryModalOpen(false)}
        title="Select Country Code"
        placeholder="Search country or code..."
        items={countries.map(c => ({
          value: c.code,
          label: c.name,
          subLabel: c.code
        }))}
        onSelect={(code) => setCountryCode(code)}
      />
    </div>
  );
}
