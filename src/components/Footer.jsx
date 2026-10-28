import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiGithub, FiInstagram, FiTwitter } from 'react-icons/fi';
import Logo from './Logo';

export default function Footer() {
  const [email, setEmail] = useState('');
  return (
    <footer className="footer glass">
      <div className="footer-col">
        <Logo />
        <p>Shop above the clouds. A React demo store powered by DummyJSON.</p>
        <div className="socials"><FiInstagram /><FiTwitter /><FiGithub /></div>
      </div>
      <div className="footer-col">
        <h4>Help</h4>
        <span>Shipping</span><span>Returns</span><span>FAQ</span>
      </div>
      <div className="footer-col">
        <h4>Get 10% off</h4>
        <p>Join the newsletter for flash sales.</p>
        <form className="coupon" onSubmit={(e) => {
          e.preventDefault();
          if (!/\S+@\S+\.\S+/.test(email)) return toast.error('Enter a valid email');
          toast.success('Subscribed! Use code SKY10 ✨'); setEmail('');
        }}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          <button className="btn btn-primary btn-sm">Join</button>
        </form>
      </div>
      <small className="copy">© {new Date().getFullYear()} Sky Mart. All rights reserved.</small>
    </footer>
  );
}
