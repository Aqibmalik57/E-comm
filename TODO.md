# TODO: Update Order and Cart slices for API compatibility

## Task Summary

Update orderSlice.js and OrdersManagement.jsx to work properly with the backend APIs.

## Steps:

- [x] 1. Update orderSlice.js - Add counts and totalRevenue handling
- [x] 2. Update OrdersManagement.jsx - Fix status filter, add update/delete functionality
- [x] 3. Update CartSlice.js - Fix API endpoints

## Completed Changes:

### 1. orderSlice.js:

- Updated API endpoints to use correct paths (`/orders/checkout`, `/orders/invoice`, etc.)
- Added `counts` and `totalRevenue` to initial state
- Updated `getAllOrders` to accept optional filter params (status, sort)
- Updated `getAllOrders.fulfilled` to handle response with `counts` and `totalRevenue`
- Added counts recalculation in `updateOrderStatus.fulfilled` and `deleteOrder.fulfilled`

### 2. OrdersManagement.jsx:

- Fixed status filter values (now uses capitalized: "Pending", "Processing", "Shipped", "Delivered", "Cancelled")
- Added `updateOrderStatus` import and functionality
- Added `deleteOrder` import and functionality
- Added inline status update dropdown in table
- Added delete confirmation modal
- Updated stats section to use API response counts and totalRevenue
- Fixed order items to display `imageUrl` and `title` fields
- Added shipping method display in order details modal

### 3. CartSlice.js:

- Updated API endpoints:
  - `/cart` → `/cart/fetch-cart`
  - `/add/cart` → `/cart/add`
  - `/increase-quantity` → `/cart/increase-quantity`
  - `/decrease-quantity` → `/cart/decrease-quantity`
  - `/remove-item` → `/cart/remove-item`
  - `/apply-coupon` → `/cart/apply-coupon`
