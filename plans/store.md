# ✅ Zustand Store Best Practices

## 🧱 1. **Structure & Organization**
- Organize stores in a dedicated folder: `resources/js/Stores/`
- Name store files by domain: `authStore.ts`, `uiStore.ts`, `savingsStore.ts`

---

## 📦 2. **Minimal Global State**
- Only store *shared* or *persistent* data in Zustand:
  - Auth state
  - UI state (modals, tabs, layout)
  - Feature-wide filters/sorting
- Keep transient or per-component state in `useState()` or `useReducer()`

---

## ⚡ 3. **Selective State Subscription**
Use **Zustand selectors** to avoid unnecessary re-renders:

```ts
const isAuthenticated = useAuthStore(state => state.isAuthenticated);
```

Or extract multiple values via shallow comparison:

```ts
import { shallow } from 'zustand/shallow';

const { user, logout } = useAuthStore(state => ({
  user: state.user,
  logout: state.logout,
}), shallow);
```

---

## 💾 4. **Persistence**
Use the built-in `persist` middleware to store state in `localStorage`:

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      // methods...
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);
```

---

## 🔐 5. **Token & Auth Management**
- Store the token in `authStore` and sync it with Axios:

```ts
axios.defaults.headers.common.Authorization = `Bearer ${token}`;
```

- Clear token and state on logout:

```ts
logout: () => {
  set({ token: null, user: null, isAuthenticated: false });
  localStorage.removeItem('auth-storage');
}
```

---

## 🧪 6. **Type Safety with TypeScript**
- Define strong interfaces for each store:

```ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}
```

---

## 🚀 7. **Modularity & Reusability**
- Group related logic (e.g., auth actions) within the same store
- Avoid one monolithic store — create multiple stores as needed
- Compose stores using custom hooks if you want cross-store logic

---

## 🧰 9. **Debugging Tools**
Use Zustand Devtools in development:

```ts
import { devtools } from 'zustand/middleware';

const useAuthStore = create(
  devtools((set) => ({
    // your state
  }), { name: 'AuthStore' })
);
```

Use conditionally to avoid devtools in production.

---

## 🛑 10. **Avoid Pitfalls**
- Don’t mutate state directly — always use `set()`
- Don’t overstore unnecessary UI state globally
- Avoid async logic inside the store if it couples it too tightly to views — delegate to services when possible
