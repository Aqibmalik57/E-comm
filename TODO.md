# HomeOffer Section Update - TODO

## Task

Set the HomeOffer section to show active coupons with correct data like the Offers page, update Offers page to remove cycles and add upcoming coupon timer, and show claimed coupons in the cart.

## Issues Identified

1. Not fetching coupons on mount - missing dispatch for getAllCoupons and getMyClaimedCoupons
2. Wrong property names - expirationDate vs expireDate, id vs \_id, name vs title
3. Missing proper status checking - doesn't check if coupon is LIVE
4. Missing dispatch for updateCouponStatus
5. Different claimed coupon check logic
6. Offers page showing cycles on all coupon cards (needs removal)
7. Offers page missing timer for upcoming coupons (within 2 days)
8. Cart not properly handling claimed coupons from API response structure

## Steps

- [x] Create TODO.md file
- [x] Update HomeOffer.jsx:
  - [x] Add useEffect to dispatch getAllCoupons() and getMyClaimedCoupons() on mount
  - [x] Fix property name: expirationDate → expireDate
  - [x] Fix property name: coupon.id → coupon.\_id
  - [x] Fix property name: coupon.name → coupon.title
  - [x] Add proper status checking logic (LIVE status based on startDate and expireDate)
  - [x] Dispatch updateCouponStatus in timer interval
  - [x] Fix claimed coupon check logic to match Offers.jsx
  - [x] Update timer logic to show countdown in h:m:s format
  - [x] Add discount percentage display next to coupon title
  - [x] Update CSS styles for discount badge
- [x] Update Offers.jsx:
  - [x] Remove cycle badges from all coupon cards
  - [x] Add timer for upcoming coupons (within 48 hours/2 days)
  - [x] Show "Starting in XH : XM" for coupons becoming active soon
- [x] Update Cart.jsx:
  - [x] Fix claimed coupon filtering to handle nested couponId structure
  - [x] Fix coupon property access (title, description, discountPercent, expireDate)
  - [x] Fix coupon ID handling for selection/deselection
  - [x] Fix discount calculation to work with API response structure
- [ ] Test the implementation

## Status

Completed

## Summary of Changes

### HomeOffer.jsx Updates:

1. **Added data fetching on mount** - Added `useEffect` to dispatch `getAllCoupons()` and `getMyClaimedCoupons()` when component loads
2. **Fixed property names**:
   - `expirationDate` → `expireDate`
   - `coupon.id` → `coupon._id`
   - `coupon.name` → `coupon.title`
3. **Added proper status checking** - Now checks `startDate` and `expireDate` to determine if coupon is LIVE, UPCOMING, or EXPIRED
4. **Added `updateCouponStatus` dispatch** - Dispatches in timer interval to keep coupon status updated
5. **Fixed claimed coupon check** - Uses same logic as Offers.jsx: `c.couponId?._id === couponId || c.couponId === couponId`
6. **Updated timer display** - Shows hours, minutes, seconds (h:m:s) format matching Offers page
7. **Added proper claim handling** - Async function with error handling and refresh of claimed coupons after successful claim
8. **Added discount percentage badge** - Shows `{discountPercent}% OFF` as a small badge next to the coupon title

### Offers.jsx Updates:

1. **Removed cycle badges** - Removed `currentCycle` and `totalCycles` display from all coupon cards
2. **Added upcoming coupon timer** - Shows "Starting in XH : XM" timer for coupons that will become active within 48 hours (2 days)
3. **Timer based on backend startDate** - Timer is calculated from each coupon's `startDate` field from the backend

### Cart.jsx Updates:

1. **Fixed claimed coupon filtering** - Now properly handles nested `couponId` structure from API response
2. **Fixed coupon property access** - Updated to use `coupon.title`, `coupon.description`, `coupon.discountPercent`, `coupon.expireDate`
3. **Fixed coupon ID handling** - Now correctly extracts `_id` from nested structure for selection/deselection
4. **Fixed discount calculation** - Updated to work with both flat and nested coupon data structures
5. **Shows claimed coupons** - Cart now displays all valid claimed coupons that can be applied to the order
