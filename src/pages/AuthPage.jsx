import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { passwordStrength } from '../utils/helpers';
import Logo from '../components/Logo';

const strengthLabels = ['Too weak', 'Weak', 'Okay', 'Strong', 'Sky high 🚀'];

function Field({ icon: Icon, error, type = 'text', toggle, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <Icon className="field-icon" />
      <input type={toggle ? (show ? 'text' : 'password') : type} placeholder=" " {...props} />
      <label>{props['aria-label']}</label>
      {toggle && (
        <button type="button" className="eye" onClick={() => setShow((s) => !s)} aria-label="Show password">
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      )}
      <AnimatePresence>
        {error && <motion.small className="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{error}</motion.small>}
      </AnimatePresence>
    </div>
  );
}

export default function AuthPage() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isUp = mode === 'signup';
  const strength = passwordStrength(form.password);

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setErrors({ ...errors, [k]: '' }); };

  const validate = () => {
    const e = {};
    if (isUp && form.name.trim().length < 2) e.name = 'Please enter your name';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'At least 6 characters';
    if (isUp && form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      try {
        isUp ? signUp(form) : signIn(form);
        toast.success(isUp ? `Welcome aboard, ${form.name.split(' ')[0]}! ✈️` : 'Welcome back! ☁️');
      } catch (err) {
        toast.error(err.message);
        setLoading(false);
      }
    }, 700);
  };

  const demo = () => {
    signIn({ email: 'demo@skymart.com', password: 'demo123' });
    toast.success('Signed in with demo account');
  };

  const switchMode = () => { setMode(isUp ? 'signin' : 'signup'); setErrors({}); };

  return (
    <div className="auth-wrap">
      <motion.div className={`auth-card glass ${isUp ? 'up' : ''}`} layout transition={{ type: 'spring', damping: 20 }}>
        {/* Showcase panel */}
        <motion.div className="auth-side" layout transition={{ type: 'spring', damping: 20 }}>
          <Logo big />
          <AnimatePresence mode="wait">
            <motion.div key={mode} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2>{isUp ? 'Already flying with us?' : 'New to Sky Mart?'}</h2>
              <p>{isUp ? 'Sign in to pick up where you left off.' : 'Create an account and get 10% off with SKY10.'}</p>
              <button className="btn btn-outline" onClick={switchMode}>{isUp ? 'Sign in' : 'Create account'}</button>
            </motion.div>
          </AnimatePresence>
          <div className="floating-items">
            {['👟', '🎧', '📱', '⌚', '💄', '🛋️'].map((e, i) => (
              <motion.span key={i} animate={{ y: [0, -18, 0], rotate: [0, 10, -10, 0] }} transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.3 }}>{e}</motion.span>
            ))}
          </div>
        </motion.div>

        {/* Form panel */}
        <motion.div className="auth-form" layout transition={{ type: 'spring', damping: 20 }}>
          <AnimatePresence mode="wait">
            <motion.form key={mode} onSubmit={submit} noValidate
              initial={{ opacity: 0, x: isUp ? 40 : -40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isUp ? -40 : 40 }}>
              <h1>{isUp ? 'Create account' : 'Welcome back'}</h1>
              <p className="muted">{isUp ? 'Join the sky-high shopping club.' : 'Sign in to continue shopping.'}</p>

              {isUp && <Field icon={FiUser} aria-label="Full name" value={form.name} onChange={set('name')} error={errors.name} />}
              <Field icon={FiMail} type="email" aria-label="Email" value={form.email} onChange={set('email')} error={errors.email} />
              <Field icon={FiLock} toggle aria-label="Password" value={form.password} onChange={set('password')} error={errors.password} />

              {isUp && form.password && (
                <div className="strength">
                  <div className="strength-bars">
                    {[0, 1, 2, 3].map((i) => <span key={i} className={i < strength ? `on s${strength}` : ''} />)}
                  </div>
                  <small>{strengthLabels[strength]}</small>
                </div>
              )}
              {isUp && <Field icon={FiLock} toggle aria-label="Confirm password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} />}

              {!isUp && (
                <div className="auth-row">
                  <label className="check"><input type="checkbox" defaultChecked /> <span>Remember me</span></label>
                  <a href="#" onClick={(e) => { e.preventDefault(); toast('Demo app: try the demo account 😉'); }}>Forgot password?</a>
                </div>
              )}

              <motion.button whileTap={{ scale: 0.96 }} className="btn btn-primary full" disabled={loading}>
                {loading ? <span className="spinner" /> : <>{isUp ? 'Sign up' : 'Sign in'} <FiArrowRight /></>}
              </motion.button>
              <div className="divider"><span>or</span></div>
              <button type="button" className="btn btn-ghost full" onClick={demo}>✨ Try demo account</button>
              <p className="switch-text">
                {isUp ? 'Have an account?' : "Don't have an account?"}{' '}
                <button type="button" onClick={switchMode}>{isUp ? 'Sign in' : 'Sign up'}</button>
              </p>
            </motion.form>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
