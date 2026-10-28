export const money = (n) => `$${Number(n).toFixed(2)}`;

export const originalPrice = (p) => p.price / (1 - (p.discountPercentage || 0) / 100);

// Tiny demo hash (NOT secure — demo only)
export const hash = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (h * 33) ^ str.charCodeAt(i);
  return (h >>> 0).toString(16);
};

export const prettyCategory = (slug = '') =>
  slug.split('-').map((w) => w[0]?.toUpperCase() + w.slice(1)).join(' ');

export const orderId = () => 'SKY-' + Math.random().toString(36).slice(2, 8).toUpperCase();

export const passwordStrength = (pw) => {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
};
