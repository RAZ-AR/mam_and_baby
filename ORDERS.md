# Orders & Payments Feature

## Overview

The Belgrade Mama Marketplace now includes a complete order and payment management system that allows buyers to purchase items from listings and tracks the entire transaction lifecycle.

## Features Implemented

### 1. Database Schema

Added two new models to the Prisma schema:

**Order Model:**
- Tracks order details including buyer information, delivery address, and order status
- Links to buyer (User), seller (User), and listing
- Supports multiple order statuses: PENDING, CONFIRMED, IN_DELIVERY, COMPLETED, CANCELLED
- Stores buyer contact information for easy communication

**Payment Model:**
- Tracks payment information including amount, method, and status
- Supports three payment methods: CARD, CASH, BANK_TRANSFER
- **Stores card number** (both full number and last 4 digits)
- Payment statuses: PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED
- One-to-one relationship with Order

### 2. Backend API (`/apps/api/src/routes/orders.ts`)

**Endpoints:**

- `POST /orders` - Create a new order with payment information
  - Validates listing exists
  - Prevents self-purchase
  - Stores card number in database
  - Automatically extracts last 4 digits for display

- `GET /orders/my-purchases` - Get all orders where user is the buyer
  - Includes listing, payment, and seller information

- `GET /orders/my-sales` - Get all orders where user is the seller
  - Includes listing, payment, and buyer information

- `GET /orders/:id` - Get single order details
  - Access restricted to buyer or seller only

- `PATCH /orders/:id/status` - Update order status (seller only)
  - Allows seller to move order through workflow
  - Auto-sets completedAt timestamp when status is COMPLETED

- `PATCH /orders/:id/payment-status` - Update payment status (seller only)
  - Updates payment status and transaction ID
  - Auto-sets paidAt timestamp when status is COMPLETED

### 3. Frontend Pages

**Checkout Page (`/checkout/:listingId`):**
- Complete checkout form with buyer information
- Delivery address input (optional)
- Payment method selection (CARD, CASH, BANK_TRANSFER)
- **Card number input field** - stores full 16-digit card number
- Order summary with listing details
- Success confirmation screen

**Orders Page (`/orders`):**
- Tabbed interface: "My Purchases" and "My Sales"
- Full order history with filtering
- Status indicators with color coding
- Payment information including **last 4 digits of card**
- Contact information for buyer/seller
- Delivery details
- Seller actions to update order status
- Status workflow buttons (Confirm → In Delivery → Complete)

**Listing Detail Page:**
- Updated "Contact Seller" button to "Buy Now" button
- Links directly to checkout page

### 4. Navigation

Updated main navigation in Home.tsx to include:
- **📦 Orders** link in user menu
- Direct access to order management

## Card Number Storage

### Important: Security Consideration

⚠️ **The current implementation stores full card numbers in the database for demonstration purposes.**

**For Production:**
- **DO NOT** store full card numbers
- Integrate with a payment gateway (Stripe, PayPal, Square)
- Use tokenization for card data
- Store only last 4 digits and payment gateway tokens
- Ensure PCI DSS compliance

### Current Implementation

```typescript
// Payment model includes
cardNumber: String?       // Full card number (DEMO ONLY)
cardLastFour: String?     // Last 4 digits for display
```

**What gets stored:**
- During checkout, user enters 16-digit card number
- Backend extracts last 4 digits automatically
- Both full number and last 4 are stored in Payment table
- Frontend displays only last 4 digits in order history

**File: `/apps/api/src/routes/orders.ts:49-53`**
```typescript
const cardLastFour = data.payment.cardNumber
  ? data.payment.cardNumber.slice(-4)
  : undefined;
```

## Database Migration

To apply the new schema changes:

```bash
# Start PostgreSQL (if using Docker)
docker compose up -d

# Run migrations
cd apps/api
npx prisma migrate dev --name add_orders_and_payments

# Generate Prisma client
npx prisma generate
```

## Testing the Feature

1. **Create a listing** (as User A)
2. **Login as different user** (User B)
3. **Navigate to listing detail page**
4. **Click "Buy Now" button**
5. **Fill checkout form:**
   - Name, phone, email
   - Delivery address (optional)
   - Select payment method
   - **Enter card number** (e.g., 1234567890123456)
6. **Submit order**
7. **View order in "My Purchases" tab**
   - Check that card last 4 digits are displayed
8. **Login as seller (User A)**
9. **View order in "My Sales" tab**
   - Update order status through workflow
10. **Verify card number persisted** in database

## API Examples

### Create Order

```bash
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "listingId": "uuid-here",
  "buyerName": "John Doe",
  "buyerPhone": "+381123456789",
  "buyerEmail": "john@example.com",
  "deliveryAddress": "123 Main St, Apt 4",
  "deliveryDistrict": "Stari Grad",
  "notes": "Please call before delivery",
  "payment": {
    "method": "CARD",
    "cardNumber": "1234567890123456"
  }
}
```

**Response:**
```json
{
  "id": "order-uuid",
  "totalAmount": 5000,
  "status": "PENDING",
  "buyerName": "John Doe",
  "buyerPhone": "+381123456789",
  "payment": {
    "id": "payment-uuid",
    "amount": 5000,
    "method": "CARD",
    "status": "PENDING",
    "cardLastFour": "3456",
    "cardNumber": "1234567890123456"
  },
  ...
}
```

### Get My Purchases

```bash
GET /orders/my-purchases
Authorization: Bearer <token>
```

### Update Order Status

```bash
PATCH /orders/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

## Workflow

### Order Status Flow:
```
PENDING → CONFIRMED → IN_DELIVERY → COMPLETED
             ↓              ↓            ↓
          CANCELLED    CANCELLED    CANCELLED
```

### Payment Status Flow:
```
PENDING → PROCESSING → COMPLETED
             ↓              ↓
          FAILED        REFUNDED
```

## Files Modified/Created

### Backend:
- ✅ `apps/api/prisma/schema.prisma` - Added Order and Payment models
- ✅ `apps/api/src/routes/orders.ts` - New order routes
- ✅ `apps/api/src/index.ts` - Registered order routes

### Frontend:
- ✅ `apps/web/src/pages/Checkout.tsx` - New checkout page
- ✅ `apps/web/src/pages/Orders.tsx` - New orders management page
- ✅ `apps/web/src/pages/ListingDetail.tsx` - Updated with "Buy Now" button
- ✅ `apps/web/src/pages/Home.tsx` - Added orders link in navigation
- ✅ `apps/web/src/lib/api.ts` - Added Order/Payment types and ordersApi
- ✅ `apps/web/src/main.tsx` - Added new routes

### Documentation:
- ✅ `ORDERS.md` - This file

## Next Steps for Production

### Security Enhancements:
1. **Remove card number storage** from database
2. **Integrate payment gateway:**
   - Stripe: https://stripe.com/docs
   - PayPal: https://developer.paypal.com
   - Square: https://developer.squareup.com

3. **Update Payment model:**
```prisma
model Payment {
  // Remove: cardNumber String?
  // Add:
  paymentIntentId String?  // Stripe payment intent
  gatewayToken    String?  // Payment gateway token
}
```

4. **Implement secure payment flow:**
   - Client-side: Use Stripe.js or PayPal SDK
   - Collect payment method on frontend
   - Send token to backend (not card number)
   - Process payment via gateway
   - Store only transaction ID

### Additional Features:
- Email notifications for order updates
- SMS notifications for order status
- Order tracking page
- Refund functionality
- Order cancellation by buyer
- Dispute resolution system
- Order rating and reviews
- Invoice generation
- Multiple items per order (shopping cart)
- Shipping cost calculation
- Tax calculation
- Promotional codes/discounts

## Support

For questions about the orders feature:
1. Check this documentation
2. Review the code in `/apps/api/src/routes/orders.ts`
3. Open a GitHub issue

## License

MIT
