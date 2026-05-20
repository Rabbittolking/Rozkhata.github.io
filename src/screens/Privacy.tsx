import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Privacy() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-blue-700 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Privacy Policy</h1>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 text-gray-700">
          <h2 className="text-lg font-bold text-gray-900">1. Information Collection</h2>
          <p>RozKhata respects your privacy. We collect minimal information required to run the application effectively. The core accounting data (customers, transactions, products) is stored locally on your device using IndexedDB.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-6">2. Third-Party Services</h2>
          <p>We use third-party services like Google AdMob to display advertisements. AdMob may collect and use data (such as device ID, location, and usage behavior) to provide personalized ads.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-6">3. Data Security</h2>
          <p>Because your business data stays on your device, its security largely depends on your device security. We provide manual backup options to help you secure and migrate your data safely.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-6">4. Contact Permissions</h2>
          <p>If you use the 'Import Contact' feature, the app securely accesses your contact list to help you quickly add customers. This data is not uploaded or shared with any external servers.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-6">5. Changes to This Policy</h2>
          <p>We may update our Privacy Policy periodically. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
        </div>
      </div>
    </div>
  );
}
