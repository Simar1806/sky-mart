import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

export default function Wishlist() {
  const { wishlist } = useShop();
  const [selected, setSelected] = useState(null);

  return (
    <div className="container">
      <h1 className="page-title">Wishlist 💖</h1>
      {wishlist.length === 0 ? (
        <div className="empty glass">
          <motion.div className="empty-emoji" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>🤍</motion.div>
          <h4>Your wishlist is empty</h4>
          <p>Tap the heart on any product to save it here.</p>
          <Link to="/" className="btn btn-primary">Explore products</Link>
        </div>
      ) : (
        <div className="grid">
          <AnimatePresence mode="popLayout">
            {wishlist.map((p, i) => <ProductCard key={p.id} product={p} index={i} onView={setSelected} />)}
          </AnimatePresence>
        </div>
      )}
      <AnimatePresence>{selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </div>
  );
}
