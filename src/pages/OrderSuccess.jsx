import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { money } from '../utils/helpers';

export default function OrderSuccess() {
  const { id } = useParams();
  const { orders } = useShop();
  const order = orders.find((o) => o.id === id);

  useEffect(() => {
    const end = Date.now() + 1500;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0 }, colors: ['#00d2ff', '#7b2ff7', '#ff6a88'] });
      confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1 }, colors: ['#00d2ff', '#7b2ff7', '#ff6a88'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  return (
    <div className="container">
      <motion.div className="success glass" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring' }}>
        <motion.div className="success-check" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring' }}>✓</motion.div>
        <h1>Order placed!</h1>
        <p>Your package is taking off ✈️</p>
        <div className="order-id">Order ID <b>{id}</b></div>
        {order && <p className="muted">{order.items.length} item(s) · {money(order.totals.total)} · {order.payment}</p>}
        <div className="success-actions">
          <Link to="/orders" className="btn btn-primary">Track order</Link>
          <Link to="/" className="btn btn-ghost">Continue shopping</Link>
        </div>
      </motion.div>
    </div>
  );
}
