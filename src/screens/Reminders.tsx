import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../lib/db';
import { formatCurrency, cn } from '../lib/utils';
import { format, isPast, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { Bell, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BannerAd } from '../components/BannerAd';
import { askNotificationPermission } from '../lib/notifications';

export default function Reminders() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const transactions = useLiveQuery(() => db.transactions.toArray()) || [];
  const { t } = useTranslation();

  useEffect(() => {
    // Request permission when arriving on Reminders screen
    askNotificationPermission();
  }, []);

  const customers = useLiveQuery(() => db.customers.toArray()) || [];
  
  const customerMap = customers.reduce((acc, c) => {
     if (c.id) acc[c.id] = c;
     return acc;
  }, {} as Record<number, any>);

  const dueTx = transactions
    .filter(tx => tx.dueDate && tx.type === 'udhaar')
    .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

  const upcomingReminders = dueTx.filter(tx => {
    const cust = customerMap[tx.customerId];
    return cust && cust.netBalance > 0;
  });

  const completedReminders = dueTx.filter(tx => {
    const cust = customerMap[tx.customerId];
    return cust && cust.netBalance <= 0;
  });

  const displayedReminders = activeTab === 'upcoming' ? upcomingReminders : completedReminders;

  return (
    <div className="flex-1 bg-gray-50 min-h-full pb-8">
      <div className="px-4 py-4 flex justify-center items-center bg-white sticky top-0 z-10 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-800">{t('reminders')}</h1>
      </div>

      <div className="p-4">
         <BannerAd />
         <div className="flex bg-white rounded-lg p-1 border border-gray-200 mb-6">
            <button 
              onClick={() => setActiveTab('upcoming')}
              className={cn("flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors", activeTab === 'upcoming' ? "bg-green-600 text-white shadow-sm" : "text-gray-500")}
            >
               {t('upcoming')}
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={cn("flex-1 py-1.5 text-sm font-semibold rounded-md transition-colors", activeTab === 'completed' ? "bg-green-600 text-white shadow-sm" : "text-gray-500")}
            >
               {t('completed')}
            </button>
         </div>

         <div className="space-y-3">
            {displayedReminders.length === 0 ? (
               <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                  <Bell size={40} className="text-gray-300 mb-3" />
                  {activeTab === 'upcoming' ? t('noUpcomingReminders') : 'No completed reminders'}
               </div>
            ) : (
               displayedReminders.map(tx => {
                 const dueDate = new Date(tx.dueDate!);
                 const past = isPast(dueDate) && !isToday(dueDate);
                 const today = isToday(dueDate);
                 const tmrw = isTomorrow(dueDate);
                 const days = Math.abs(differenceInDays(dueDate, new Date()));
                 
                 let dueText = '';
                 if (activeTab === 'completed') dueText = 'Amount Paid';
                 else if (past) dueText = `${t('overdueBy')} ${days} ${t('days')}`;
                 else if (today) dueText = t('dueToday');
                 else if (tmrw) dueText = t('dueTomorrow');
                 else dueText = `${t('dueIn')} ${days} ${t('days')}`;

                 return (
                   <div key={tx.id} className={cn("bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between", activeTab === 'completed' && "opacity-75")}>
                     <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", activeTab === 'completed' ? "bg-green-50 text-green-500" : "bg-orange-50 text-orange-500")}>
                           {activeTab === 'completed' ? <CheckCircle size={20} /> : <Bell size={20} />}
                        </div>
                        <div>
                           <h3 className="font-semibold text-gray-900">{customerMap[tx.customerId]?.name || 'Unknown'}</h3>
                           <p className={cn(
                              "text-xs font-medium mt-0.5",
                              activeTab === 'completed' ? "text-green-500" : (past ? "text-red-500" : (today ? "text-orange-500" : "text-gray-500"))
                           )}>
                              {dueText}
                           </p>
                        </div>
                     </div>
                     <span className={cn("font-bold text-red-500", activeTab === 'completed' && "text-gray-400 line-through")}>
                        {formatCurrency(tx.amount)}
                     </span>
                   </div>
                 )
               })
            )}
         </div>
      </div>
    </div>
  );
}
