import { useState, useEffect } from "react";
import { CartItem, PaymentMethod } from "../types";
import {
  Building2,
  ArrowLeft,
  Loader2,
  Lock,
  Copy,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { encryptData, hashData } from "../utils/encryption";
import { toast } from "sonner";
import {
  projectId,
  publicAnonKey,
} from "../utils/supabase/info";

interface CheckoutPageProps {
  cart: CartItem[];
  onBack: () => void;
  onPaymentComplete: (paymentMethod: PaymentMethod) => void;
}

export function CheckoutPage({
  cart,
  onBack,
  onPaymentComplete,
}: CheckoutPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] =
    useState(false);
  const [copied, setCopied] = useState(false);

  // Bank Account fields
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");

  // Payment account details from admin
  const [paymentDetails, setPaymentDetails] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    bankName2: "",
    accountName2: "",
    accountNumber2: "",
  });

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
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        setPaymentDetails(data.details);
      }
    } catch (error) {
      console.error("Error loading payment details:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handlePayment = async () => {
    if (!paymentConfirmed) {
      toast.error(
        "Please confirm that you have completed the payment",
      );
      return;
    }

    // Validate fields
    if (!accountNumber || !accountName || !bankName) {
      toast.error("Please fill in all bank account fields");
      return;
    }

    setIsProcessing(true);

    // Simulate payment verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const paymentMethod: PaymentMethod = {
      type: "bank-account",
      accountNumber,
      accountName,
      bankName,
    };

    setIsProcessing(false);
    toast.success("Payment verified successfully!");
    onPaymentComplete(paymentMethod);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
        <h2 className="text-gray-900 dark:text-white">
          Checkout
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Order Summary */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <h3 className="mb-4 text-gray-900 dark:text-white">
              Order Summary
            </h3>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-2"
                >
                  <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-gray-900 dark:text-white text-sm sm:text-base">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t dark:border-gray-700 pt-4 flex justify-between">
              <span className="text-gray-900 dark:text-white">
                Total
              </span>
              <span className="text-green-600 dark:text-green-400">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="mb-4 text-gray-900 dark:text-white">
              Payment Method
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-orange-500" />
                <span className="text-gray-900 dark:text-white">Bank Transfer</span>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg mb-4 border border-orange-200 dark:border-orange-800">
                <p className="text-sm mb-3 text-orange-900 dark:text-orange-100">
                  🏦 Transfer to any of our accounts:
                </p>
                
                {/* First Bank Account */}
                <div className="space-y-2 mb-4 pb-4 border-b border-orange-200 dark:border-orange-700">
                  <p className="text-xs text-orange-800 dark:text-orange-200 mb-2">Account 1:</p>
                  <div className="flex items-center justify-between">
                    <p className="text-orange-900 dark:text-orange-100">
                      <strong>Bank:</strong>{" "}
                      {paymentDetails.bankName || "Moniepoint microfinance bank"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-orange-900 dark:text-orange-100">
                      <strong>Account Name:</strong>{" "}
                      {paymentDetails.accountName || "Serah Joseph"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-orange-900 dark:text-orange-100">
                      <strong>Account Number:</strong>{" "}
                      {paymentDetails.accountNumber || "9166121362"}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          paymentDetails.accountNumber || "9166121362",
                        )
                      }
                      className="text-orange-600 hover:text-orange-700"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Second Bank Account */}
                <div className="space-y-2">
                  <p className="text-xs text-orange-800 dark:text-orange-200 mb-2">Account 2:</p>
                  <div className="flex items-center justify-between">
                    <p className="text-orange-900 dark:text-orange-100">
                      <strong>Bank:</strong>{" "}
                      {paymentDetails.bankName2 || "Opay"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-orange-900 dark:text-orange-100">
                      <strong>Account Name:</strong>{" "}
                      {paymentDetails.accountName2 || "Serah Joseph"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-orange-900 dark:text-orange-100">
                      <strong>Account Number:</strong>{" "}
                      {paymentDetails.accountNumber2 || "9166121362"}
                    </p>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          paymentDetails.accountNumber2 || "9166121362",
                        )
                      }
                      className="text-orange-600 hover:text-orange-700"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-orange-900 dark:text-orange-100 mt-4 pt-4 border-t border-orange-200 dark:border-orange-700">
                  <strong>Amount:</strong>{" "}
                  {formatPrice(total)}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  ℹ️ After completing the bank transfer, enter
                  your account details below for verification.
                </p>
              </div>

              <div>
                <Label htmlFor="accountNumber">
                  Your Account Number: Must be account used to transfer the money (for verification)
                </Label>
                <Input
                  id="accountNumber"
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10),
                    )
                  }
                  maxLength={10}
                />
              </div>

              <div>
                <Label htmlFor="accountName">
                  Account Name
                </Label>
                <Input
                  id="accountName"
                  placeholder="John Doe"
                  value={accountName}
                  onChange={(e) =>
                    setAccountName(e.target.value)
                  }
                />
              </div>

              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="First Bank"
                  value={bankName}
                  onChange={(e) =>
                    setBankName(e.target.value)
                  }
                />
              </div>

              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-orange-500 dark:hover:border-orange-500">
                <input
                  type="checkbox"
                  checked={paymentConfirmed}
                  onChange={(e) =>
                    setPaymentConfirmed(e.target.checked)
                  }
                  className="mt-1 w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  I confirm that I have completed the bank
                  transfer to the account details shown above
                </span>
              </label>

              <Button
                onClick={handlePayment}
                className="w-full bg-orange-500 hover:bg-orange-600 mt-4"
                disabled={isProcessing || !paymentConfirmed}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Verify Payment & Complete Order
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}