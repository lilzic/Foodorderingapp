import { Order } from "../types";
import { CheckCircle, Printer, Home } from "lucide-react";
import { Button } from "./ui/button";

interface ReceiptPageProps {
  order: Order;
  onBackToHome: () => void;
}

export function ReceiptPage({
  order,
  onBackToHome,
}: ReceiptPageProps) {
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8 print:mb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="mb-2">Payment Successful!</h2>
        <p className="text-gray-600">
          Your order has been confirmed
        </p>
      </div>

      {/* Receipt */}
      <div
        className="bg-white rounded-lg shadow-lg p-4 sm:p-8 print:shadow-none"
        id="receipt"
      >
        <div className="text-center border-b pb-4 mb-4">
          <h1 className="mb-2">Sacy's Kitchen</h1>
          <p className="text-gray-600">Nigerian Cuisine</p>
          <p className="text-gray-600">
            North Eastern University, Gombe
          </p>
        </div>

        <div className="mb-6 text-sm sm:text-base">
          <div className="flex justify-between mb-2 gap-4">
            <span className="text-gray-600">Order Number:</span>
            <span>{order.orderNumber}</span>
          </div>
          <div className="flex justify-between mb-2 gap-4">
            <span className="text-gray-600">Date:</span>
            <span className="text-right">{formatDate(order.timestamp)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-gray-600">
              Payment Method:
            </span>
            <span className="capitalize text-right">
              Bank Transfer
            </span>
          </div>
        </div>

        <div className="border-t border-b py-4 mb-4">
          <h3 className="mb-4">Order Items</h3>
          <div className="space-y-3 text-sm sm:text-base">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-2"
              >
                <div className="flex-1">
                  <p>{item.name}</p>
                  <p className="text-gray-600">
                    {formatPrice(item.price)} x {item.quantity}
                  </p>
                </div>
                <span className="text-right">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-6 text-sm sm:text-base">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatPrice(order.total)}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span>Total:</span>
            <span className="text-green-600">
              {formatPrice(order.total)}
            </span>
          </div>
        </div>

        <div className="text-center border-t pt-6">
          <p className="text-gray-600">
            Thanks for your patronage
          </p>
          <p className="text-gray-500 mt-2">
            We hope to see you again!
          </p>
          <p className="text-gray-500 mt-2">
            Delivery will be by 5pm!
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6 print:hidden">
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex-1"
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Receipt
        </Button>
        <Button
          onClick={onBackToHome}
          className="flex-1 bg-orange-500 hover:bg-orange-600"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
}