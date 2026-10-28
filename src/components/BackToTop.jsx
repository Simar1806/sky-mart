import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiArrowUp } from 'react-icons/fi';

export default function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', f);
    return () => window.removeEventListener('scroll', f);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button className="to-top" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
          whileHover={{ y: -4 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <FiArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
