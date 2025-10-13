# Testing Documentation

## Overview

The Belgrade Mama Marketplace includes comprehensive test coverage for both backend and frontend, with a focus on the orders and payments functionality.

## Test Structure

```
apps/
├── api/
│   ├── src/__tests__/
│   │   ├── orders.test.ts                    # Unit tests for orders API
│   │   └── orders.integration.test.ts        # Integration tests for order flow
│   ├── jest.config.js                        # Jest configuration
│   └── package.json                          # Test scripts
│
└── web/
    ├── src/
    │   ├── pages/__tests__/
    │   │   ├── Checkout.test.tsx            # Tests for Checkout component
    │   │   └── Orders.test.tsx              # Tests for Orders component
    │   └── test/
    │       └── setup.ts                     # Test setup and configuration
    ├── vitest.config.ts                     # Vitest configuration
    └── package.json                         # Test scripts
```

## Backend Tests (Jest + Supertest)

### Setup

The backend uses Jest with ts-jest for TypeScript support and Supertest for HTTP testing.

**Configuration:** `apps/api/jest.config.js`

### Running Backend Tests

```bash
# Run all tests
cd apps/api
pnpm test

# Run in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

### Orders API Tests

**File:** `apps/api/src/__tests__/orders.test.ts`

**Coverage:**

1. **Order Creation (`POST /orders`)**
   - ✅ Create order successfully with card payment
   - ✅ Store full card number in database
   - ✅ Extract and store last 4 digits
   - ✅ Reject order if listing not found
   - ✅ Prevent self-purchase
   - ✅ Validate required fields
   - ✅ Handle cash payment without card number
   - ✅ Handle bank transfer payment

2. **Get Purchases (`GET /orders/my-purchases`)**
   - ✅ Return user's purchases with payment info
   - ✅ Include listing and seller information
   - ✅ Display card last 4 digits
   - ✅ Sort by creation date (newest first)

3. **Get Sales (`GET /orders/my-sales`)**
   - ✅ Return user's sales with payment info
   - ✅ Include listing and buyer information
   - ✅ Show buyer contact details

4. **Get Single Order (`GET /orders/:id`)**
   - ✅ Return order details for buyer
   - ✅ Return order details for seller
   - ✅ Return 404 if order not found
   - ✅ Return 403 if user is neither buyer nor seller

5. **Update Order Status (`PATCH /orders/:id/status`)**
   - ✅ Update status as seller
   - ✅ Reject if user is not the seller
   - ✅ Set completedAt timestamp when completed
   - ✅ Allow status transitions through workflow

### Integration Tests

**File:** `apps/api/src/__tests__/orders.integration.test.ts`

**Coverage:**

1. **Order Workflow**
   - ✅ Complete lifecycle: PENDING → CONFIRMED → IN_DELIVERY → COMPLETED
   - ✅ Card payment flow with number storage
   - ✅ Cash payment flow
   - ✅ Bank transfer flow

2. **Card Number Handling**
   - ✅ Store full 16-digit card number (DEMO mode)
   - ✅ Extract last 4 digits for display
   - ✅ Mask card numbers in responses (future)

3. **Security & Access Control**
   - ✅ Restrict order access to buyer and seller
   - ✅ Only seller can update order status
   - ✅ Validate permissions for all actions

4. **Data Validation**
   - ✅ Email format validation
   - ✅ Phone number format validation
   - ✅ UUID format validation
   - ✅ Required field validation

## Frontend Tests (Vitest + React Testing Library)

### Setup

The frontend uses Vitest with React Testing Library for component testing.

**Configuration:** `apps/web/vitest.config.ts`

### Running Frontend Tests

```bash
# Run all tests
cd apps/web
pnpm test

# Run with UI
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### Checkout Component Tests

**File:** `apps/web/src/pages/__tests__/Checkout.test.tsx`

**Coverage:**

1. **Rendering**
   - ✅ Display checkout form with listing details
   - ✅ Pre-fill buyer information from user data
   - ✅ Show order summary with price

2. **Payment Methods**
   - ✅ Display all payment method options
   - ✅ Show card number input when CARD selected
   - ✅ Hide card number input when CASH selected
   - ✅ Switch between payment methods

3. **Card Number Input**
   - ✅ Format input (remove non-digits)
   - ✅ Limit to 16 digits
   - ✅ Validate required for card payments
   - ✅ Optional for other payment methods

4. **Form Validation**
   - ✅ Require buyer name
   - ✅ Require buyer phone
   - ✅ Validate email format
   - ✅ Show validation errors

5. **Order Submission**
   - ✅ Submit order with card number
   - ✅ Send correct data to API
   - ✅ Show success message
   - ✅ Handle API errors gracefully

6. **Security**
   - ✅ Prevent buying own listing
   - ✅ Redirect if not authenticated
   - ✅ Validate listing exists

### Orders Component Tests

**File:** `apps/web/src/pages/__tests__/Orders.test.tsx`

**Coverage:**

1. **Rendering**
   - ✅ Display tabs for purchases and sales
   - ✅ Show order count in tabs
   - ✅ Render orders list

2. **Purchases Tab**
   - ✅ Display user's purchases
   - ✅ Show listing details
   - ✅ Display seller information
   - ✅ Show card last 4 digits
   - ✅ Empty state when no purchases

3. **Sales Tab**
   - ✅ Display user's sales
   - ✅ Show listing details
   - ✅ Display buyer information
   - ✅ Show buyer contact details
   - ✅ Empty state when no sales

4. **Order Status**
   - ✅ Display status with correct colors
   - ✅ Show pending, confirmed, in_delivery, completed
   - ✅ Handle cancelled orders

5. **Seller Actions**
   - ✅ Show action buttons for seller
   - ✅ Confirm order button
   - ✅ Mark as in delivery
   - ✅ Mark as completed
   - ✅ Cancel order button
   - ✅ Update order status via API

6. **Payment Display**
   - ✅ Show payment method (Card/Cash/Transfer)
   - ✅ Display card last 4 digits
   - ✅ Hide card number for other methods

7. **Delivery Information**
   - ✅ Display delivery address if provided
   - ✅ Show delivery district
   - ✅ Display order notes

8. **Error Handling**
   - ✅ Handle API errors
   - ✅ Show error messages
   - ✅ Graceful degradation

## Test Coverage Goals

### Backend
- **Target:** 80%+ coverage
- **Critical paths:** 100% coverage for order creation and payment handling
- **Focus areas:**
  - Order creation with card number storage
  - Payment method handling
  - Access control and permissions
  - Status transitions

### Frontend
- **Target:** 75%+ coverage
- **Critical paths:** 100% coverage for checkout flow
- **Focus areas:**
  - Card number input and validation
  - Form submission
  - Order display and management
  - Error handling

## Running All Tests

From the project root:

```bash
# Backend tests
cd apps/api && pnpm test

# Frontend tests
cd apps/web && pnpm test

# Both with coverage
cd apps/api && pnpm test:coverage
cd apps/web && pnpm test:coverage
```

## Continuous Integration

Tests should be run in CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Run Backend Tests
  run: |
    cd apps/api
    pnpm test:coverage

- name: Run Frontend Tests
  run: |
    cd apps/web
    pnpm test:coverage
```

## Test Data

### Mock Users
- **Buyer:** `user-123` (John Doe)
- **Seller:** `seller-456` (Seller User)

### Mock Cards
- **Valid Card:** `1234567890123456` (last 4: 3456)
- **Test Cards:** Use any 16-digit number in tests

### Mock Orders
- **Order 1:** Completed purchase (5000 RSD, Card payment)
- **Order 2:** Pending sale (3000 RSD, Cash payment)

## Security Testing Notes

### Card Number Storage
⚠️ **Important:** Current tests validate card number storage for DEMO purposes.

**Production recommendations:**
1. Never store full card numbers
2. Use payment gateway tokenization
3. Store only:
   - Last 4 digits
   - Payment gateway token
   - Transaction ID

### Test Updates for Production
When implementing payment gateway:

```typescript
// Update tests to validate token storage instead
expect(payment).toHaveProperty('gatewayToken');
expect(payment).toHaveProperty('cardLastFour', '3456');
expect(payment).not.toHaveProperty('cardNumber');
```

## Common Issues

### Jest/Vitest Module Errors
```bash
# Clear cache
pnpm test --clearCache
```

### Import Errors
```bash
# Regenerate node_modules
rm -rf node_modules
pnpm install
```

### Type Errors
```bash
# Check TypeScript
pnpm typecheck
```

## Best Practices

1. **Write tests first** for critical features
2. **Mock external dependencies** (API calls, auth)
3. **Test user interactions** not implementation details
4. **Use descriptive test names** that explain what's being tested
5. **Keep tests isolated** - each test should be independent
6. **Test error cases** as thoroughly as success cases
7. **Maintain test data** separate from production data

## Future Improvements

- [ ] Add E2E tests with Playwright/Cypress
- [ ] Add visual regression tests
- [ ] Add performance tests
- [ ] Add accessibility tests
- [ ] Increase coverage to 90%+
- [ ] Add mutation testing
- [ ] Add contract testing for API

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest Documentation](https://github.com/visionmedia/supertest)

## Support

For testing questions:
1. Check this documentation
2. Review existing test files
3. Open a GitHub issue
