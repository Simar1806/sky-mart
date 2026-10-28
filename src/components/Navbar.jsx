import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { FiHeart, FiShoppingBag, FiMoon, FiSun, FiLogOut, FiPackage, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

function Badge({ n }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          key={n}
          className="badge"
          initial={{ scale: 0 }}
          animate={{ scale: [1.6, 1] }}
          exit={{ scale: 0 }}
        >
          {n}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totals, wishlist, setCartOpen } = useShop();
  const { theme, toggle } = useTheme();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      className={`navbar glass ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <Link to="/"><Logo /></Link>
      <nav className="nav-links">
        <NavLink to="/" end>Shop</NavLink>
        <NavLink to="/wishlist">Wishlist</NavLink>
        <NavLink to="/orders">Orders</NavLink>
      </nav>
      <div className="nav-actions">
        <button className="icon-btn hide-sm" onClick={toggle} aria-label="Toggle theme">
          <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </motion.span>
        </button>
        <button className="icon-btn hide-sm" onClick={() => navigate('/wishlist')} aria-label="Wishlist">
          <FiHeart /><Badge n={wishlist.length} />
        </button>
        <button className="icon-btn cart-btn" id="cart-icon" onClick={() => setCartOpen(true)} aria-label="Cart">
          <FiShoppingBag /><Badge n={totals.count} />
        </button>
        <div className="avatar-wrap">
          <button className="avatar" onClick={() => setMenu((m) => !m)}>
            <span>{user.name[0]?.toUpperCase()}</span>
            <FiChevronDown className="hide-sm" />
          </button>
          <AnimatePresence>
            {menu && (
              <motion.div
                className="dropdown glass"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                onMouseLeave={() => setMenu(false)}
              >
                <div className="dropdown-head">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
                <button onClick={() => { navigate('/orders'); setMenu(false); }}><FiPackage /> My Orders</button>
                <button onClick={() => { navigate('/wishlist'); setMenu(false); }}><FiHeart /> Wishlist</button>
                <button className="danger" onClick={logout}><FiLogOut /> Logout</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
