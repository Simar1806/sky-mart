import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiCheck, FiCreditCard, FiSmartphone, FiDollarSign } from 'react-icons/fi';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Summary } from '../components/CartDrawer';
import { money, orderId } from '../utils/helpers';

const steps = ['Shipping', 'Payment', 'Review'];

export default function Checkout() {
  const { cart, totals, coupon, placeOrder } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [ship, setShip] = useState({ name: user.name, phone: '', address: '', city: '', zip: '' });
  const [pay, setPay] = useState({ method: 'card', card: '', exp: '', cvv: '', upi: '' });

  if (!cart.length) {
    return (
      <div className="container">
        <div className="empty glass">
          <div className="empty-emoji">📦</div>
          <h4>Nothing to check out yet</h4>
          <Link to="/" className="btn btn-primary">Go shopping</Link>
        </div>
      </div>
    );
  }

  const fmtCard = (v) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const fmtExp = (v) => v.replace(/\D/g, '').slice(0, 4).replace(/(\d{2})(\d)/, '$1/$2');

  const next = () => {
    if (step === 0) {
      if (Object.values(ship).some((v) => !v.trim())) return toast.error('Please fill every shipping field');
      if (!/^\d{10}$/.test(ship.phone.replace(/\D/g, ''))) return toast.error('Enter a valid 10-digit phone');
    }
    if (step === 1) {
      if (pay.method === 'card' && (pay.card.replace(/\s/g, '').length !== 16 || pay.exp.length !== 5 || pay.cvv.length !== 3))
        return toast.error('Check your card details');
      if (pay.method === 'upi' && !/^[\w.-]+@[\w]+$/.test(pay.upi)) return toast.error('Enter a valid UPI ID (name@bank)');
    }
    setStep((s) => s + 1);
  };

  const submit = () => {
    setPlacing(true);
    setTimeout(() => {
      const id = orderId();
      const payment = pay.method === 'card' ? `Card •••• ${pay.card.slice(-4)}` : pay.method === 'upi' ? `UPI (${pay.upi})` : 'Cash on Delivery';
      placeOrder({ shipping: ship, payment }, id);
      navigate(`/success/${id}`);
    }, 1400);
  };

  const methods = [
    { id: 'card', label: 'Card', icon: FiCreditCard },
    { id: 'upi', label: 'UPI', icon: FiSmartphone },
    { id: 'cod', label: 'Cash on Delivery', icon: FiDollarSign },
  ];

  return (
    <div className="container checkout">
      <h1 className="page-title">Checkout</h1>
      <div className="stepper">
        {steps.map((s, i) => (
          <div key={s} className={`step ${i <= step ? 'done' : ''}`}>
            <motion.span animate={{ scale: i === step ? 1.15 : 1 }}>{i < step ? <FiCheck /> : i + 1}</motion.span>
            <small>{s}</small>
            {i < steps.length - 1 && <div className="step-line"><motion.i animate={{ width: i < step ? '100%' : '0%' }} /></div>}
          </div>
        ))}
      </div>

      <div className="checkout-grid">
        <div className="glass panel">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              {step === 0 && (
                <div className="form-grid">
                  <h3>Shipping address</h3>
                  {[['name', 'Full name'], ['phone', 'Phone'], ['address', 'Street address'], ['city', 'City'], ['zip', 'PIN / ZIP code']].map(([k, l]) => (
                    <div className={`field ${k === 'address' ? 'span2' : ''}`} key={k}>
                      <input placeholder=" " value={ship[k]} onChange={(e) => setShip({ ...ship, [k]: e.target.value })} />
                      <label>{l}</label>
                    </div>
                  ))}
                </div>
              )}
              {step === 1 && (
                <div>
                  <h3>Payment method</h3>
                  <div className="methods">
                    {methods.map((m) => (
                      <motion.button whileTap={{ scale: 0.95 }} key={m.id} className={`method ${pay.method === m.id ? 'active' : ''}`} onClick={() => setPay({ ...pay, method: m.id })}>
                        <m.icon /> {m.label}
                      </motion.button>
                    ))}
                  </div>
                  {pay.method === 'card' && (
                    <>
                      <motion.div className="credit-card" initial={{ rotateY: 90 }} animate={{ rotateY: 0 }}>
                        <span className="chip-icon" />
                        <div className="cc-num">{pay.card || '•••• •••• •••• ••••'}</div>
                        <div className="cc-row"><span>{ship.name || 'CARD HOLDER'}</span><span>{pay.exp || 'MM/YY'}</span></div>
                      </motion.div>
                      <div className="form-grid">
                        <div className="field span2"><input placeholder=" " value={pay.card} onChange={(e) => setPay({ ...pay, card: fmtCard(e.target.value) })} /><label>Card number (any 16 digits)</label></div>
                        <div className="field"><input placeholder=" " value={pay.exp} onChange={(e) => setPay({ ...pay, exp: fmtExp(e.target.value) })} /><label>Expiry MM/YY</label></div>
                        <div className="field"><input placeholder=" " type="password" value={pay.cvv} onChange={(e) => setPay({ ...pay, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })} /><label>CVV</label></div>
                      </div>
                      <small className="muted">Demo only — no real payment is processed.</small>
                    </>
                  )}
                  {pay.method === 'upi' && (
                    <div className="field"><input placeholder=" " value={pay.upi} onChange={(e) => setPay({ ...pay, upi: e.target.value })} /><label>UPI ID (e.g. name@okbank)</label></div>
                  )}
                  {pay.method === 'cod' && <p className="muted">Pay in cash when your order lands at your door. 🚪</p>}
                </div>
              )}
              {step === 2 && (
                <div className="review">
                  <h3>Review your order</h3>
                  <div className="review-box"><b>Ship to</b><p>{ship.name}, {ship.phone}<br />{ship.address}, {ship.city} {ship.zip}</p></div>
                  <div className="review-box"><b>Payment</b><p>{pay.method === 'card' ? `Card ending ${pay.card.slice(-4)}` : pay.method === 'upi' ? pay.upi : 'Cash on Delivery'}</p></div>
                  <ul className="review-items">
                    {cart.map((i) => (
                      <li key={i.id}><img src={i.thumbnail} alt="" /><span>{i.title} × {i.qty}</span><b>{money(i.price * i.qty)}</b></li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <div className="step-actions">
            {step > 0 && <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>Back</button>}
            {step < 2
              ? <button className="btn btn-primary" onClick={next}>Continue</button>
              : <motion.button whileTap={{ scale: 0.95 }} className="btn btn-accent" disabled={placing} onClick={submit}>
                  {placing ? <><span className="spinner" /> Placing order…</> : `Place order · ${money(totals.total)}`}
                </motion.button>}
          </div>
        </div>
        <div className="glass panel sticky">
          <h3>Order summary</h3>
          <Summary totals={totals} coupon={coupon} />
        </div>
      </div>
    </div>
  );
}
