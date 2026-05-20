import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, Settings, Star, Share2, LogOut, Store, ChevronRight, Globe, Fingerprint, Package, Edit2, X, Download, Upload, Moon, Sun, PlayCircle, Trophy, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useBiometrics } from '../lib/biometrics';
import React, { useState, useEffect, useRef } from 'react';
import { SearchModal } from '../components/SearchModal';
import { languages } from '../lib/constants';
import { db } from '../lib/db';
import { useDarkMode } from '../lib/useDarkMode';
import { useAdmob } from '../lib/admob';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function Profile() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isSupported, hasCredential, registerBiometrics, disableBiometrics } = useBiometrics();
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const { showInterstitial, showRewarded } = useAdmob();
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [rateModalOpen, setRateModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [appLockModalOpen, setAppLockModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [isAppLockEnabled, setIsAppLockEnabled] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [userName, setUserName] = useState('Amit Kumar');
  const [storeName, setStoreName] = useState('Maa Kali Kirana Store');
  const [tempUserName, setTempUserName] = useState('');
  const [tempStoreName, setTempStoreName] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('userName');
    const savedStore = localStorage.getItem('storeName');
    const savedPin = localStorage.getItem('appLockPin');
    if (savedUser) setUserName(savedUser);
    if (savedStore) setStoreName(savedStore);
    if (savedPin) setIsAppLockEnabled(true);
  }, []);

  const handleSavePin = () => {
    if (newPin.length === 4) {
      localStorage.setItem('appLockPin', newPin);
      setIsAppLockEnabled(true);
      setAppLockModalOpen(false);
      setNewPin('');
      showToast("App Lock PIN set successfully!");
    } else {
      showToast("PIN must be 4 digits.");
    }
  };

  const handleRemovePin = () => {
    localStorage.removeItem('appLockPin');
    setIsAppLockEnabled(false);
    showToast("App Lock PIN removed.");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(tempUserName);
    setStoreName(tempStoreName);
    localStorage.setItem('userName', tempUserName);
    localStorage.setItem('storeName', tempStoreName);
    setEditProfileOpen(false);
    showToast("Profile updated successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login', { replace: true });
  };

  const [toastMsg, setToastMsg] = useState('');

  const handleBackup = (format: string) => {
    setExportModalOpen(false);
    db.transactions.toArray().then(transactions => {
      db.customers.toArray().then(customers => {
        let file: File;
        
        if (format === 'json') {
          const dataStr = JSON.stringify({ app: "RozKhata", date: new Date().toISOString(), customers, transactions }, null, 2);
          file = new File([dataStr], "RozKhata_Backup.json", { type: 'application/json' });
        } else if (format === 'pdf') {
          const doc = new jsPDF();
          // App Layout header
          doc.addImage('https://i.ibb.co/rKwQVx0x/1000049684-removebg-preview.png', 'PNG', 14, 10, 16, 16);
          doc.setFontSize(22);
          doc.setTextColor(37, 99, 235);
          doc.text('RozKhata', 35, 20);
          doc.setFontSize(12);
          doc.setTextColor(100, 100, 100);
          doc.text('Customer & Transactions Backup - ' + new Date().toLocaleDateString(), 35, 27);
          
          autoTable(doc, {
            startY: 35,
            head: [['ID', 'Name', 'Phone', 'Balance (Rs)']],
            body: customers.map(c => [c.id, c.name, c.phone, c.netBalance.toString()]),
          });
          
          autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 10,
            head: [['ID', 'Cust ID', 'Amount (Rs)', 'Type', 'Date']],
            body: transactions.map(t => [t.id, t.customerId, t.amount.toString(), t.type, new Date(t.date).toLocaleDateString()]),
          });
          
          file = new File([doc.output('blob')], "RozKhata_Backup.pdf", { type: 'application/pdf' });
        } else {
           const extension = format === 'csv' ? 'csv' : format === 'sheets' ? 'xls' : 'doc';
           const type = format === 'csv' ? 'text/csv' : format === 'sheets' ? 'application/vnd.ms-excel' : 'application/msword';
           
           let contentStr = '';
           if (format === 'csv') {
              contentStr = "RozKhata Data Backup\n\n";
              contentStr += "Customers\nID,Name,Phone,Balance\n" + customers.map(c => `${c.id},${c.name},${c.phone},${c.netBalance}`).join('\n');
              contentStr += "\n\nTransactions\nID,CustID,Amount,Type,Date\n" + transactions.map(t => `${t.id},${t.customerId},${t.amount},${t.type},${new Date(t.date).toLocaleDateString()}`).join('\n');
           } else {
              contentStr = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head><meta charset="utf-8"><title>RozKhata Backup</title></head>
                <body style="font-family: Arial, sans-serif;">
                  <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://i.ibb.co/rKwQVx0x/1000049684-removebg-preview.png" alt="RozKhata Logo" width="60" height="60" />
                    <h1 style="color: #2563EB;">RozKhata</h1>
                    <h3>Data Backup - ${new Date().toLocaleDateString()}</h3>
                  </div>
                  <h2>Customers (${customers.length})</h2>
                  <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
                    <tr style="background-color: #2563EB; color: white;"><th>ID</th><th>Name</th><th>Phone</th><th>Balance</th></tr>
                    ${customers.map(c => `<tr><td>${c.id}</td><td>${c.name}</td><td>${c.phone}</td><td>${c.netBalance}</td></tr>`).join('')}
                  </table>
                  <h2>Transactions (${transactions.length})</h2>
                  <table border="1" cellpadding="5" cellspacing="0" style="width:100%; border-collapse: collapse;">
                    <tr style="background-color: #2563EB; color: white;"><th>ID</th><th>CustID</th><th>Amount</th><th>Type</th><th>Notes</th><th>Date</th></tr>
                    ${transactions.map(t => `<tr><td>${t.id}</td><td>${t.customerId}</td><td>${t.amount}</td><td>${t.type}</td><td>${t.notes||''}</td><td>${new Date(t.date).toLocaleDateString()}</td></tr>`).join('')}
                  </table>
                </body>
                </html>
              `;
           }
           file = new File([contentStr], `RozKhata_Backup.${extension}`, { type });
        }

        try {
          const downloadFallback = () => {
            try {
              const url = URL.createObjectURL(file);
              const a = document.createElement('a');
              a.href = url;
              a.download = file.name;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              showToast(`Backup ${format.toUpperCase()} downloaded successfully!`);
            } catch (err) {
              showToast("Error downloading backup");
            }
          };

          if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
              title: "RozKhata Backup",
              text: "Here is my data backup from RozKhata",
              files: [file]
            }).catch((err) => {
               if (err.name !== 'AbortError') {
                 downloadFallback();
               }
            });
          } else {
             downloadFallback();
          }
        } catch(e) {
          showToast("Error generating backup");
        }
      });
    });
  };

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const result = event.target?.result as string;
        const backupData = JSON.parse(result);

        if (backupData.customers) {
          await db.customers.clear();
          await db.customers.bulkAdd(backupData.customers);
        }
        if (backupData.transactions) {
          await db.transactions.clear();
          await db.transactions.bulkAdd(backupData.transactions);
        }
        
        showToast("Data restored successfully!");
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err) {
        showToast("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleRateSubmit = () => {
    setRateModalOpen(false);
    setRating(0);
    showToast("Thanks for your rating!");
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const menuItems = [
    { icon: isDark ? Sun : Moon, label: isDark ? 'Light Mode' : 'Dark Mode', color: 'text-indigo-400', action: toggleDarkMode },
    { icon: Package, label: t('manageProducts'), color: 'text-orange-500', path: '/products' },
    { icon: Download, label: 'Backup Data', color: 'text-blue-500', action: () => setExportModalOpen(true) },
    { icon: Upload, label: 'Restore Data', color: 'text-indigo-500', action: () => fileInputRef.current?.click() },
    { icon: Settings, label: t('settings'), color: 'text-gray-500', action: () => {
        setTempUserName(userName);
        setTempStoreName(storeName);
        setEditProfileOpen(true);
    } },
    { icon: Star, label: t('rateUs'), color: 'text-yellow-500', action: () => setRateModalOpen(true) },
    { icon: Share2, label: t('shareApp'), color: 'text-green-500', action: async () => {
      try {
        if (navigator.share) {
          await navigator.share({
            title: 'RozKhata App',
            text: 'Mera RozKhata app download karein aur hisaab asaan banayein!',
            url: 'https://play.google.com/store/apps/details?id=com.rozkhata.app'
          });
        } else {
          showToast("Sharing not supported");
        }
      } catch (err) {
         console.log(err);
      }
    } },
    { icon: Shield, label: 'Privacy Policy', color: 'text-blue-400', path: '/privacy' },
    { icon: Shield, label: 'Terms & Conditions', color: 'text-gray-400', path: '/terms' },
  ];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  const toggleBiometrics = async () => {
    if (hasCredential) {
      disableBiometrics();
    } else {
      try {
        await registerBiometrics('+91 98765 43210'); // using dummy phone for profile
      } catch (e: any) {
        if (e.message && e.message.includes('not enabled in this document')) {
           alert("Biometrics error: Please open the app in a new tab to enable biometrics. It is restricted inside the preview window.");
        } else {
           alert(t('biometricNotSupported'));
        }
      }
    }
  };

  return (
    <div className="flex-1 min-h-full transition-colors duration-200">
      <div className="px-4 py-4 flex justify-between items-center bg-white dark:bg-gray-800 sticky top-0 z-10 border-b border-gray-100 dark:border-gray-700 transition-colors">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 invisible">{t('profile')}</h1>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 absolute left-1/2 -translate-x-1/2">{t('profile')}</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => navigate('/reminders')}>
          <Bell size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 relative transition-colors">
          <button 
            onClick={() => {
              setTempUserName(userName);
              setTempStoreName(storeName);
              setEditProfileOpen(true);
            }} 
            className="absolute top-4 right-4 p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
             <Edit2 size={16} />
          </button>
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold uppercase shadow-md">
            {userName.charAt(0)}
          </div>
          <div className="pr-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">{userName}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">+91 98765 43210</p>
          </div>
        </div>

        {/* Store Card */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer" onClick={() => {
            setTempUserName(userName);
            setTempStoreName(storeName);
            setEditProfileOpen(true);
        }}>
          <div className="flex items-center gap-3">
             <Store size={24} className="text-blue-600" />
             <span className="font-semibold text-gray-700 dark:text-gray-200">{t('storeName')}</span>
          </div>
          <div className="flex items-center text-gray-400 dark:text-gray-500 text-sm">
             <span className="mr-1">{storeName}</span>
             <ChevronRight size={18} />
          </div>
        </div>

        {/* Language Selector */}
        <div 
          className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer"
          onClick={() => setLangModalOpen(true)}
        >
          <div className="flex items-center gap-3">
             <Globe size={22} className="text-purple-500" />
             <span className="font-medium text-gray-700 dark:text-gray-200">{t('language')}</span>
          </div>
          <div className="flex items-center text-gray-500 dark:text-gray-400 font-medium">
             <span className="mr-2 uppercase">{i18n.language}</span>
             <ChevronRight size={18} className="text-gray-300 dark:text-gray-600" />
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700 transition-colors">
          {menuItems.map((item, idx) => (
            <div 
               key={idx} 
               className="p-4 flex items-center justify-between active:bg-gray-50 dark:active:bg-gray-700/50 transition-colors cursor-pointer"
               onClick={() => {
                 if (item.path) navigate(item.path);
                 else if (item.action) item.action();
               }}
            >
               <div className="flex items-center gap-3">
                  <item.icon size={22} className={item.color} />
                  <span className="font-medium text-gray-700 dark:text-gray-200">{item.label}</span>
               </div>
               <ChevronRight size={20} className="text-gray-300 dark:text-gray-600" />
            </div>
          ))}
        </div>

        <button 
          onClick={handleLogout}
          className="w-full bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/30 text-red-500 dark:text-red-400 p-4 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm mt-4"
        >
          <LogOut size={20} />
          {t('logout')}
        </button>
      </div>

      <SearchModal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
        title="Select Language"
        placeholder="Search language..."
        items={languages.map(l => ({
          value: l.code,
          label: l.nativeName,
          subLabel: l.name
        }))}
        onSelect={handleLanguageChange}
      />

      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg z-50 transition-all">
          {toastMsg}
        </div>
      )}

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Edit Profile & Settings</h2>
              <button onClick={() => setEditProfileOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1.5">Store Name</label>
                <input
                  type="text"
                  required
                  value={tempStoreName}
                  onChange={(e) => setTempStoreName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold rounded-xl py-3 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rate Us Modal */}
      {rateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl p-6 text-center border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Rate RozKhata</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">How was your experience using our app?</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button 
                  key={star} 
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                >
                  <Star 
                    size={40} 
                    className={rating >= star ? "fill-yellow-400 text-yellow-500 dark:fill-yellow-500" : "text-gray-200 dark:text-gray-700"} 
                  />
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setRateModalOpen(false)}
                className="flex-1 py-3 font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleRateSubmit}
                disabled={rating === 0}
                className="flex-1 py-3 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* App Lock PIN Modal */}
      {appLockModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl p-6 text-center border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">Set App Lock PIN</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Enter a 4-digit PIN to secure your app.</p>
            
            <input
              type="tel"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              placeholder="0000"
              className="w-full text-center tracking-[1em] font-mono text-2xl px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-xl focus:outline-none focus:border-blue-500 transition-colors mb-6"
            />
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setAppLockModalOpen(false);
                  setNewPin('');
                }}
                className="flex-1 py-3 font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSavePin}
                disabled={newPin.length !== 4}
                className="flex-1 py-3 font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Format Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-xl overflow-hidden flex flex-col border border-gray-100 dark:border-gray-700">
             <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
               <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Export Backup As</h2>
               <button onClick={() => setExportModalOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                 <X size={20} className="text-gray-500 dark:text-gray-400" />
               </button>
             </div>
             <div className="p-2 flex flex-col pt-4 pb-6">
                {[
                  { id: 'json', label: 'JSON Data (RozKhata Format)' },
                  { id: 'pdf', label: 'PDF Document' },
                  { id: 'doc', label: 'MS Word (.doc)' },
                  { id: 'csv', label: 'MS Excel (.csv)' },
                  { id: 'sheets', label: 'Google Sheets format' }
                ].map(opt => (
                   <button 
                      key={opt.id} 
                      onClick={() => handleBackup(opt.id)}
                      className="w-full text-left px-5 py-4 font-semibold text-gray-700 dark:text-gray-200 border-b last:border-0 border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                   >
                      {opt.label}
                   </button>
                ))}
             </div>
          </div>
        </div>
      )}

      {/* Hidden file input for restore */}
      <input 
        type="file" 
        accept=".json" 
        ref={fileInputRef} 
        onChange={handleRestore} 
        className="hidden" 
      />
    </div>
  );
}
