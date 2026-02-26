# Sacy's Kitchen - Nigerian Food Ordering App

A comprehensive food ordering application featuring authentic Nigerian dishes with user authentication, favorites, admin dashboard, and secure transactions.

## Features

### 🔐 User Authentication
- **Account Creation**: Users can sign up with email, password, and name
- **Email Verification**: Verification emails sent upon registration
- **Password Security**: Minimum 6 characters required
- **Login/Logout**: Secure session management
- **Protected Routes**: Authentication required for checkout and favorites

### ❤️ Favorites System
- Save favorite menu items
- Quick access to saved items
- Add/remove from favorites with visual feedback
- Persistent storage per user account

### 🛒 Shopping Experience
- Browse menu items by category (Main Dishes, Add-ons, Drinks)
- Add items to cart with quantity management
- Real-time cart updates
- Checkout with payment verification

### 💳 Secure Payments
- **Two Payment Methods**:
  - Credit/Debit Card
  - Bank Transfer
- **Transaction Encryption**: Sensitive payment data is encrypted
- **Payment Verification**: Orders processed after payment confirmation
- **Receipt Generation**: Detailed receipt with order information

### 👨‍💼 Admin Dashboard
- View all customer orders
- Filter orders by status (pending, completed, cancelled)
- Update order status
- Real-time order notifications
- Customer information management

### 🌙 Dark Mode
- Toggle between light and dark themes
- Persistent theme preference
- Smooth transitions
- Complete UI coverage

### 🔒 Security Features
- **Password Encryption**: Secure password hashing
- **Transaction Encryption**: Payment data encrypted before transmission
- **Secure Sessions**: Token-based authentication
- **Protected API Endpoints**: Authorization required for sensitive operations

## Technology Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (Auth & Database)
- **Server**: Hono (Edge Functions)
- **Notifications**: Sonner Toast

## Getting Started

### Prerequisites
- Node.js installed
- Supabase account (already connected)

### Installation

1. The app is already set up and ready to use
2. Start adding items to your cart
3. Sign up for an account to access full features

### User Flow

1. **Browse Menu**: View all Nigerian dishes by category
2. **Add to Favorites**: Sign in and save your favorite items
3. **Add to Cart**: Select items and quantities
4. **Checkout**: Choose payment method and complete order
5. **Receipt**: View and print your order receipt

### Admin Access

To access the admin dashboard:
1. Sign in with an admin account
2. Click on your profile icon
3. Select "Admin Dashboard"
4. Manage orders and update statuses

## Features in Detail

### User Authentication Flow
```
Sign Up → Email Verification → Login → Access Protected Features
```

### Order Processing Flow
```
Cart → Checkout → Payment → Encryption → Order Saved → Receipt Generated
```

### Security Measures

1. **Password Requirements**: Minimum 6 characters
2. **Email Verification**: Must verify email before full access
3. **Payment Encryption**: All payment data encrypted
4. **Session Management**: Secure token-based sessions
5. **Admin Authorization**: Protected admin routes

## Menu Categories

### Main Dishes
- Jollof Rice
- Semo
- Pounded Yam
- Indomie
- Moi Moi
- Samosa

### Add-ons
- Fried Egg
- Egusi Soup
- Ogbono Soup
- Vegetable Soup
- Fried Meat
- Fried Chicken
- Coleslaw/Salad

### Payment Methods

1. **Credit/Debit Card**
   - Card number
   - Cardholder name
   - Expiry date
   - CVV

2. **Bank Transfer**
   - Account details provided
   - User confirms transfer
   - Payment verification

## Important Notes

⚠️ **Security Notice**: While this app implements encryption and security best practices, it is built on Figma Make which is not designed for collecting real PII or processing actual financial transactions. For production use with real customer data and payments, please migrate to a dedicated backend infrastructure.

## Support

For issues or questions:
- Check the user menu for help options
- Contact Sacy's Kitchen support

## License

© 2025 Sacy's Kitchen. All rights reserved.

---

🔒 **Secure transactions with encryption**
🌙 **Dark mode supported**
❤️ **Save your favorites**
👨‍💼 **Admin dashboard included**
