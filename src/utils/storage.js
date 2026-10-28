// Safe localStorage wrapper with in-memory fallback
const memory = {};

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return key in memory ? memory[key] : fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      memory[key] = value;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      delete memory[key];
    }
  },
};
