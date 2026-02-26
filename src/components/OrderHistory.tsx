import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Receipt, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Order {
  orderId: string;
  orderNumber: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
  paymentMethod: any;
}

interface OrderHistoryProps {
  onBack: () => void;
  onViewReceipt: (order: Order) => void;
  accessToken: string;
}

export function OrderHistory({ onBack, onViewReceipt, accessToken }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const supabaseUrl = `https://${projectId}.supabase.co`;
      const response = await fetch(
        `${supabaseUrl}/functions/v1/make-server-7817ccb1/orders`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to load orders');
      }

      const data = await response.json();
      // Sort orders by date (newest first)
      const sortedOrders = (data.orders || []).sort((a: Order, b: Order) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(sortedOrders);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <Package className="w-12 h-12 mx-auto mb-4 animate-pulse" />
          <p>Loading your order history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <Button onClick={onBack} variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h2 className="text-gray-900 dark:text-white">Order History</h2>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-gray-900 dark:text-white mb-2">No Orders Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't placed any orders. Start shopping to see your order history!
          </p>
          <Button onClick={onBack} className="bg-orange-500 hover:bg-orange-600 text-white">
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(order.status)}
                    <div>
                      <h3 className="text-gray-900 dark:text-white">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                    <p className="text-green-600 dark:text-green-400">{formatPrice(order.total)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                      variant="outline"
                      size="sm"
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {expandedOrder === order.orderId ? (
                        <>
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          View Details
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => onViewReceipt(order)}
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Receipt className="w-4 h-4 mr-2" />
                      View Receipt
                    </Button>
                  </div>
                </div>

                {expandedOrder === order.orderId && (
                  <div className="border-t dark:border-gray-700 pt-4 mt-4">
                    <h4 className="text-sm mb-3 text-gray-900 dark:text-white">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-700/50 rounded"
                        >
                          <div className="flex-1">
                            <p className="text-gray-900 dark:text-white">{item.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="text-gray-900 dark:text-white">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t dark:border-gray-700">
                      <h4 className="text-sm mb-2 text-gray-900 dark:text-white">Payment Method</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {order.paymentMethod?.type === 'credit-card' ? 'Credit Card' : 'Bank Transfer'}
                        {order.paymentMethod?.cardNumber && 
                          ` (****${order.paymentMethod.cardNumber})`
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}