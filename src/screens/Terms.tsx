import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Terms() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Terms & Conditions</h1>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 text-gray-700">
          <h2 className="text-lg font-bold text-gray-900">1. Acceptance of Terms</h2>
          <p>By accessing and using RozKhata, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-6">2. Use of Application</h2>
          <p>You agree to use this application for lawful business and personal accounting purposes only. You are responsible for all data entered and maintained through the application.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-6">3. Data Privacy</h2>
          <p>Your data is stored locally on your device. We do not transmit your transaction records to our servers except for backup features explicitly initiated by you.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-6">4. Modifications</h2>
          <p>We reserve the right to modify these terms at any time. Your continued use of the app constitutes an agreement to the revised terms.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-6">5. Limitation of Liability</h2>
          <p>RozKhata is provided "as is" without any warranties. We shall not be liable for any data loss, financial miscalculation, or business damages resulting from the use of this app.</p>
        </div>
      </div>
    </div>
  );
}
