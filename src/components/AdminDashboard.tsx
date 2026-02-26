import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Settings, Bell, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { getAdminOrders, updateOrderStatus } from '../utils/api';
import { toast } from 'sonner@2.0.3';
import { AdminSettings } from './AdminSettings';
import { getCurrentUser } from '../utils/auth';

interface AdminOrder {
  orderId: string;
  orderNumber: string;
  userEmail: string;
  items: any[];
  total: number;
  status: string;
  createdAt: string;
  paymentMethod: any;
}

interface AdminDashboardProps {
  onBack: () => void;
}

export function AdminDashboard({ onBack }: AdminDashboardProps) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'orders' | 'settings'>('orders');
  const [accessToken, setAccessToken] = useState('');
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [prevOrderCount, setPrevOrderCount] = useState(0);

  useEffect(() => {
    loadAccessToken();
    loadOrders();
    // Refresh orders every 30 seconds and check for new orders
    const interval = setInterval(() => {
      loadOrders(true);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAccessToken = async () => {
    const user = await getCurrentUser();
    if (user?.accessToken) {
      setAccessToken(user.accessToken);
    }
  };

  const loadOrders = async (checkForNew = false) => {
    try {
      const { orders } = await getAdminOrders();
      setOrders(orders);
      
      // Check for new orders
      if (checkForNew && prevOrderCount > 0 && orders.length > prevOrderCount) {
        const newCount = orders.length - prevOrderCount;
        setNewOrdersCount(newCount);
        toast.success(`🔔 ${newCount} new order${newCount > 1 ? 's' : ''} received!`, {
          duration: 5000,
        });
        // Play notification sound (optional)
        if (typeof Audio !== 'undefined') {
          try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dyvmwh');
            audio.play().catch(() => {});
          } catch (e) {}
        }
      }
      setPrevOrderCount(orders.length);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      loadOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <Button onClick={onBack} variant="outline" size="sm" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 w-full sm:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h2 className="text-gray-900 dark:text-white">Admin Dashboard</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setActiveTab('orders')}
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            className={`flex-1 sm:flex-initial ${activeTab === 'orders' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            <Package className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Orders</span>
            {newOrdersCount > 0 && (
              <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {newOrdersCount}
              </span>
            )}
          </Button>
          <Button
            onClick={() => setActiveTab('settings')}
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            className={`flex-1 sm:flex-initial ${activeTab === 'settings' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            <Settings className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Settings</span>
          </Button>
        </div>
      </div>

      {activeTab === 'settings' ? (
        <AdminSettings accessToken={accessToken} />
      ) : (
        <>
          {/* Notification Banner */}
          {newOrdersCount > 0 && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
              <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-200">
                {newOrdersCount} new order{newOrdersCount > 1 ? 's' : ''} received!
              </p>
              <button
                onClick={() => setNewOrdersCount(0)}
                className="ml-auto text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Filter Buttons */}
          <div className="mb-6 flex gap-2 flex-wrap">
            <Button
              onClick={() => setFilter('all')}
              variant={filter === 'all' ? 'default' : 'outline'}
              className={filter === 'all' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}
            >
              All Orders ({orders.length})
            </Button>
            <Button
              onClick={() => setFilter('pending')}
              variant={filter === 'pending' ? 'default' : 'outline'}
              className={filter === 'pending' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}
            >
              Pending ({orders.filter(o => o.status === 'pending').length})
            </Button>
            <Button
              onClick={() => setFilter('completed')}
              variant={filter === 'completed' ? 'default' : 'outline'}
              className={filter === 'completed' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}
            >
              Completed ({orders.filter(o => o.status === 'completed').length})
            </Button>
          </div>
        </>
      )}

      {/* Orders List */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(order.status)}
                    <h3>Order #{order.orderNumber}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Customer: {order.userEmail}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Date: {new Date(order.createdAt).toLocaleDateString('en-NG', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-orange-600 mb-2">
                    ₦{order.total.toLocaleString()}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : order.status === 'completed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-4 mb-4">
                <h4 className="mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.name} x {item.quantity}
                      </span>
                      <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {order.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleUpdateStatus(order.orderId, 'completed')}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                  <Button
                    onClick={() => handleUpdateStatus(order.orderId, 'cancelled')}
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel Order
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
        </div>
      )}
    </div>
  );
}