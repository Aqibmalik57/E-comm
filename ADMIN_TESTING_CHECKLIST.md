# Admin Dashboard Testing Checklist

## Pre-Testing Setup

- [ ] Ensure backend API is running
- [ ] Login with admin credentials
- [ ] Clear browser cache/cookies if needed

## Navigation & Routing Tests

### Main Admin Route

- [ ] Navigate to `/admin` - Should show Dashboard Overview
- [ ] Verify URL is correct and no 404 errors
- [ ] Check that sidebar is visible on desktop
- [ ] Check that mobile menu button appears on small screens

### Sidebar Navigation

- [ ] Click "Dashboard" - Should navigate to `/admin`
- [ ] Click "Users" - Should navigate to `/admin/users`
- [ ] Click "Products" - Should navigate to `/admin/products`
- [ ] Click "Categories" - Should navigate to `/admin/categories`
- [ ] Click "Orders" - Should navigate to `/admin/orders`
- [ ] Click "Coupons" - Should navigate to `/admin/coupons`
- [ ] Click "Reviews" - Should navigate to `/admin/reviews`
- [ ] Click "Logout" - Should logout and redirect to home
- [ ] Verify active menu item is highlighted in sidebar
- [ ] Test sidebar collapse/expand on desktop

### Mobile Navigation

- [ ] Open on mobile device or resize browser to < 1024px
- [ ] Click hamburger menu - Sidebar should slide in
- [ ] Click outside sidebar - Should close
- [ ] Click menu item - Sidebar should close automatically

## Dashboard Overview Tests

### Statistics Cards

- [ ] Verify Total Users count matches actual users
- [ ] Verify Total Products count matches actual products
- [ ] Verify Total Orders count matches actual orders
- [ ] Verify Categories count matches actual categories
- [ ] Verify Active Coupons count matches actual coupons
- [ ] Check that cards are clickable and navigate to respective pages

### Quick Actions

- [ ] Click "Add New Product" - Should navigate to Products page
- [ ] Click "Add Category" - Should navigate to Categories page
- [ ] Click "Create Coupon" - Should navigate to Coupons page
- [ ] Click "Manage Users" - Should navigate to Users page

### Recent Activity

- [ ] Recent Orders section shows last 5 orders
- [ ] Order status badges display correctly (colors)
- [ ] "View All" link navigates to Orders page

### Top Products

- [ ] Shows up to 5 products
- [ ] Product images display correctly
- [ ] Stock numbers are accurate
- [ ] "View All" link navigates to Products page

## Users Management Tests

### List View

- [ ] Users table displays with all columns (User, Email, Role, Joined, Actions)
- [ ] User avatars show initials
- [ ] Role badges show correct colors (Admin=purple, User=green, Moderator=blue)
- [ ] Pagination works if > 10 users

### Search & Filter

- [ ] Search by name - Results filter correctly
- [ ] Search by email - Results filter correctly
- [ ] Search by ID - Results filter correctly
- [ ] Filter by role "All" - Shows all users
- [ ] Filter by role "Admin" - Shows only admins
- [ ] Filter by role "User" - Shows only users

### CRUD Operations

- [ ] Click "View Profile" (eye icon) - Navigates to user profile page
- [ ] Click "Edit Role" (shield icon) - Opens role modal
- [ ] In role modal: Change role and save - Updates successfully
- [ ] Click "Edit Profile" (edit icon) - Navigates to edit page
- [ ] Click "Delete" (trash icon) - Shows "Confirm" for 3 seconds
- [ ] Click "Confirm" - User is deleted and removed from list
- [ ] Export button downloads CSV file with user data

## Products Management Tests

### Grid View

- [ ] Products display in grid layout
- [ ] Product images show correctly
- [ ] Stock badges show correct colors (green>10, yellow<10, red=0)
- [ ] Price displays with $ symbol
- [ ] Rating stars display correctly

### Search & Filter

- [ ] Search by product name works
- [ ] Search by description works
- [ ] Filter by category shows correct products

### CRUD Operations

- [ ] Click "Add Product" button - Opens create modal
- [ ] Fill form: Name, Description, Price, Stock, Category
- [ ] Upload product images - Preview shows correctly
- [ ] Submit form - Product created and appears in grid
- [ ] Click "Edit" on product - Opens edit modal with pre-filled data
- [ ] Modify data and save - Product updates correctly
- [ ] Click "Delete" - Shows confirmation
- [ ] Confirm delete - Product removed from grid

## Categories Management Tests

### Grid View

- [ ] Categories display with gradient headers
- [ ] Category images show (or default folder icon)
- [ ] Product count displays correctly
- [ ] Created date shows correctly

### CRUD Operations

- [ ] Click "Add Category" - Opens create modal
- [ ] Fill: Name, Description, Image URL
- [ ] Submit - Category created and appears in grid
- [ ] Click "Edit" - Opens edit modal with pre-filled data
- [ ] Modify and save - Updates correctly
- [ ] Click "Delete" - Shows confirmation
- [ ] Confirm - Category removed

## Orders Management Tests

### List View

- [ ] Orders table displays with correct columns
- [ ] Order ID shows last 8 characters in uppercase
- [ ] Customer name and email display
- [ ] Date formats correctly
- [ ] Total shows with $ symbol
- [ ] Status badges show correct colors

### Search & Filter

- [ ] Search by order ID works
- [ ] Search by customer name works
- [ ] Search by customer email works
- [ ] Filter by status shows correct orders

### Order Details Modal

- [ ] Click "View Details" (eye icon) - Opens modal
- [ ] Customer information section shows all details
- [ ] Order items list shows products with images
- [ ] Price calculations are correct (subtotal, shipping, tax, total)
- [ ] Payment method and status show correctly
- [ ] Click "Download Invoice" - Triggers download
- [ ] Click "Close" - Modal closes

### Statistics Cards

- [ ] Total Orders count is correct
- [ ] Pending count is correct
- [ ] Delivered count is correct
- [ ] Revenue calculation is correct

## Coupons Management Tests

### Card View

- [ ] Coupons display as cards with header color indicating active/inactive
- [ ] "Active" or "Inactive" badge shows correctly
- [ ] Discount value shows with % or $ symbol
- [ ] Max Discount and Min Purchase show correctly
- [ ] Usage count shows (used / limit)
- [ ] Date range displays correctly

### CRUD Operations

- [ ] Click "Create Coupon" - Opens modal
- [ ] Fill: Code, Discount Type, Value, Min Purchase, Max Discount
- [ ] Set Start Date and Expire Date
- [ ] Set Usage Limit
- [ ] Add Description
- [ ] Submit - Coupon created and appears in list
- [ ] Click "Copy" - Code copied to clipboard (shows "Copied" temporarily)
- [ ] Click "Edit" - Opens edit modal
- [ ] Modify and save - Updates correctly
- [ ] Click "Delete" - Shows confirmation
- [ ] Confirm - Coupon removed

### Active/Inactive Logic

- [ ] Coupon with future start date shows as Inactive
- [ ] Coupon with past end date shows as Inactive
- [ ] Coupon within date range shows as Active

## Reviews Management Tests

### Statistics

- [ ] Rating distribution bars show correctly (5 stars to 1 star)
- [ ] Percentage calculations are correct
- [ ] Review counts per rating are accurate

### List View

- [ ] Reviews display with product info
- [ ] Product images show correctly
- [ ] User avatars show initials
- [ ] Star ratings display correctly (filled/empty stars)
- [ ] Review comment text displays
- [ ] Date formats correctly

### Filter

- [ ] Filter by rating (5, 4, 3, 2, 1) shows correct reviews
- [ ] Search by user name works
- [ ] Search by comment text works
- [ ] Search by product name works

### Delete

- [ ] Click "Delete Review" - Shows "Confirm Delete"
- [ ] Click "Confirm" - Review removed from list

## Responsive Design Tests

### Desktop (> 1024px)

- [ ] Sidebar is always visible
- [ ] Content area has proper margin
- [ ] Tables display full columns
- [ ] Grid shows multiple columns

### Tablet (768px - 1024px)

- [ ] Sidebar can be collapsed
- [ ] Content adjusts to available space
- [ ] Grids show 2 columns
- [ ] Tables are scrollable horizontally if needed

### Mobile (< 768px)

- [ ] Sidebar is hidden by default
- [ ] Hamburger menu is visible
- [ ] Content is full width
- [ ] Grids show 1 column
- [ ] Tables are scrollable horizontally
- [ ] Modals are full screen or properly sized

## Authentication & Security Tests

### Protected Routes

- [ ] Access `/admin` while logged out - Redirects to login
- [ ] Access `/admin/users` while logged out - Redirects to login
- [ ] Login and access `/admin` - Works correctly
- [ ] Try to access non-existent admin route - Shows 404

### Role-Based Access

- [ ] Only users with "admin" role can access dashboard
- [ ] Regular users are redirected or shown access denied

## Performance Tests

### Loading States

- [ ] Loading spinners show while data is fetching
- [ ] No "flash of unstyled content" (FOUC)
- [ ] Skeleton screens or placeholders during load

### API Response Handling

- [ ] Success toasts show after create/update/delete
- [ ] Error toasts show if API fails
- [ ] Form validation errors display correctly
- [ ] Network errors are handled gracefully

## Edge Cases

### Empty States

- [ ] No users - Shows "No users found" message
- [ ] No products - Shows "No products found" with CTA
- [ ] No orders - Shows "No orders found"
- [ ] No categories - Shows "Create your first category"
- [ ] No coupons - Shows "Create your first coupon"
- [ ] No reviews - Shows "No reviews found"

### Large Data Sets

- [ ] Pagination works with 100+ items
- [ ] Search filters large datasets quickly
- [ ] No performance lag with many items

### Form Validation

- [ ] Submit empty form - Shows validation errors
- [ ] Invalid email format - Shows error
- [ ] Negative numbers in price/stock - Shows error or prevents input
- [ ] Required fields are enforced

## Browser Compatibility

- [ ] Works in Chrome/Edge
- [ ] Works in Firefox
- [ ] Works in Safari (if available)

## Known Issues to Check

- [ ] No console errors
- [ ] No React key prop warnings
- [ ] No unused variable warnings
- [ ] No accessibility warnings

---

## Testing Complete?

When all items are checked, the Admin Dashboard is ready for production use!

**Found Issues?**
Document them with:

- Page/Component name
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
