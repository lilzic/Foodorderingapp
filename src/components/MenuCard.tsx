import { MenuItem } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Plus, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { addToFavorites, removeFromFavorites, getFavorites } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  isAuthenticated: boolean;
}

export function MenuCard({ item, onAddToCart, isAuthenticated }: MenuCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkIfFavorite();
  }, [item.id]);

  const checkIfFavorite = async () => {
    if (!isAuthenticated) return;
    try {
      const favorites = await getFavorites();
      setIsFavorite(favorites.includes(item.id));
    } catch (error) {
      // Silently fail
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add favorites');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(item.id);
        setIsFavorite(false);
        toast.success('Removed from favorites');
      } else {
        await addToFavorites(item.id);
        setIsFavorite(true);
        toast.success('Added to favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString()}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 w-full">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleToggleFavorite}
          disabled={loading}
          className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite
                ? 'fill-red-500 text-red-500'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="mb-2 dark:text-white text-lg font-medium">{item.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-green-600 dark:text-green-400 font-medium">{formatPrice(item.price)}</span>
          <Button
            onClick={() => onAddToCart(item)}
            size="sm"
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}