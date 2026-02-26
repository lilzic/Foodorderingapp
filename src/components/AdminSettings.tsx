import { useState, useEffect } from "react";
import { Save, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner@2.0.3";
import {
  projectId,
  publicAnonKey,
} from "../utils/supabase/info";

interface PaymentAccountDetails {
  bankName: string;
  accountName: string;
  accountNumber: string;
  bankName2: string;
  accountName2: string;
  accountNumber2: string;
}

interface AdminSettingsProps {
  accessToken: string;
}

export function AdminSettings({
  accessToken,
}: AdminSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<PaymentAccountDetails>(
    {
      bankName: "",
      accountName: "",
      accountNumber: "",
      bankName2: "",
      accountName2: "",
      accountNumber2: "",
    },
  );

  useEffect(() => {
    loadPaymentDetails();
  }, []);

  const loadPaymentDetails = async () => {
    try {
      const supabaseUrl = `https://${projectId}.supabase.co`;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/make-server-7817ccb1/payment-details`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.details) {
          setDetails(data.details);
        }
      }
    } catch (error) {
      console.error("Error loading payment details:", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabaseUrl = `https://${projectId}.supabase.co`;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/make-server-7817ccb1/payment-details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ details }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save payment details",
        );
      }

      toast.success("Payment details saved successfully!");
    } catch (error: any) {
      toast.error(
        error.message || "Failed to save payment details",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-gray-900 dark:text-white mb-6">
        Payment Account Settings
      </h2>

      <form onSubmit={handleSave} className="space-y-6">
        {/* First Bank Account */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-orange-600" />
            <h3 className="text-gray-900 dark:text-white">
              Bank Account 1
            </h3>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Bank Name
            </label>
            <input
              type="text"
              value={details.bankName}
              onChange={(e) =>
                setDetails({
                  ...details,
                  bankName: e.target.value,
                })
              }
              className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base"
              placeholder="e.g., Moniepoint microfinance bank"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Account Name
            </label>
            <input
              type="text"
              value={details.accountName}
              onChange={(e) =>
                setDetails({
                  ...details,
                  accountName: e.target.value,
                })
              }
              className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base"
              placeholder="e.g., Serah Joseph"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Account Number
            </label>
            <input
              type="text"
              value={details.accountNumber}
              onChange={(e) =>
                setDetails({
                  ...details,
                  accountNumber: e.target.value,
                })
              }
              className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base"
              placeholder="e.g., 9166121362"
            />
          </div>
        </div>

        {/* Second Bank Account */}
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-orange-600" />
            <h3 className="text-gray-900 dark:text-white">
              Bank Account 2
            </h3>
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Bank Name
            </label>
            <input
              type="text"
              value={details.bankName2}
              onChange={(e) =>
                setDetails({
                  ...details,
                  bankName2: e.target.value,
                })
              }
              className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base"
              placeholder="e.g., Opay"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Account Name
            </label>
            <input
              type="text"
              value={details.accountName2}
              onChange={(e) =>
                setDetails({
                  ...details,
                  accountName2: e.target.value,
                })
              }
              className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base"
              placeholder="e.g., Serah Joseph"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Account Number
            </label>
            <input
              type="text"
              value={details.accountNumber2}
              onChange={(e) =>
                setDetails({
                  ...details,
                  accountNumber2: e.target.value,
                })
              }
              className="w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm sm:text-base"
              placeholder="e.g., 9166121362"
            />
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 rounded-lg">
          <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
            💡 These bank account details will be shown to
            customers during checkout. Make sure they are
            accurate and up-to-date.
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          disabled={loading}
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Payment Details"}
        </Button>
      </form>
    </div>
  );
}