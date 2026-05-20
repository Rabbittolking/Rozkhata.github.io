import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, ChevronDown, Contact } from 'lucide-react';
import { db } from '../lib/db';
import { useTranslation } from 'react-i18next';
import { SearchModal } from '../components/SearchModal';
import { countries } from '../lib/constants';

export default function AddCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (id) {
      db.customers.get(Number(id)).then(customer => {
        if (customer) {
          setName(customer.name);
          setAddress(customer.address || '');
          setPhoto(customer.photo || null);
          
          let p = customer.phone;
          const foundCountry = countries.find(c => p.startsWith(c.code));
          if (foundCountry) {
            setCountryCode(foundCountry.code);
            setPhone(p.substring(foundCountry.code.length));
          } else {
            setPhone(p);
          }
        }
      });
    }
  }, [id]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePickContact = async () => {
    try {
      if ('contacts' in navigator && 'ContactsManager' in window) {
        if (window.self !== window.top) {
           alert("Contact picker can only be used when the app is opened in a new tab. Please open the app in a new browser tab to use this feature.");
           return;
        }
        const props = ['name', 'tel'];
        const opts = { multiple: false };
        const contacts = await (navigator as any).contacts.select(props, opts);
        if (contacts && contacts.length > 0) {
          const contact = contacts[0];
          if (contact.name && contact.name.length > 0) {
            setName(contact.name[0]);
          }
          if (contact.tel && contact.tel.length > 0) {
            let p = contact.tel[0].replace(/[^0-9+]/g, '');
            if (p.startsWith('+91')) {
                setCountryCode('+91');
                setPhone(p.substring(3));
            } else if (p.startsWith('91') && p.length === 12) {
                setCountryCode('+91');
                setPhone(p.substring(2));
            } else if (p.startsWith('+')) {
                const foundCountry = countries.find(c => p.startsWith(c.code));
                if (foundCountry) {
                    setCountryCode(foundCountry.code);
                    setPhone(p.substring(foundCountry.code.length));
                } else {
                    setPhone(p.replace(/[^0-9]/g, ''));
                }
            } else {
                setPhone(p);
            }
          }
        }
      } else {
        alert("Contact picker is not supported on this device/browser.");
      }
    } catch (err: any) {
      console.error(err);
      if (window.self !== window.top || (err.message && err.message.includes('top frame'))) {
        alert("Contact picker can only be used when the app is opened in a new tab. Please open the app in a new browser tab to use this feature.");
      } else {
        alert("Error picking contact: " + (err.message || 'Unknown error'));
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || phone.length < 7) return;

    if (id) {
       await db.customers.update(Number(id), {
          name,
          phone: `${countryCode}${phone}`,
          address,
          photo: photo || '',
       });
    } else {
       await db.customers.add({
         name,
         phone: `${countryCode}${phone}`,
         address,
         photo: photo || '',
         totalUdhaar: 0,
         totalJama: 0,
         netBalance: 0,
         createdAt: new Date().toISOString()
       });
    }

    navigate(-1);
  };

  return (
    <div className="flex-1 bg-white flex flex-col h-full">
      <div className="px-4 flex items-center h-14 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold ml-2">{id ? 'Edit Customer' : t('addCustomer')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">


        <form id="add-customer-form" onSubmit={handleSave} className="space-y-5">
          {(!id && ('contacts' in navigator && 'ContactsManager' in window)) && (
            <div className="flex justify-center -mt-2 mb-2">
              <button 
                type="button" 
                onClick={handlePickContact} 
                className="text-sm font-medium text-blue-700 dark:text-blue-400 flex items-center gap-2 px-6 py-2.5 bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800/50 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/60 active:scale-95 transition-all shadow-sm"
              >
                 <Contact size={18} />
                 Import from Contacts
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('name')}</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('enterCustomerName')}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('mobileNumber')}</label>
            <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all bg-white">
              <button 
                type="button"
                onClick={() => setCountryModalOpen(true)}
                className="bg-gray-50 border-r border-gray-200 flex items-center px-3 hover:bg-gray-100 transition-colors"
              >
                <span className="text-gray-500 font-medium font-mono text-sm">{countryCode}</span>
                <ChevronDown size={14} className="text-gray-400 ml-1" />
              </button>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                className="flex-1 px-4 py-3 outline-none font-mono tracking-wide placeholder:text-gray-400"
                placeholder={t('enterMobileNumberInput')}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('addressOptional')}</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t('enterAddress')}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-400 resize-none"
            />
          </div>
        </form>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <button 
          form="add-customer-form"
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold rounded-xl py-4 hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50"
          disabled={!name || phone.length < 7}
        >
          {t('saveCustomer')}
        </button>
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
