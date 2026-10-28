const BASE = 'https://dummyjson.com';

export async function fetchProducts() {
  const res = await fetch(`${BASE}/products?limit=0`);
  if (!res.ok) throw new Error('Failed to load products');
  const data = await res.json();
  return data.products;
}

export async function fetchCategories() {
  const res = await fetch(`${BASE}/products/category-list`);
  if (!res.ok) throw new Error('Failed to load categories');
  return res.json();
}
