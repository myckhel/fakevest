# ✅ Fakevest — Copilot Instructions

## 🔍 Overview

**Fakevest** is a modern piggybank app inspired by PiggyVest. It empowers users to **manage and grow their finances** with automated savings, fixed goals, flexible withdrawal options, and investment opportunities. Designed for real-life financial enhancement, Fakevest encourages financial discipline through intuitive design and strong backend architecture.

---

## 🛠 Stack

- **Laravel v12** (API backend)
- **Inertia.js** (React + TypeScript adapter)
- **React + TypeScript**
- **Tailwind CSS**
- **Ant Design (AntD)**
- **Zustand** (state management)
- **Vite**
- **Yarn**
- **Artisan CLI**

---

## 🧱 Backend (Laravel)

### Architecture & Best Practices
- Keep **Controllers slim** – delegate logic to **Service classes**
- Validate with **Form Requests**
- Format API output with **API Resources**
- Use **Events**, **Observers**, and **Listeners** for side effects
- Send **Notifications** for user-facing alerts (email, SMS, etc.)
- Queue background tasks via **Jobs** (e.g., savings automation, notifications)
- Use **Policy** classes for authorization
- Maintain clean route separation: `api.php`, `web.php`, `admin.php`
- Version APIs (e.g., `/api/v1/...`)
- Support **token expiration** and **password reset** via Laravel Auth features
- Schedule tasks using **Custom Artisan Commands**

---

## ⚛️ Frontend (Inertia + React + Zustand)

### Directory Structure
```
resources/js/
├── Pages/
├── Components/
│   ├── Shared/
│   └── Features/
├── Layouts/
├── Stores/
├── Hooks/
├── Apis/
├── Utils/   ← utility functions
└── App.tsx
```

---

### Routing
- Use Laravel routes + `@inertiajs/react`'s `<Link>` or `router.visit`
- **Avoid** React Router and `react-router-dom`

---

### Props & State Management

#### General
- Use `usePage<T>()` for typed Inertia props
- Use **Zustand only** for **shared global UI state** (e.g., auth, modals, sidebar)
- Prefer **local component state** for isolated feature behavior
- Scope API calls or data fetching, form states, and side effects within feature components

#### Feature Component Encapsulation
- Abstract full workflows in domain-based components:
  - `Features/Savings/CreateForm.tsx`
  - `Features/Withdrawals/RequestModal.tsx`
- Encapsulate:
  - internal state (form, modals)
  - validation
  - API requests
  - submission
  - success handlers

```tsx
// GOOD
<Savings.CreateForm onSuccess={refetchList} />

// AVOID
<Savings.CreateForm form={form} loading={loading} onSubmit={handleSubmit} />
```

---

### Performance
- Use `useCallback`, `useMemo`, and `React.memo` to reduce re-renders
- Use Zustand **selectors** to limit subscriptions
- Virtualize long lists with `react-virtual`
- Avoid prop drilling and anonymous functions in JSX

---

### Abstractions

#### Utility Functions
- Extract reusable logic to `/Utils`
  - e.g., `formatCurrency`, `parseDate`, `generateUUID`, `copyToClipboard`
- Keep functions **pure** and **well-tested**
- Avoid inline helpers inside components

#### API & Services
- Centralize external API logic inside `/Apis/` or custom hooks (`/Hooks`)

---

## 🎨 UI (TailwindCSS + AntD)

### UI Guidelines
- Use **AntD** for inputs, forms, modals, tables
- Use **Tailwind** for layout, spacing, color utility
- Combine styles using `clsx` or `classnames`

### Theming
- Set AntD **primary color** to `#3b8cb7`
- Use AntD's `ConfigProvider` at root level for consistent theming
- Use tailwindcss dark mode features without manually accesing dark mode variable

---

## ⚡ Vite

```ts
// vite.config.ts
resolve: {
  alias: {
    '@': '/resources/js',
  },
}
```

---

## 🧠 Copilot Smart Notes

- Use Laravel’s built-in features **intelligently**:
  - Events for decoupling logic
  - Notifications for alerts
  - Observers for model lifecycle hooks
  - Policies for permission enforcement
- On the frontend:
  - Avoid unnecessary global state
  - Keep feature logic self-contained
  - Use `/Utils/` for reusable utility functions
  - Use `/Apis/` and `/Hooks/` for consistent API and async logic
- Prioritize **clarity**, **cohesion**, and **maintainability**
