# ✅ Fakevest — Copilot Instructions

## 🔍 Overview

**Fakevest** is a modern piggybank app inspired by PiggyVest. It empowers users to **manage and grow their finances** with automated savings, fixed goals, flexible withdrawal options, and investment opportunities. Designed for real-life financial enhancement, Fakevest encourages financial discipline through intuitive design and strong backend architecture.

## 🏦 Savings Plans

- **PiggyBank:** Flexible savings on your terms. Save manually or automatically, no rules. Save daily, weekly, monthly or yearly with no limits. Interests up to 17.5% p.a.

  - `interest`: 17.5
  - `minDays`: 0
  - `breakable`: true
  - `icon`: `/assets/img/plans/piggy.png`
  - `colors`: `['#CDE6F2', '#61A7C7']`

- **Vault:** Lock funds for a period of time with no access to it. Terms: minimum of 1 month and maximum 1 year. Returns up to 30% p.a.

  - `interest`: 30
  - `minDays`: 5
  - `breakable`: false
  - `icon`: `/assets/img/plans/vault.png`
  - `colors`: `['#D1D1D1', '#B5B5B5', '#696969']`

- **Goals:** Create, explore and smash your goals. Returns up to 12.5% p.a.

  - `interest`: 12.5
  - `minDays`: 0
  - `breakable`: true
  - `icon`: `/assets/img/plans/goals.png`
  - `colors`: `['#C9DECC', '#CDEFD1']`

- **Challenge:** Create or join a saving Challenge, and see yourself perform better.
  - `interest`: 0
  - `minDays`: 0
  - `breakable`: true
  - `icon`: `/assets/img/plans/challenge.png`
  - `colors`: `['#D4D2E7', '#CDC9F7']`

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

### Routing

- Use Laravel routes + `@inertiajs/react`'s `<Link>` or `router.visit`
- **Avoid** React Router and `react-router-dom`

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

### Performance

- Use `useCallback`, `useMemo`, and `React.memo` to reduce re-renders
- Use Zustand **selectors** to limit subscriptions
- Virtualize long lists with `react-virtual`
- Avoid prop drilling and anonymous functions in JSX

### Abstractions

#### Utility Functions

- Extract reusable logic to `/Utils`
  - e.g., `formatCurrency`, `parseDate`, `generateUUID`, `copyToClipboard`
- Keep functions **pure** and **well-tested**
- Avoid inline helpers inside components

#### API & Services

- Centralize external API logic inside `/Apis/` or custom hooks (`/Hooks`)

## 🎨 UI (TailwindCSS + AntD)

### UI Guidelines

- Use **AntD** for inputs, forms, modals, tables
- Use **Tailwind** for layout, spacing, color utility
- Combine styles using `clsx` or `classnames`

### Theming

- Set AntD **primary color** to `#3b8cb7`
- Use AntD's `ConfigProvider` at root level for consistent theming
- Use tailwindcss dark mode features without manually accesing dark mode variable

## ⚡ Vite

```ts
// vite.config.ts
resolve: {
  alias: {
    '@': '/resources/js',
  },
}
```

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
  - read the postman api doc if needed at path `docs/postman/FakeVest.postman_collection.json`
- Prioritize **clarity**, **consistency**, **cohesion**, and **maintainability**
