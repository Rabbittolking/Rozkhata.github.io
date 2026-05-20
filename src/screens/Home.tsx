import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { Bell, Menu, Plus, Search, X, User, Settings, Package, Home as HomeIcon, LogOut } from 'lucide-react';
import { formatCurrency, cn } from '../lib/utils';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { subMonths, format, parseISO } from 'date-fns';
import { AdBanner } from '../components/AdBanner';
import { useAdmob } from '../lib/admob';

export default function Home() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { t } = useTranslation();
  const { showInterstitial } = useAdmob();

  const [userName, setUserName] = useState('Amit Kumar');
  const [storeName, setStoreName] = useState('Maa Kali Kirana Store');

  useEffect(() => {
    const savedUser = localStorage.getItem('userName');
    const savedStore = localStorage.getItem('storeName');
    if (savedUser) setUserName(savedUser);
    if (savedStore) setStoreName(savedStore);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };


  const customers = useLiveQuery(
    () => db.customers.orderBy('name').toArray()
  ) || [];

  const transactions = useLiveQuery(
    () => db.transactions.toArray()
  ) || [];

  // Generate last 6 months data for chart
  const getChartData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(new Date(), i);
      const monthStr = format(d, 'MMM');
      const monthPrefix = format(d, 'yyyy-MM');
      
      let monthlyUdhaar = 0;
      let monthlyJama = 0;

      transactions.forEach(tx => {
        if (tx.date.startsWith(monthPrefix)) {
          if (tx.type === 'udhaar') monthlyUdhaar += tx.amount;
          else monthlyJama += tx.amount;
        }
      });

      data.push({
        name: monthStr,
        udhaar: monthlyUdhaar,
        jama: monthlyJama,
      });
    }
    return data;
  };

  const chartData = getChartData();

  // Recalculate totals
  const totalUdhaar = customers.reduce((acc, curr) => acc + curr.totalUdhaar, 0);
  const totalJama = customers.reduce((acc, curr) => acc + curr.totalJama, 0);
  const netBalance = totalUdhaar - totalJama;

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="flex-1 bg-white dark:bg-gray-950 min-h-full relative transition-colors duration-200">
      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={cn(
        "fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl border-r border-gray-100 dark:border-gray-800",
        isDrawerOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 bg-blue-600 dark:bg-blue-700 text-white">
          <div className="flex justify-between items-start mb-4">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center text-2xl font-bold uppercase shadow-sm">
              {userName.charAt(0)}
            </div>
            <button onClick={() => setIsDrawerOpen(false)} className="p-1 rounded-full hover:bg-white/20 transition-colors">
              <X size={24} />
            </button>
          </div>
          <h2 className="text-xl font-bold">{userName}</h2>
          <p className="text-sm text-blue-100">{storeName}</p>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          <div 
            onClick={() => { setIsDrawerOpen(false); navigate('/'); }}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300"
          >
            <HomeIcon size={22} className="text-gray-500 dark:text-gray-400" />
            <span className="font-medium">Home</span>
          </div>
          <div 
            onClick={() => { setIsDrawerOpen(false); navigate('/profile'); }}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300"
          >
            <User size={22} className="text-gray-500 dark:text-gray-400" />
            <span className="font-medium">Profile</span>
          </div>
          <div 
            onClick={() => { setIsDrawerOpen(false); navigate('/products'); }}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300"
          >
            <Package size={22} className="text-gray-500 dark:text-gray-400" />
            <span className="font-medium">Products</span>
          </div>
          <div className="my-4 border-t border-gray-100 dark:border-gray-800"></div>
          <div 
            onClick={() => { setIsDrawerOpen(false); navigate('/profile'); }}
            className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-gray-700 dark:text-gray-300"
          >
            <Settings size={22} className="text-gray-500 dark:text-gray-400" />
            <span className="font-medium">Settings</span>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
           <button 
             onClick={() => {
               localStorage.removeItem('isLoggedIn');
               navigate('/login', { replace: true });
             }}
             className="w-full flex items-center gap-3 px-2 py-3 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors font-medium"
           >
             <LogOut size={22} />
             Logout
           </button>
        </div>
      </div>

      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-900 z-10 shadow-sm border-b border-transparent dark:border-gray-800 transition-colors">
        <button className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsDrawerOpen(true)}>
          <Menu size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex items-center gap-2">
           <img src="https://i.ibb.co/rKwQVx0x/1000049684-removebg-preview.png" alt="RozKhata" className="w-8 h-8 object-contain" />
           <span className="text-xl font-bold text-blue-600 dark:text-blue-500">{t('appName')}</span>
        </div>
        <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => navigate('/reminders')}>
          <Bell size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Admob Placeholder */}
      <AdBanner />

      <div className="p-4 space-y-6">
        {/* Dashboard Card */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm bg-white dark:bg-gray-900 transition-colors">
          <div className="flex divide-x divide-gray-200 dark:divide-gray-800">
            <div className="flex-1 pr-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('totalUdhaar')}</p>
              <p className="text-red-500 font-bold text-2xl">{formatCurrency(totalUdhaar)}</p>
            </div>
            <div className="flex-1 pl-4 text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('totalJama')}</p>
              <p className="text-green-600 font-bold text-2xl">{formatCurrency(totalJama)}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center px-2 py-1">
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{t('netBalance')}</span>
            <span className={cn("font-bold text-xl", netBalance >= 0 ? "text-green-600" : "text-red-500")}>
               {formatCurrency(Math.abs(netBalance))}
            </span>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm transition-colors">
           <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4 text-sm">Monthly Analytics</h2>
           <div className="h-48 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(val) => `₹${val}`} />
                 <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                 <Bar dataKey="udhaar" fill="#EF4444" radius={[4, 4, 0, 0]} name="Udhaar (Gave)" />
                 <Bar dataKey="jama" fill="#16A34A" radius={[4, 4, 0, 0]} name="Jama (Got)" />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Customer List Header */}
        <div>
          <div className="flex justify-between items-center mb-3">
             <h2 className="font-bold text-gray-800 dark:text-gray-100">{t('customerList')}</h2>
             <span className="text-sm text-blue-600 dark:text-blue-500 font-medium">{t('seeAll')}</span>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder={t('searchCustomer')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
            />
          </div>

          {/* List */}
          <div className="space-y-3 pb-8">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-10 text-gray-400 dark:text-gray-500">
                 {t('noCustomers')}
              </div>
            ) : (
              filteredCustomers.map((customer, index) => (
                <div key={customer.id} className="space-y-3">
                  {index > 0 && index % 3 === 0 && (
                    <div className="py-1">
                      <AdBanner />
                    </div>
                  )}
                  <div 
                    onClick={() => showInterstitial(() => navigate(`/customer/${customer.id}`)) }
                    className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                  >
                  <div className="flex items-center gap-3">
                    {customer.photo ? (
                       <img src={customer.photo} alt={customer.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                    ) : (
                       <div className="w-12 h-12 rounded-full font-bold text-lg flex items-center justify-center text-white capitalize bg-gradient-to-br from-blue-400 to-blue-600 shadow-inner">
                         {customer.name.charAt(0)}
                       </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{customer.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("font-bold", customer.netBalance >= 0 ? "text-red-500 dark:text-red-400" : "text-green-600 dark:text-green-500")}>
                       {formatCurrency(Math.abs(customer.netBalance))}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {customer.netBalance >= 0 ? t('gave') : t('got')}
                    </p>
                  </div>
                </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={() => showInterstitial(() => navigate('/add-customer'))}
        className="fixed bottom-[88px] right-4 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all z-20"
      >
        <Plus size={28} />
      </button>

      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
