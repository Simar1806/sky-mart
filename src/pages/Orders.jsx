import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import { money } from '../utils/helpers';

const STAGES = ['Placed', 'Packed', 'Shipped', 'Delivered'];
// Demo: status advances every 2 minutes after ordering
const stageOf = (date) => Math.min(3, Math.floor((Date.now() - date) / 120000));

export default function Orders() {
  const { orders } = useShop();

  if (!orders.length) {
    return (
      <div className="container">
        <div className="empty glass">
          <motion.div className="empty-emoji" animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>📦</motion.div>
          <h4>No orders yet</h4>
          <p>Your future orders will land here.</p>
          <Link to="/" className="btn btn-primary">Start shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">My Orders</h1>
      <div className="orders">
        {orders.map((o, idx) => {
          const st = stageOf(o.date);
          return (
            <motion.div key={o.id} className="order glass" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.08 }}>
              <div className="order-head">
                <div><b>{o.id}</b><small>{new Date(o.date).toLocaleString()}</small></div>
                <div className="order-total">{money(o.totals.total)}<small>{o.payment}</small></div>
              </div>
              <div className="tracker">
                {STAGES.map((s, i) => (
                  <div key={s} className={`t-step ${i <= st ? 'done' : ''}`}>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.15 }}>{i <= st ? '✓' : ''}</motion.span>
                    <small>{s}</small>
                  </div>
                ))}
                <div className="t-line"><motion.i initial={{ width: 0 }} animate={{ width: `${(st / 3) * 100}%` }} transition={{ duration: 1, delay: 0.3 }} /></div>
              </div>
              <div className="order-items">
                {o.items.map((i) => (
                  <div key={i.id} className="oi"><img src={i.thumbnail} alt="" /><span>{i.title} × {i.qty}</span></div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
