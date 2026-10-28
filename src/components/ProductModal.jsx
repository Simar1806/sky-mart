import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { money, originalPrice, prettyCategory } from '../utils/helpers';
import Stars from './Stars';

export default function ProductModal({ product: p, onClose }) {
  const { addToCart, toggleWishlist, inWishlist, setCartOpen } = useShop();
  const images = p.images?.length ? p.images : [p.thumbnail];
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  const buyNow = () => {
    addToCart(p, qty);
    onClose();
    setCartOpen(false);
    navigate('/checkout');
  };

  return (
    <motion.div className="modal-bg" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div
        className="modal glass"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.85, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.85, y: 40, opacity: 0 }}
        transition={{ type: 'spring', damping: 22 }}
      >
        <button className="icon-btn modal-close" onClick={onClose}><FiX /></button>
        <div className="modal-gallery">
          <motion.img key={img} src={images[img]} alt={p.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} />
          {images.length > 1 && (
            <div className="thumbs">
              {images.slice(0, 5).map((src, i) => (
                <button key={i} className={i === img ? 'active' : ''} onClick={() => setImg(i)}><img src={src} alt="" /></button>
              ))}
            </div>
          )}
        </div>
        <div className="modal-info">
          <small className="brand">{p.brand || 'Sky Mart'} · {prettyCategory(p.category)}</small>
          <h2>{p.title}</h2>
          <Stars value={p.rating} />
          <div className="price big">
            <strong>{money(p.price)}</strong>
            {p.discountPercentage >= 1 && <><s>{money(originalPrice(p))}</s><span className="save">Save {Math.round(p.discountPercentage)}%</span></>}
          </div>
          <p className="desc">{p.description}</p>
          <p className={p.stock > 0 ? 'in-stock' : 'out-stock'}>{p.stock > 0 ? `✓ In stock (${p.stock})` : 'Out of stock'}</p>
          <div className="qty-row">
            <div className="qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}><FiMinus /></button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(p.stock || 1, q + 1))}><FiPlus /></button>
            </div>
            <button className="btn btn-ghost" onClick={() => toggleWishlist(p)}>{inWishlist(p.id) ? '💖 Saved' : '🤍 Wishlist'}</button>
          </div>
          <div className="modal-actions">
            <button className="btn btn-primary" disabled={!p.stock} onClick={() => { addToCart(p, qty); onClose(); }}>Add to cart</button>
            <button className="btn btn-accent" disabled={!p.stock} onClick={buyNow}>Buy now</button>
          </div>
          <div className="perks">
            <span><FiTruck /> Free shipping $100+</span>
            <span><FiRefreshCw /> 30-day returns</span>
            <span><FiShield /> Secure checkout</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
