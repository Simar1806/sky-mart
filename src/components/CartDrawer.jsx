import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTrash2, FiTag } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { money } from '../utils/helpers';

export function Summary({ totals, coupon }) {
  return (
    <div className="summary">
      <div><span>Subtotal</span><span>{money(totals.subtotal)}</span></div>
      {totals.discount > 0 && <div className="green"><span>Coupon ({coupon})</span><span>-{money(totals.discount)}</span></div>}
      <div><span>Shipping</span><span>{totals.shipping === 0 ? 'FREE' : money(totals.shipping)}</span></div>
      <div><span>Tax (8%)</span><span>{money(totals.tax)}</span></div>
      <div className="total"><span>Total</span><span>{money(totals.total)}</span></div>
    </div>
  );
}

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeFromCart, totals, applyCoupon, coupon, setCoupon } = useShop();
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          <motion.div className="overlay" onClick={() => setCartOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside
            className="drawer glass"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          >
            <div className="drawer-head">
              <h3>Your Cart <small>({totals.count})</small></h3>
              <button className="icon-btn" onClick={() => setCartOpen(false)}><FiX /></button>
            </div>

            {cart.length === 0 ? (
              <div className="empty">
                <motion.div className="empty-emoji" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>🛒</motion.div>
                <h4>Your cart is floating empty</h4>
                <p>Add something nice from the shop.</p>
                <button className="btn btn-primary" onClick={() => setCartOpen(false)}>Start shopping</button>
              </div>
            ) : (
              <>
                {totals.subtotal < 100 && (
                  <div className="ship-bar">
                    <small>Add {money(100 - totals.subtotal)} more for <b>free shipping</b> ✈️</small>
                    <div className="bar"><motion.span animate={{ width: `${Math.min(100, totals.subtotal)}%` }} /></div>
                  </div>
                )}
                <ul className="cart-list">
                  <AnimatePresence>
                    {cart.map((i) => (
                      <motion.li key={i.id} layout initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 80, height: 0 }}>
                        <img src={i.thumbnail} alt={i.title} />
                        <div className="ci-info">
                          <strong>{i.title}</strong>
                          <small>{money(i.price)}</small>
                          <div className="qty sm">
                            <button onClick={() => updateQty(i.id, i.qty - 1)}><FiMinus /></button>
                            <span>{i.qty}</span>
                            <button onClick={() => updateQty(i.id, Math.min(i.qty + 1, i.stock || 99))}><FiPlus /></button>
                          </div>
                        </div>
                        <div className="ci-right">
                          <strong>{money(i.price * i.qty)}</strong>
                          <button className="icon-btn danger" onClick={() => removeFromCart(i.id)}><FiTrash2 /></button>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="drawer-foot">
                  {coupon ? (
                    <div className="coupon-applied"><FiTag /> {coupon} applied <button onClick={() => setCoupon(null)}>Remove</button></div>
                  ) : (
                    <form className="coupon" onSubmit={(e) => { e.preventDefault(); applyCoupon(code); setCode(''); }}>
                      <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon (try SKY10)" />
                      <button className="btn btn-ghost btn-sm">Apply</button>
                    </form>
                  )}
                  <Summary totals={totals} coupon={coupon} />
                  <motion.button whileTap={{ scale: 0.96 }} className="btn btn-primary full" onClick={() => { setCartOpen(false); navigate('/checkout'); }}>
                    Checkout · {money(totals.total)}
                  </motion.button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
