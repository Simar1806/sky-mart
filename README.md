# ☁️ Sky Mart

A beautiful, animated e-commerce demo built with **React 18 + Vite**.
Products come from the free fake products API **https://dummyjson.com**. Everything else
(users, sessions, cart, wishlist, orders, theme) is stored in **localStorage**.

## Run it

```bash
npm install
npm run dev
```
Then open the URL Vite prints (usually http://localhost:5173).

Live demo: https://simar1806.github.io/sky-mart/

Demo login: `demo@skymart.com` / `demo123` (or click "Try demo account").

## Features
- Sign up / Sign in / Logout with animated sliding auth card, validation, password strength meter, show/hide password
- Protected routes (store is gated behind login)
- 190+ products from DummyJSON, multiple categories
- Multiple combinable filters: search, multi-category, brand, price range, min rating, in-stock, discounted + sorting, removable filter chips
- Product quick-view modal with gallery & quantity
- Cart drawer with quantity controls, coupons (`SKY10` = 10% off, `FLY20` = 20% off over $200), free shipping over $100, 8% tax
- 3-step checkout (Shipping → Payment → Review) and confetti order success
- My Orders with animated status tracker
- Wishlist, recently viewed, flash sale countdown, hero carousel, dark/light mode, toasts, back-to-top, responsive design

## Structure
```
src/
  components/   Navbar, Background, Hero, Filters, ProductCard, ProductModal, CartDrawer, Footer, ...
  context/      AuthContext, ShopContext (cart, wishlist, orders), ThemeContext
  pages/        AuthPage, Home, Checkout, OrderSuccess, Orders, Wishlist
  services/     api.js (DummyJSON calls)
  utils/        storage.js, helpers.js
```
> Passwords are only lightly hashed for demo purposes — never do this in production.
