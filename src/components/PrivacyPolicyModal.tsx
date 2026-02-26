import { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { Button } from './ui/button';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export function PrivacyPolicyModal({ isOpen, onAccept }: PrivacyPolicyModalProps) {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-orange-600" />
            <h2 className="text-gray-900 dark:text-white">Privacy Policy & Terms of Service</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-gray-900 dark:text-white mb-3">Welcome to Sacy's Kitchen</h3>
            <p className="text-gray-700 dark:text-gray-300">
              By using our food ordering app, you agree to the following terms and conditions. 
              Please read them carefully before proceeding.
            </p>
          </section>

          <section>
            <h3 className="text-gray-900 dark:text-white mb-3">1. Information We Collect</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Personal information (name, email address) for account creation</li>
              <li>Order history and preferences</li>
              <li>Payment information (processed securely)</li>
              <li>Delivery addresses and contact details</li>
            </ul>
          </section>

          <section>
            <h3 className="text-gray-900 dark:text-white mb-3">2. How We Use Your Information</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Process and fulfill your food orders</li>
              <li>Send order confirmations and updates</li>
              <li>Improve our services and menu offerings</li>
              <li>Communicate promotional offers (you can opt-out anytime)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-gray-900 dark:text-white mb-3">3. Data Security</h3>
            <p className="text-gray-700 dark:text-gray-300">
              We implement industry-standard encryption and security measures to protect your 
              personal and payment information. All transactions are encrypted using secure protocols.
            </p>
          </section>

          <section>
            <h3 className="text-gray-900 dark:text-white mb-3">4. Payment Terms</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>All payments must be verified before order processing</li>
              <li>We accept credit card and bank transfer payments</li>
              <li>Payment confirmation is required before generating receipts</li>
              <li>Refunds are processed according to our refund policy</li>
            </ul>
          </section>

          <section>
            <h3 className="text-gray-900 dark:text-white mb-3">5. Order Policy</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Orders are subject to availability</li>
              <li>Preparation times may vary based on order volume</li>
              <li>We reserve the right to refuse service for any reason</li>
            </ul>
          </section>

          <section>
            <h3 className="text-gray-900 dark:text-white mb-3">6. Cookies and Tracking</h3>
            <p className="text-gray-700 dark:text-gray-300">
              We use cookies and local storage to enhance your experience, remember your 
              preferences, and maintain your session.
            </p>
          </section>

          <section>
            <h3 className="text-gray-900 dark:text-white mb-3">7. Your Rights</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
              <li>Access your personal data</li>
              <li>Request data correction or deletion</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h3 className="text-gray-900 dark:text-white mb-3">8. Contact Us</h3>
            <p className="text-gray-700 dark:text-gray-300">
              For questions about this privacy policy or your data, please contact us at 
              privacy@sacyskitchen.com
            </p>
          </section>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
              <span className="text-gray-700 dark:text-gray-300">
                I have read and agree to the Privacy Policy and Terms of Service. 
                I understand that my information will be used to process orders and improve services.
              </span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-6">
          <Button
            onClick={onAccept}
            disabled={!accepted}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {accepted ? 'Accept & Continue' : 'Please accept to continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
