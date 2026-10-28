import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Background from './components/Background';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

const Page = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default function App() {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <>
      <Background />
      <Toaster
        position="bottom-center"
        toastOptions={{ className: 'toast', duration: 2200 }}
      />
      {user && <Navbar />}
      {user && <CartDrawer />}
      <main className={user ? 'main' : ''}>
        {/* Page enter animation is keyed by route; no exit animation so pages never get stuck invisible */}
        <Routes location={location} key={location.pathname}>
            <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Page><AuthPage /></Page>} />
            <Route path="/" element={<Protected><Page><Home /></Page></Protected>} />
            <Route path="/checkout" element={<Protected><Page><Checkout /></Page></Protected>} />
            <Route path="/success/:id" element={<Protected><Page><OrderSuccess /></Page></Protected>} />
            <Route path="/orders" element={<Protected><Page><Orders /></Page></Protected>} />
            <Route path="/wishlist" element={<Protected><Page><Wishlist /></Page></Protected>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {user && <Footer />}
      <BackToTop />
    </>
  );
}
