# TODO: Complete Coupons Offer System Integration

## Step 1: Create offerSlice in Redux

- Create src/store/feature/offerSlice.js to manage claimed coupons state.

## Step 2: Update store.js

- Add offerReducer to the store configuration.

## Step 3: Update HomeOffer.jsx

- Import useDispatch and offerSlice actions.
- Dispatch claimCoupon action when claiming coupons.
- Store claimed coupons in Redux state.

## Step 4: Update Cart.jsx

- Import useSelector for offer state.
- Calculate discounts based on claimed coupons.
- Display applied discounts and updated total.

## Step 5: Check and Improve Entire Site Integration

- Ensure coupons persist across sessions (localStorage).
- Add coupon validation (e.g., one-time use).
- Integrate offers into other components if needed (e.g., checkout).
- Test the system thoroughly.
