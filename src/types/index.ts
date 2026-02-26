export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'main' | 'addon' | 'drink';
  image: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface PaymentMethod {
  type: 'bank-account';
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
}

export interface Order {
  items: CartItem[];
  total: number;
  paymentMethod: PaymentMethod;
  timestamp: Date;
  orderNumber: string;
}