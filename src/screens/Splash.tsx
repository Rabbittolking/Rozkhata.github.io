import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';

export default function Splash() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Fake auth check
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const hasAppLock = localStorage.getItem('appLockPin');
      
      if (isLoggedIn) {
        if (hasAppLock) {
          navigate('/app-lock', { replace: true });
        } else {
          navigate('/home', { replace: true });
        }
      } else {
        navigate('/login', { replace: true });
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 bg-blue-600 flex flex-col items-center justify-center text-white p-6 relative">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="bg-white text-blue-600 p-2 rounded-3xl shadow-2xl mb-6 relative overflow-hidden">
          <img src="https://i.ibb.co/rKwQVx0x/1000049684-removebg-preview.png" alt="RozKhata" className="w-32 h-32 object-contain" />
        </div>
        <h1 className="text-4xl font-bold mb-2">{t('appName')}</h1>
        <p className="text-blue-100 text-lg">{t('splashSubtitle1')}</p>
        <p className="text-blue-100 text-lg">{t('splashSubtitle2')}</p>
      </motion.div>

      <div className="absolute bottom-8 text-blue-200 text-sm flex items-center justify-center flex-col gap-1 font-medium bg-blue-700/30 px-4 py-2 rounded-full border border-blue-500/30">
        <div className="flex items-center gap-1">
          Made with <span className="text-red-500 mx-1">❤️</span> in India <span className="mx-1 text-lg">🇮🇳</span>
        </div>
      </div>
    </div>
  );
}
