import { useState, useEffect } from 'react';
import { MenuItem, CartItem, Order, PaymentMethod } from './types';
import { menuItems } from './data/menuData';
import { MenuCard } from './components/MenuCard';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { ReceiptPage } from './components/ReceiptPage';
import { AuthModal } from './components/AuthModal';
import { FavoritesPage } from './components/FavoritesPage';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderHistory } from './components/OrderHistory';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { ShoppingCart, UtensilsCrossed, User, LogOut, Heart, Moon, Sun, ShieldCheck, History } from 'lucide-react';
import { Button } from './components/ui/button';
import { toast, Toaster } from 'sonner@2.0.3';
import { DarkModeProvider, useDarkMode } from './utils/DarkModeContext';
import { getCurrentUser, signOut, User as UserType } from './utils/auth';
import { createOrder } from './utils/api';

type Page = 'home' | 'cart' | 'checkout' | 'receipt' | 'favorites' | 'admin' | 'order-history';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'main' | 'addon' | 'drink'>('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const { darkMode, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    // Check if user has accepted privacy policy
    const accepted = localStorage.getItem('privacyAccepted');
    if (accepted === 'true') {
      setPrivacyAccepted(true);
    } else {
      setShowPrivacyModal(true);
    }
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handlePrivacyAccept = () => {
    localStorage.setItem('privacyAccepted', 'true');
    setPrivacyAccepted(true);
    setShowPrivacyModal(false);
    toast.success('Welcome to Sacy\'s Kitchen!');
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
    toast.success('Signed out successfully');
    setShowUserMenu(false);
    if (currentPage === 'favorites' || currentPage === 'admin' || currentPage === 'order-history') {
      setCurrentPage('home');
    }
  };

  const handleViewReceipt = (orderData: any) => {
    setOrder(orderData);
    setCurrentPage('receipt');
  };

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart!`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.success('Item removed from cart');
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      setShowAuthModal(true);
      return;
    }
    setCurrentPage('checkout');
  };

  const handlePaymentComplete = async (paymentMethod: PaymentMethod) => {
    const newOrder: Order = {
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      paymentMethod,
      timestamp: new Date(),
      orderNumber: `ORD-${Date.now().toString().slice(-8)}`,
    };

    try {
      // Save order to backend
      await createOrder(newOrder);
      setOrder(newOrder);
      setCart([]);
      setCurrentPage('receipt');
      toast.success('Payment verified successfully!');
    } catch (error) {
      toast.error('Failed to process order');
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setActiveCategory('all');
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Toaster position="top-right" />
      
      {/* App Bar */}
      <header className="bg-orange-500 dark:bg-orange-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <UtensilsCrossed className="w-8 h-8" />
              <h1 className="text-white">Sacy's Kitchen</h1>
            </button>
            
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-orange-600 dark:hover:bg-orange-700 rounded-lg transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Favorites */}
              {user && currentPage !== 'receipt' && (
                <Button
                  onClick={() => setCurrentPage('favorites')}
                  variant="secondary"
                  className="bg-white text-orange-500 hover:bg-gray-100"
                >
                  <Heart className="w-5 h-5" />
                  <span className="hidden sm:inline ml-2">Favorites</span>
                </Button>
              )}

              {/* Cart */}
              {currentPage !== 'receipt' && (
                <Button
                  onClick={() => setCurrentPage('cart')}
                  variant="secondary"
                  className="relative bg-white text-orange-500 hover:bg-gray-100"
                >
                  <ShoppingCart className="w-5 h-5 sm:mr-2" />
                  <span className="hidden sm:inline">Cart</span>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-white text-orange-500 hover:bg-gray-100 px-3 sm:px-4 py-2 rounded-lg"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => {
                          setCurrentPage('order-history');
                          setShowUserMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                      >
                        <History className="w-4 h-4" />
                        <span>Order History</span>
                      </button>
                      {user.isAdmin && (
                        <button
                          onClick={() => {
                            setCurrentPage('admin');
                            setShowUserMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  variant="secondary"
                  className="bg-white text-orange-500 hover:bg-gray-100"
                >
                  <User className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {currentPage === 'home' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h2 className="mb-4 dark:text-white">Welcome to Sacy's Kitchen</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Authentic Nigerian cuisine made with love</p>
              
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setActiveCategory('all')}
                  variant={activeCategory === 'all' ? 'default' : 'outline'}
                  className={activeCategory === 'all' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                >
                  All Items
                </Button>
                <Button
                  onClick={() => setActiveCategory('main')}
                  variant={activeCategory === 'main' ? 'default' : 'outline'}
                  className={activeCategory === 'main' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                >
                  Main Dishes
                </Button>
                <Button
                  onClick={() => setActiveCategory('addon')}
                  variant={activeCategory === 'addon' ? 'default' : 'outline'}
                  className={activeCategory === 'addon' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                >
                  Add-ons
                </Button>
                <Button
                  onClick={() => setActiveCategory('drink')}
                  variant={activeCategory === 'drink' ? 'default' : 'outline'}
                  className={activeCategory === 'drink' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                >
                  Drinks
                </Button>
              </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  onAddToCart={addToCart}
                  isAuthenticated={!!user}
                />
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No items found in this category</p>
              </div>
            )}
          </div>
        )}

        {currentPage === 'cart' && (
          <CartPage
            cart={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onContinueShopping={handleBackToHome}
            onCheckout={handleCheckout}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPage
            cart={cart}
            onBack={() => setCurrentPage('cart')}
            onPaymentComplete={handlePaymentComplete}
          />
        )}

        {currentPage === 'receipt' && order && (
          <ReceiptPage order={order} onBackToHome={handleBackToHome} />
        )}

        {currentPage === 'favorites' && (
          <FavoritesPage
            menuItems={menuItems}
            onAddToCart={addToCart}
            onBack={handleBackToHome}
          />
        )}

        {currentPage === 'admin' && (
          <>
            {user?.isAdmin ? (
              <AdminDashboard onBack={handleBackToHome} />
            ) : (
              <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center">
                  <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
                  <h2 className="mb-4 text-gray-900 dark:text-white">Access Denied</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    You don't have permission to access the admin dashboard.
                  </p>
                  <Button onClick={handleBackToHome} className="bg-orange-500 hover:bg-orange-600">
                    Back to Home
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {currentPage === 'order-history' && user && (
          <OrderHistory
            onBack={handleBackToHome}
            onViewReceipt={handleViewReceipt}
            accessToken={user.accessToken}
          />
        )}
      </main>

      <PrivacyPolicyModal 
        isOpen={showPrivacyModal}
        onAccept={handlePrivacyAccept}
      />

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={loadUser}
        onForgotPassword={() => {
          setShowAuthModal(false);
          setShowForgotPassword(true);
        }}
      />

      {/* Footer */}
      <footer className="bg-gray-800 dark:bg-gray-950 text-white mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 Sacy's Kitchen. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Bringing Nigerian flavors to your table</p>
          <p className="text-gray-500 text-sm mt-2">🔒 Secure transactions with encryption</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}