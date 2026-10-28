import { motion } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { prettyCategory } from '../utils/helpers';

export const defaultFilters = {
  search: '',
  categories: [],
  brands: [],
  minPrice: 0,
  maxPrice: 3000,
  minRating: 0,
  inStock: false,
  onSale: false,
  sort: 'relevance',
};

export default function Filters({ filters, setFilters, categories, brands, priceCeil, open, onClose }) {
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  const toggleIn = (k, v) =>
    setFilters((f) => ({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] }));

  return (
    <>
      {open && <div className="overlay mobile-only" onClick={onClose} />}
      <aside className={`filters glass ${open ? 'open' : ''}`}>
        <div className="filters-head">
          <h3>Filters</h3>
          <button className="icon-btn mobile-only" onClick={onClose}><FiX /></button>
        </div>

        <div className="f-group">
          <label>Sort by</label>
          <select value={filters.sort} onChange={(e) => set('sort', e.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top rated</option>
            <option value="discount">Biggest discount</option>
            <option value="name">Name A → Z</option>
          </select>
        </div>

        <div className="f-group">
          <label>Price: ${filters.minPrice} – ${filters.maxPrice}</label>
          <div className="range-row">
            <input type="range" min="0" max={priceCeil} value={filters.minPrice}
              onChange={(e) => set('minPrice', Math.min(+e.target.value, filters.maxPrice))} />
            <input type="range" min="0" max={priceCeil} value={filters.maxPrice}
              onChange={(e) => set('maxPrice', Math.max(+e.target.value, filters.minPrice))} />
          </div>
        </div>

        <div className="f-group">
          <label>Minimum rating</label>
          <div className="rating-pills">
            {[0, 3, 3.5, 4, 4.5].map((r) => (
              <button key={r} className={filters.minRating === r ? 'pill active' : 'pill'} onClick={() => set('minRating', r)}>
                {r === 0 ? 'Any' : `${r}★+`}
              </button>
            ))}
          </div>
        </div>

        <div className="f-group toggles">
          <label className="switch">
            <input type="checkbox" checked={filters.inStock} onChange={(e) => set('inStock', e.target.checked)} />
            <span className="slider" /> In stock only
          </label>
          <label className="switch">
            <input type="checkbox" checked={filters.onSale} onChange={(e) => set('onSale', e.target.checked)} />
            <span className="slider" /> 10%+ discount
          </label>
        </div>

        <div className="f-group">
          <label>Categories</label>
          <div className="check-list">
            {categories.map((c) => (
              <label key={c} className="check">
                <input type="checkbox" checked={filters.categories.includes(c)} onChange={() => toggleIn('categories', c)} />
                <span>{prettyCategory(c)}</span>
              </label>
            ))}
          </div>
        </div>

        {brands.length > 0 && (
          <div className="f-group">
            <label>Brands</label>
            <div className="check-list">
              {brands.map((b) => (
                <label key={b} className="check">
                  <input type="checkbox" checked={filters.brands.includes(b)} onChange={() => toggleIn('brands', b)} />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <motion.button whileTap={{ scale: 0.95 }} className="btn btn-ghost full"
          onClick={() => setFilters({ ...defaultFilters, maxPrice: priceCeil })}>
          Reset all filters
        </motion.button>
      </aside>
    </>
  );
}
