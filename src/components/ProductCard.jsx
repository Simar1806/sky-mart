import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useShop } from '../context/ShopContext';
import { money, originalPrice } from '../utils/helpers';
import Stars from './Stars';

export default function ProductCard({ product: p, index = 0, onView }) {
  const { addToCart, toggleWishlist, inWishlist } = useShop();
  const liked = inWishlist(p.id);
  const out = p.stock === 0;

  const handleMove = (e) => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  };
  const reset = (e) => (e.currentTarget.style.transform = '');

  return (
    <motion.article
      className="card glass"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.35, delay: Math.min(index, 12) * 0.04 }}
    >
      <div className="card-inner" onMouseMove={handleMove} onMouseLeave={reset}>
        {p.discountPercentage >= 1 && <span className="discount">-{Math.round(p.discountPercentage)}%</span>}
        <motion.button whileTap={{ scale: 0.8 }} className={`heart ${liked ? 'liked' : ''}`} onClick={() => toggleWishlist(p)} aria-label="Wishlist">
          {liked ? <FaHeart /> : <FiHeart />}
        </motion.button>
        <div className="card-img" onClick={() => onView(p)}>
          <img src={p.thumbnail} alt={p.title} loading="lazy" />
          <span className="quick-view"><FiEye /> Quick view</span>
        </div>
        <div className="card-body">
          <small className="brand">{p.brand || p.category}</small>
          <h3 onClick={() => onView(p)}>{p.title}</h3>
          <Stars value={p.rating} />
          <div className="card-foot">
            <div className="price">
              <strong>{money(p.price)}</strong>
              {p.discountPercentage >= 1 && <s>{money(originalPrice(p))}</s>}
            </div>
            <motion.button
              whileTap={{ scale: 0.85 }}
              className="btn btn-primary btn-sm"
              disabled={out}
              onClick={() => addToCart(p)}
            >
              {out ? 'Sold out' : <><FiShoppingCart /> Add</>}
            </motion.button>
          </div>
          {p.stock > 0 && p.stock < 10 && <small className="low-stock">Only {p.stock} left!</small>}
        </div>
      </div>
    </motion.article>
  );
}
