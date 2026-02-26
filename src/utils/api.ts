import { projectId, publicAnonKey } from './supabase/info.tsx';
import { getAccessToken } from './auth';
import { Order } from '../types';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7817ccb1`;

export const addToFavorites = async (itemId: string) => {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add to favorites');
    }

    return await response.json();
  } catch (error) {
    console.error('Add to favorites error:', error);
    throw error;
  }
};

export const removeFromFavorites = async (itemId: string) => {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/favorites/${itemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove from favorites');
    }

    return await response.json();
  } catch (error) {
    console.error('Remove from favorites error:', error);
    throw error;
  }
};

export const getFavorites = async (): Promise<string[]> => {
  try {
    const token = await getAccessToken();
    if (!token) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.favorites || [];
  } catch (error) {
    console.error('Get favorites error:', error);
    return [];
  }
};

export const createOrder = async (order: Order) => {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create order');
    }

    return await response.json();
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get orders');
    }

    return await response.json();
  } catch (error) {
    console.error('Get orders error:', error);
    throw error;
  }
};

// Admin functions
export const getAdminOrders = async () => {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get admin orders');
    }

    return await response.json();
  } catch (error) {
    console.error('Get admin orders error:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update order');
    }

    return await response.json();
  } catch (error) {
    console.error('Update order error:', error);
    throw error;
  }
};
