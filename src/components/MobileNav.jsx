import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiHeart, FiShoppingBag, FiPackage, FiMoon, FiSun } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { useTheme } from '../context/ThemeContext';

// Bottom tab bar shown only on small screens
export default function MobileNav() {
  const { totals, wishlist, setCartOpen } = useShop();
  const { theme, toggle } = useTheme();
  return (
    <nav className="mobile-nav glass" aria-label="Mobile navigation">
      <NavLink to="/" end><FiHome /><span>Shop</span></NavLink>
      <NavLink to="/wishlist">
        <i className="mn-icon"><FiHeart />{wishlist.length > 0 && <b className="mn-badge">{wishlist.length}</b>}</i>
        <span>Wishlist</span>
      </NavLink>
      <motion.button whileTap={{ scale: 0.85 }} className="mn-cart" onClick={() => setCartOpen(true)} aria-label="Cart">
        <FiShoppingBag />
        {totals.count > 0 && <b className="mn-badge">{totals.count}</b>}
      </motion.button>
      <NavLink to="/orders"><FiPackage /><span>Orders</span></NavLink>
      <button onClick={toggle}>{theme === 'dark' ? <FiSun /> : <FiMoon />}<span>Theme</span></button>
    </nav>
  );
}
