import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { storage } from '../utils/storage';
import { useAuth } from './AuthContext';

const ShopContext = createContext(null);

export const COUPONS = {
  SKY10: { label: '10% off', apply: (sub) => sub * 0.1 },
  FLY20: { label: '20% off orders over $200', min: 200, apply: (sub) => sub * 0.2 },
};

export function ShopProvider({ children }) {
  const { user } = useAuth();
  const key = (name) => `skymart_${name}_${user?.email || 'guest'}`;

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [recent, setRecent] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // load per-user data
  useEffect(() => {
    setCart(storage.get(key('cart'), []));
    setWishlist(storage.get(key('wishlist'), []));
    setOrders(storage.get(key('orders'), []));
    setRecent(storage.get(key('recent'), []));
    setCoupon(null);
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  useEffect(() => { if (loaded) storage.set(key('cart'), cart); }, [cart]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(key('wishlist'), wishlist); }, [wishlist]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(key('orders'), orders); }, [orders]); // eslint-disable-line
  useEffect(() => { if (loaded) storage.set(key('recent'), recent); }, [recent]); // eslint-disable-line

  const slim = (p) => ({
    id: p.id, title: p.title, price: p.price, thumbnail: p.thumbnail,
    brand: p.brand, stock: p.stock, discountPercentage: p.discountPercentage, rating: p.rating, category: p.category,
  });

  const addToCart = (p, qty = 1) => {
    setCart((c) => {
      const found = c.find((i) => i.id === p.id);
      if (found) return c.map((i) => (i.id === p.id ? { ...i, qty: Math.min(i.qty + qty, p.stock || 99) } : i));
      return [...c, { ...slim(p), qty }];
    });
    toast.success(`${p.title} added to cart`, { icon: '🛒' });
  };
  const updateQty = (id, qty) =>
    setCart((c) => (qty <= 0 ? c.filter((i) => i.id !== id) : c.map((i) => (i.id === id ? { ...i, qty } : i))));
  const removeFromCart = (id) => setCart((c) => c.filter((i) => i.id !== id));
  const clearCart = () => { setCart([]); setCoupon(null); };

  const toggleWishlist = (p) => {
    setWishlist((w) => {
      if (w.find((i) => i.id === p.id)) {
        toast('Removed from wishlist', { icon: '💔' });
        return w.filter((i) => i.id !== p.id);
      }
      toast('Saved to wishlist', { icon: '💖' });
      return [...w, slim(p)];
    });
  };
  const inWishlist = (id) => wishlist.some((i) => i.id === id);

  const addRecent = (p) => setRecent((r) => [slim(p), ...r.filter((i) => i.id !== p.id)].slice(0, 10));

  const applyCoupon = (code) => {
    const c = COUPONS[code.trim().toUpperCase()];
    if (!c) return toast.error('Invalid coupon code');
    if (c.min && totals.subtotal < c.min) return toast.error(`Requires a subtotal over $${c.min}`);
    setCoupon(code.trim().toUpperCase());
    toast.success(`Coupon applied: ${c.label}`);
  };

  const totals = useMemo(() => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const c = coupon && COUPONS[coupon];
    const discount = c && (!c.min || subtotal >= c.min) ? c.apply(subtotal) : 0;
    const after = subtotal - discount;
    const shipping = after === 0 || after >= 100 ? 0 : 9.99;
    const tax = after * 0.08;
    return { subtotal, discount, shipping, tax, total: after + shipping + tax, count: cart.reduce((s, i) => s + i.qty, 0) };
  }, [cart, coupon]);

  const placeOrder = (details, id) => {
    const order = { id, date: Date.now(), items: cart, totals, coupon, ...details };
    setOrders((o) => [order, ...o]);
    clearCart();
    return order;
  };

  return (
    <ShopContext.Provider
      value={{
        cart, wishlist, orders, recent, coupon, totals, cartOpen, setCartOpen,
        addToCart, updateQty, removeFromCart, clearCart, toggleWishlist, inWishlist,
        addRecent, applyCoupon, setCoupon, placeOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
