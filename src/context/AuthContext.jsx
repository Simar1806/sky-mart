import { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../utils/storage';
import { hash } from '../utils/helpers';

const AuthContext = createContext(null);
const USERS = 'skymart_users';
const SESSION = 'skymart_session';

const DEMO = { name: 'Demo Flyer', email: 'demo@skymart.com', password: hash('demo123') };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get(SESSION));

  useEffect(() => {
    const users = storage.get(USERS, []);
    if (!users.find((u) => u.email === DEMO.email)) storage.set(USERS, [...users, DEMO]);
  }, []);

  const signUp = ({ name, email, password }) => {
    const users = storage.get(USERS, []);
    const e = email.trim().toLowerCase();
    if (users.find((u) => u.email === e)) throw new Error('An account with this email already exists');
    const newUser = { name: name.trim(), email: e, password: hash(password), joined: Date.now() };
    storage.set(USERS, [...users, newUser]);
    const session = { name: newUser.name, email: e };
    storage.set(SESSION, session);
    setUser(session);
  };

  const signIn = ({ email, password }) => {
    const users = storage.get(USERS, [DEMO]);
    const found = users.find((u) => u.email === email.trim().toLowerCase());
    if (!found || found.password !== hash(password)) throw new Error('Invalid email or password');
    const session = { name: found.name, email: found.email };
    storage.set(SESSION, session);
    setUser(session);
  };

  const logout = () => {
    storage.remove(SESSION);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, logout }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
