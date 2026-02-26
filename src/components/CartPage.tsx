import { CartItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plus, Minus, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

export function CartPage({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onContinueShopping,
  onCheckout,
}: CartPageProps) {
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center">
          <h2 className="mb-4 text-gray-900 dark:text-white">Your Cart is Empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Add some delicious items to your cart!</p>
          <Button onClick={onContinueShopping} className="bg-orange-500 hover:bg-orange-600 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-gray-900 dark:text-white">Your Cart</h2>
        <Button
          onClick={onContinueShopping}
          variant="outline"
          size="sm"
          className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
      </div>

      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-24 h-48 sm:h-24 flex-shrink-0 rounded-md overflow-hidden mx-auto sm:mx-0">
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-gray-900 dark:text-white">{item.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{formatPrice(item.price)}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1">
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  </button>
                  <span className="w-8 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    <Plus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  </button>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-gray-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 text-gray-900 dark:text-white">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between mb-6 border-t dark:border-gray-700 pt-4 text-gray-900 dark:text-white">
          <span>Total</span>
          <span className="text-green-600 dark:text-green-400">{formatPrice(subtotal)}</span>
        </div>
        <Button
          onClick={onCheckout}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}