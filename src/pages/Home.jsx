import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';
import { fetchProducts } from '../services/api';
import { useShop } from '../context/ShopContext';
import { prettyCategory } from '../utils/helpers';
import Hero from '../components/Hero';
import Filters, { defaultFilters } from '../components/Filters';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import ProductModal from '../components/ProductModal';

const PAGE = typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 24;

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(PAGE);
  const { recent, addRecent } = useShop();
  const shopRef = useRef(null);

  const load = () => {
    setLoading(true); setError('');
    fetchProducts()
      .then((p) => {
        setProducts(p);
        const ceil = Math.ceil(Math.max(...p.map((x) => x.price)));
        setFilters((f) => ({ ...f, maxPrice: ceil }));
      })
      .catch(() => setError('Could not reach the product API. Check your connection.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const priceCeil = useMemo(() => Math.ceil(Math.max(100, ...products.map((p) => p.price))), [products]);
  const categories = useMemo(() => [...new Set(products.map((p) => p.category))], [products]);
  const brands = useMemo(() => {
    const pool = filters.categories.length ? products.filter((p) => filters.categories.includes(p.category)) : products;
    return [...new Set(pool.map((p) => p.brand).filter(Boolean))].sort();
  }, [products, filters.categories]);

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    let list = products.filter((p) =>
      (!q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q)) &&
      (!filters.categories.length || filters.categories.includes(p.category)) &&
      (!filters.brands.length || filters.brands.includes(p.brand)) &&
      p.price >= filters.minPrice && p.price <= filters.maxPrice &&
      p.rating >= filters.minRating &&
      (!filters.inStock || p.stock > 0) &&
      (!filters.onSale || p.discountPercentage >= 10)
    );
    const sorters = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      discount: (a, b) => b.discountPercentage - a.discountPercentage,
      name: (a, b) => a.title.localeCompare(b.title),
    };
    if (sorters[filters.sort]) list = [...list].sort(sorters[filters.sort]);
    return list;
  }, [products, filters]);

  useEffect(() => setVisible(PAGE), [filters]);

  const chips = [
    ...filters.categories.map((c) => ({ label: prettyCategory(c), clear: () => setFilters((f) => ({ ...f, categories: f.categories.filter((x) => x !== c) })) })),
    ...filters.brands.map((b) => ({ label: b, clear: () => setFilters((f) => ({ ...f, brands: f.brands.filter((x) => x !== b) })) })),
    filters.minRating > 0 && { label: `${filters.minRating}★+`, clear: () => setFilters((f) => ({ ...f, minRating: 0 })) },
    filters.inStock && { label: 'In stock', clear: () => setFilters((f) => ({ ...f, inStock: false })) },
    filters.onSale && { label: 'On sale', clear: () => setFilters((f) => ({ ...f, onSale: false })) },
    (filters.minPrice > 0 || filters.maxPrice < priceCeil) && { label: `$${filters.minPrice}–$${filters.maxPrice}`, clear: () => setFilters((f) => ({ ...f, minPrice: 0, maxPrice: priceCeil })) },
    filters.search && { label: `“${filters.search}”`, clear: () => setFilters((f) => ({ ...f, search: '' })) },
  ].filter(Boolean);

  const view = (p) => { setSelected(p); addRecent(p); };
  const pickCategory = (c) => setFilters((f) => ({ ...f, categories: c ? [c] : [] }));

  return (
    <div className="container">
      <Hero onShop={() => shopRef.current?.scrollIntoView({ behavior: 'smooth' })} />

      {/* Category chips */}
      <div className="cat-strip" ref={shopRef}>
        <motion.button whileTap={{ scale: 0.9 }} className={`chip ${!filters.categories.length ? 'active' : ''}`} onClick={() => pickCategory(null)}>✨ All</motion.button>
        {categories.map((c) => (
          <motion.button whileTap={{ scale: 0.9 }} key={c} className={`chip ${filters.categories.length === 1 && filters.categories[0] === c ? 'active' : ''}`} onClick={() => pickCategory(c)}>
            {prettyCategory(c)}
          </motion.button>
        ))}
      </div>

      {/* Search + toolbar */}
      <div className="toolbar">
        <div className="search glass">
          <FiSearch />
          <input placeholder="Search products, brands…" value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} />
          {filters.search && <button onClick={() => setFilters((f) => ({ ...f, search: '' }))}><FiX /></button>}
        </div>
        <button className="btn btn-ghost mobile-only filter-btn" onClick={() => setDrawer(true)} aria-label="Filters"><FiSliders /><span>Filters</span></button>
      </div>

      <div className="shop">
        <Filters filters={filters} setFilters={setFilters} categories={categories} brands={brands} priceCeil={priceCeil} open={drawer} onClose={() => setDrawer(false)} />

        <section className="results">
          <div className="results-head">
            <span>{loading ? 'Loading products…' : <><b>{filtered.length}</b> products found</>}</span>
            {chips.length > 0 && (
              <div className="active-chips">
                <AnimatePresence>
                  {chips.map((c) => (
                    <motion.button key={c.label} className="active-chip" onClick={c.clear} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      {c.label} <FiX />
                    </motion.button>
                  ))}
                </AnimatePresence>
                <button className="link" onClick={() => setFilters({ ...defaultFilters, maxPrice: priceCeil })}>Clear all</button>
              </div>
            )}
          </div>

          {error && (
            <div className="empty glass">
              <div className="empty-emoji">🌩️</div>
              <h4>{error}</h4>
              <button className="btn btn-primary" onClick={load}>Retry</button>
            </div>
          )}

          <div className="grid">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : <AnimatePresence mode="popLayout">
                  {filtered.slice(0, visible).map((p, i) => <ProductCard key={p.id} product={p} index={i} onView={view} />)}
                </AnimatePresence>}
          </div>

          {!loading && !error && filtered.length === 0 && (
            <div className="empty glass">
              <motion.div className="empty-emoji" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>🔭</motion.div>
              <h4>No products match these filters</h4>
              <button className="btn btn-primary" onClick={() => setFilters({ ...defaultFilters, maxPrice: priceCeil })}>Reset filters</button>
            </div>
          )}

          {visible < filtered.length && (
            <div className="center">
              <motion.button whileTap={{ scale: 0.95 }} className="btn btn-ghost" onClick={() => setVisible((v) => v + PAGE)}>
                Load more ({filtered.length - visible} left)
              </motion.button>
            </div>
          )}
        </section>
      </div>

      {recent.length > 0 && (
        <section className="recent">
          <h3>Recently viewed</h3>
          <div className="recent-strip">
            {recent.map((p) => {
              const full = products.find((x) => x.id === p.id) || p;
              return (
                <motion.button whileHover={{ y: -6 }} key={p.id} className="recent-item glass" onClick={() => view(full)}>
                  <img src={p.thumbnail} alt={p.title} />
                  <small>{p.title}</small>
                </motion.button>
              );
            })}
          </div>
        </section>
      )}

      <AnimatePresence>{selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}</AnimatePresence>
    </div>
  );
}
