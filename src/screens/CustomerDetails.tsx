import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowLeft, Edit2, Share2, Phone, Download, MessageCircle } from 'lucide-react';
import { db } from '../lib/db';
import { formatCurrency, cn } from '../lib/utils';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import jsPDF from 'jspdf';
import { AdBanner } from '../components/AdBanner';

import { useAdmob } from '../lib/admob';

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customerId = Number(id);
  const { t } = useTranslation();
  const { showInterstitial } = useAdmob();

  const customer = useLiveQuery(() => db.customers.get(customerId));
  const transactions = useLiveQuery(
    () => db.transactions
            .where('customerId')
            .equals(customerId)
            .toArray()
  );

  const sortedTransactions = transactions ? [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : [];

  const handleWhatsAppShare = () => {
    if (!customer) return;
    const balance = Math.abs(customer.netBalance);
    const text = customer.netBalance >= 0 
      ? `Dear ${customer.name}, your total pending due limit is ₹${balance}. Please ignore if paid. Check RozKhata: https://ais-pre-4i3mzmokhcneihg6h3sfdx-508261466194.asia-east1.run.app`
      : `Dear ${customer.name}, you have a surplus balance of ₹${balance}. Check RozKhata: https://ais-pre-4i3mzmokhcneihg6h3sfdx-508261466194.asia-east1.run.app`;
    
    // Attempt WhatsApp intent
    window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`);
  };

  const handleNativeShare = async () => {
    if (!customer) return;
    const balance = Math.abs(customer.netBalance);
    const text = customer.netBalance >= 0 
      ? `Dear ${customer.name}, your total pending due limit is ₹${balance}. Please ignore if paid.`
      : `Dear ${customer.name}, you have a surplus balance of ₹${balance}.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'RozKhata Update',
          text: text,
          url: 'https://play.google.com/store/apps/details?id=com.rozkhata.app'
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      handleWhatsAppShare();
    }
  };

  const handleDownloadPDF = async () => {
    if (!customer) return;
    const doc = new jsPDF();
    
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = "https://i.ibb.co/rKwQVx0x/1000049684-removebg-preview.png";
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      doc.addImage(img, 'PNG', 20, 15, 12, 12);
      
      doc.setTextColor(37, 99, 235); // text-blue-600
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text('RozKhata', 35, 24);
      doc.setTextColor(0, 0, 0);
    } catch (e) {
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text('RozKhata Receipt', 20, 24);
      doc.setTextColor(0, 0, 0);
    }
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text(`Customer: ${customer.name}`, 20, 40);
    doc.text(`Phone: ${customer.phone}`, 20, 50);
    
    const balanceText = customer.netBalance >= 0 ? `To Pay: Rs ${customer.netBalance}` : `Advance: Rs ${Math.abs(customer.netBalance)}`;
    doc.text(`Net Balance: ${balanceText}`, 20, 60);

    let yPosition = 80;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text('Date', 20, yPosition);
    doc.text('Note', 70, yPosition);
    doc.text('Type', 130, yPosition);
    doc.text('Amount', 160, yPosition);
    
    doc.setFont("helvetica", "normal");
    doc.line(20, yPosition + 2, 190, yPosition + 2);
    yPosition += 10;

    sortedTransactions.forEach(tx => {
       if (yPosition > 270) {
         doc.addPage();
         yPosition = 20;
       }
       doc.text(tx.date, 20, yPosition);
       const note = tx.note || tx.productName || 'No Note';
       doc.text(note.substring(0, 20), 70, yPosition);
       doc.text(tx.type === 'udhaar' ? 'Udhaar' : 'Jama', 130, yPosition);
       doc.text(`Rs ${tx.amount}`, 160, yPosition);
       yPosition += 10;
    });

    doc.save(`RozKhata_${customer.name}_Report.pdf`);
  };

  if (!customer) return null;

  return (
    <div className="flex-1 bg-gray-50 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 flex justify-between items-center h-16 bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 mr-1 rounded-full hover:bg-gray-100">
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          {customer.photo ? (
             <img src={customer.photo} alt={customer.name} className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200" />
          ) : (
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg mr-3">
               {customer.name.charAt(0)}
             </div>
          )}
          <div>
            <h1 className="text-base font-bold leading-tight">{customer.name}</h1>
            <p className="text-[11px] text-gray-500 font-mono">{customer.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
           <a href={`tel:${customer.phone}`} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 block"><Phone size={20}/></a>
           <button onClick={() => navigate(`/customer/${customer.id}/edit`)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600"><Edit2 size={20}/></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-safe">
        <div className="p-4 space-y-4">
          {/* Balance Card matching UI */}
          <div className="p-1 rounded-2xl bg-white shadow-sm border border-gray-100">
            <div className="bg-blue-700 text-white rounded-xl p-4 flex divide-x divide-blue-600">
              <div className="flex-1 pr-4">
                <p className="text-blue-100 text-sm mb-1">{t('totalUdhaar')}</p>
                <p className="font-bold text-xl">{formatCurrency(customer.totalUdhaar)}</p>
              </div>
              <div className="flex-1 pl-4 text-right">
                <p className="text-blue-100 text-sm mb-1">{t('totalJama')}</p>
                <p className="font-bold text-xl">{formatCurrency(customer.totalJama)}</p>
              </div>
            </div>
            <div className="mt-2 py-2 flex flex-col items-center">
               <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">{t('netBalance')}</span>
               <span className={cn("font-bold text-xl", customer.netBalance >= 0 ? "text-red-500" : "text-green-600")}>
                 {formatCurrency(Math.abs(customer.netBalance))}
               </span>
            </div>
          </div>

          <div className="flex gap-4 mb-2">
            <button 
              onClick={() => showInterstitial(() => navigate(`/customer/${customerId}/add-transaction?type=udhaar`))}
              className="flex-1 bg-red-500 text-white font-semibold py-3 rounded-xl shadow-sm shadow-red-200 active:scale-95 transition-transform"
            >
              {t('addUdhaarButton')}
            </button>
            <button 
              onClick={() => showInterstitial(() => navigate(`/customer/${customerId}/add-transaction?type=jama`))}
              className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-xl shadow-sm shadow-green-200 active:scale-95 transition-transform"
            >
              {t('addJamaButton')}
            </button>
          </div>

          <div className="flex gap-4 mb-2">
            <button 
              onClick={handleWhatsAppShare}
              className="flex-1 bg-[#25D366] text-white font-semibold py-2.5 rounded-xl shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <MessageCircle size={18} />
              WhatsApp
            </button>
            <button 
              onClick={handleDownloadPDF}
              className="flex-1 bg-white border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl shadow-sm active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <Download size={18} />
              PDF Report
            </button>
          </div>

          {/* Transactions List */}
          <div>
            <div className="flex justify-between items-center mb-3 mt-6">
              <h2 className="font-bold text-gray-800">{t('transactionHistory')}</h2>
              <button onClick={handleNativeShare} className="text-blue-600 p-2 -mr-2 rounded-full hover:bg-gray-100"><Share2 size={20}/></button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 shadow-sm">
              {sortedTransactions.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                   {t('noTransactions')}
                </div>
              ) : (
                sortedTransactions.map(tx => (
                  <div 
                    key={tx.id} 
                    className="p-3.5 flex justify-between items-start cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    onClick={() => showInterstitial(() => navigate(`/customer/${customerId}/edit-transaction/${tx.id}`))}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "text-sm font-semibold rounded-md px-2 py-0.5 inline-block",
                          tx.type === 'udhaar' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                        )}>
                          {tx.type === 'udhaar' ? t('gave') : t('got')}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-800">
                        {tx.note || tx.productName || 'No Note'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(tx.date), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <div className="text-right">
                       <p className={cn(
                          "font-bold",
                          tx.type === 'udhaar' ? "text-red-500" : "text-green-600"
                        )}>
                          {formatCurrency(tx.amount)}
                       </p>
                       {tx.dueDate && (
                         <p className="text-[10px] text-gray-500 mt-1 font-medium bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 inline-block">
                           {t('dueText')} {format(new Date(tx.dueDate), 'dd MMM yyyy')}
                         </p>
                       )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="mt-6 mb-2">
            <AdBanner />
          </div>
        </div>
      </div>
    </div>
  );
}
