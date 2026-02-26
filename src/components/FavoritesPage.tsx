import { useEffect, useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { MenuItem } from '../types';
import { getFavorites, removeFromFavorites } from '../utils/api';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';

interface FavoritesPageProps {
  menuItems: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
  onBack: () => void;
}

export function FavoritesPage({
  menuItems,
  onAddToCart,
  onBack,
}: FavoritesPageProps) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favorites = await getFavorites();
      setFavoriteIds(favorites);
    } catch (error) {
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (itemId: string) => {
    try {
      await removeFromFavorites(itemId);
      setFavoriteIds(favoriteIds.filter(id => id !== itemId));
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove from favorites');
    }
  };

  const favoriteItems = menuItems.filter(item => favoriteIds.includes(item.id));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading favorites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Button onClick={onBack} variant="outline" className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 w-full sm:w-auto">
          ← Back
        </Button>
        <h2 className="dark:text-white">My Favorites</h2>
      </div>

      {favoriteItems.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="mb-2 dark:text-white">No favorites yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start adding items to your favorites!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="dark:text-white">{item.name}</h3>
                  <button
                    onClick={() => handleRemoveFromFavorites(item.id)}
                    className="text-red-500 hover:text-red-600 flex-shrink-0"
                  >
                    <Heart className="w-5 h-5 fill-current" />
                  </button>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {item.description}
                </p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <span className="text-orange-600 dark:text-orange-400">
                    ₦{item.price.toLocaleString()}
                  </span>
                  <Button
                    onClick={() => {
                      onAddToCart(item);
                      onBack();
                    }}
                    className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}