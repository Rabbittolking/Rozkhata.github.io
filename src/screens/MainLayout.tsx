import { Outlet, NavLink, Navigate } from 'react-router-dom';
import { Home, Users, Bell, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function MainLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('isLoggedIn') === 'true');
  }, []);

  const tabs = [
    { to: '/home', icon: Home, label: t('tabHome') },
    { to: '/reminders', icon: Bell, label: t('tabReminders') },
    { to: '/profile', icon: User, label: t('tabProfile') },
  ];

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated === null) return null; // wait until checked

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 h-full relative overflow-hidden transition-colors duration-200">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-[76px]">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 h-[68px] bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center px-2 pb-safe transition-colors duration-200">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs transition-colors",
                isActive ? "text-blue-600 dark:text-blue-500 font-medium" : "text-gray-400 dark:text-gray-500"
              )
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon
                  size={24}
                  className={isActive ? 'fill-current' : ''}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span>{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
