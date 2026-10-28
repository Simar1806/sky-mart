import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const slides = [
  { tag: 'New Season', title: 'Shop above the clouds', text: 'Hundreds of products, delivered at the speed of flight.', emoji: '🚀', grad: 'linear-gradient(135deg,#00d2ff,#7b2ff7)' },
  { tag: 'Flash Sale', title: 'Up to 40% off gadgets', text: 'Smartphones, laptops and accessories. Use code FLY20.', emoji: '⚡', grad: 'linear-gradient(135deg,#ff6a88,#7b2ff7)' },
  { tag: 'Free Shipping', title: 'Free delivery over $100', text: 'Plus 10% off your first order with code SKY10.', emoji: '🎁', grad: 'linear-gradient(135deg,#43e97b,#00b4db)' },
];

function useCountdown() {
  const end = (() => { const d = new Date(); d.setHours(23, 59, 59, 999); return d; })();
  const [left, setLeft] = useState(end - Date.now());
  useEffect(() => {
    const t = setInterval(() => setLeft(end - Date.now()), 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const s = Math.max(0, Math.floor(left / 1000));
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) => String(n).padStart(2, '0'));
}

export default function Hero({ onShop }) {
  const [i, setI] = useState(0);
  const [h, m, s] = useCountdown();

  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[i];
  return (
    <section className="hero glass">
      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          className="hero-slide"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-copy">
            <span className="hero-tag" style={{ background: slide.grad }}>{slide.tag}</span>
            <h1>{slide.title}</h1>
            <p>{slide.text}</p>
            <div className="hero-cta">
              <button className="btn btn-primary" onClick={onShop}>Shop now</button>
              <div className="countdown">
                <small>Flash sale ends in</small>
                <div>{[h, m, s].map((v, k) => <span key={k}>{v}</span>)}</div>
              </div>
            </div>
          </div>
          <motion.div
            className="hero-art"
            style={{ background: slide.grad }}
            animate={{ y: [0, -14, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <span>{slide.emoji}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className="hero-dots">
        {slides.map((_, k) => (
          <button key={k} className={k === i ? 'active' : ''} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} />
        ))}
      </div>
    </section>
  );
}
