import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Package } from 'lucide-react';
import { db } from '../lib/db';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAdmob } from '../lib/admob';

export default function AddTransaction() {
  const { id, txId } = useParams();
  const customerId = Number(id);
  const transactionId = txId ? Number(txId) : undefined;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as 'udhaar' | 'jama') || 'udhaar';
  const { t } = useTranslation();
  const { showInterstitial } = useAdmob();

  const [type, setType] = useState<'udhaar' | 'jama'>(initialType);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');

  const products = useLiveQuery(() => db.products.orderBy('name').toArray()) || [];

  useEffect(() => {
    if (transactionId) {
      db.transactions.get(transactionId).then((tx) => {
        if (tx) {
           setType(tx.type as 'udhaar' | 'jama');
           setAmount(tx.amount.toString());
           setDate(tx.date);
           setDueDate(tx.dueDate || '');
           setNote(tx.note || '');
           setSelectedProductId(tx.productId ? tx.productId.toString() : '');
        }
      });
    }
  }, [transactionId]);

  // Auto-fill amount when product is selected
  useEffect(() => {
    if (selectedProductId) {
       const prod = products.find(p => p.id === Number(selectedProductId));
       if (prod) {
           setAmount(prod.price.toString());
           if (!note) {
              setNote(prod.name);
           }
       }
    }
  }, [selectedProductId, products]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;

    const numAmount = Number(amount);
    
    let productName = '';
    const numProdId = selectedProductId ? Number(selectedProductId) : undefined;
    if (numProdId) {
        productName = products.find(p => p.id === numProdId)?.name || '';
    }

    await db.transaction('rw', db.customers, db.transactions, async () => {
      let diffUdhaar = 0;
      let diffJama = 0;
      
      if (transactionId) {
        const oldTx = await db.transactions.get(transactionId);
        if (oldTx) {
          if (oldTx.type === 'udhaar') diffUdhaar -= oldTx.amount;
          else diffJama -= oldTx.amount;
        }
        await db.transactions.update(transactionId, {
          type,
          amount: numAmount,
          date,
          dueDate: dueDate || undefined,
          note,
          productId: numProdId,
          productName
        });
      } else {
        await db.transactions.add({
          customerId,
          type,
          amount: numAmount,
          date,
          dueDate: dueDate || undefined,
          note,
          productId: numProdId,
          productName,
          createdAt: new Date().toISOString()
        });
      }
      
      if (type === 'udhaar') diffUdhaar += numAmount;
      else diffJama += numAmount;

      // Update customer balances
      const customer = await db.customers.get(customerId);
      if (customer) {
        const newUdhaar = (customer.totalUdhaar || 0) + diffUdhaar;
        const newJama = (customer.totalJama || 0) + diffJama;
        const newNet = newUdhaar - newJama;
        await db.customers.update(customerId, { totalUdhaar: newUdhaar, totalJama: newJama, netBalance: newNet });
      }
    });

    showInterstitial(() => {
      navigate(-1);
    });
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col h-full">
      <div className="px-4 flex items-center h-14 border-b border-gray-100 bg-white sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold ml-2">{transactionId ? 'Edit Transaction' : t('addTransaction')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Toggle Type */}
        <div className="flex border-2 border-gray-100 bg-gray-100 rounded-xl p-1 mb-6">
          <button
             type="button"
             onClick={() => setType('udhaar')}
             className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
               type === 'udhaar' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
             }`}
          >
            {t('udhaarGave')}
          </button>
          <button
             type="button"
             onClick={() => setType('jama')}
             className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
               type === 'jama' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
             }`}
          >
            {t('jamaGot')}
          </button>
        </div>

        <form id="add-tx-form" onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('selectProduct')} (Optional)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Package size={20} />
              </span>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none"
              >
                 <option value="">{t('selectProduct')}...</option>
                 {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                 ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('amount')}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">₹</span>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t('enterAmount')}
                className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-lg font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('date')}</label>
            <div className="relative">
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {type === 'udhaar' && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">{t('dueDateOptional')}</label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium text-red-500 placeholder:text-gray-400"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Product Name / Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Rice, Sugar or Note"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </form>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <button 
          form="add-tx-form"
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold rounded-xl py-4 hover:bg-blue-700 active:bg-blue-800 transition-colors disabled:opacity-50"
          disabled={!amount || isNaN(Number(amount))}
        >
          {t('saveTransaction')}
        </button>
      </div>
    </div>
  );
}
