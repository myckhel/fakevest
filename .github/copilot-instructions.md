# ✅ Fakevest — Best Practices

These best practices are tailored for a project using **Laravel**, **Inertia.js (React + TypeScript)**, **TailwindCSS**, **Vite**, **Zustand**, **Yarn**, and **Ant Design (AntD)**. The goal is to maintain **scalability**, **performance**, **developer experience**, and **maintainability**.

---

## ✅ General Best Practices

### 1. **Maintain a Clean Architecture**
- **Backend (Laravel)**: Use the service-repository pattern for separation of concerns.
- **Frontend (React + TS)**: Write reusable, typed, composable components.
- Use **Inertia.js** strictly for page transitions and server-side props.

### 2. **Type Safety**
- Use TypeScript everywhere in the frontend (`*.tsx`, `*.ts`).
- Use `zod` or custom types/interfaces for shared shape validation (e.g., props from Laravel).

---

## 🧱 Laravel Best Practices

### 1. **Controllers & Services**
- Controllers should only delegate requests to services.
- Validate inputs via Form Request classes, not in controllers.

### 2. **Models**
- Define `fillable` properties explicitly.
- Use accessors/mutators to handle formatting logic (e.g., dates, currency).
- Use Eloquent relationships smartly for efficient querying.

### 3. **API & Routing**
- Use **API Resource classes** for clean API responses.
- Separate routes by concern (`routes/api.php`, `routes/web.php`, `routes/admin.php`).
- Use **versioning** if planning to support public APIs (`/api/v1/...`).

---

## ⚛️ Inertia + React + Zustand Best Practices

### 1. **Page & Component Structure**
- Organize files like:
  ```
  resources/ts/
  ├── Pages/
  ├── Components/
  ├── Layouts/
  ├── Stores/
  └── Hooks/
  ```
- Break down complex UI into small, testable components.

### 2. **State Management with Zustand**
- Use Zustand for **UI-level state** (modals, tabs, filters, etc.).
- Keep **persistent/auth state** centralized in one global store (`authStore.ts`).
- Avoid prop drilling — rely on Zustand and Inertia props smartly.

### 3. **Props & Data Handling**
- Use Inertia’s `usePage<T>()` with strong TypeScript types.
- Limit page-level props. Use shared props via `handleInertiaRequests()` middleware.

### 4. **Routing**
- Handle all routing via Laravel and Inertia. Avoid `react-router-dom`.

### 5. **Performance**
- Lazy load large components/pages with `React.lazy()` or dynamic imports.
- Use React’s `memo()` and Zustand selectors to avoid unnecessary re-renders.

---

## 🎨 TailwindCSS + Ant Design Best Practices

### 1. **UI Consistency**
- Use **AntD** for complex UI elements (modals, tables, dropdowns, inputs).
- Use **TailwindCSS** for layout, spacing, colors, and simple styling.
- Use `clsx` or `classnames` for clean dynamic className management.

### 2. **Theming**
- Configure Ant Design theme with Tailwind-friendly primary color: `#3b8cb7`.
- Apply theme via `ConfigProvider` at app level.

### 3. **Custom Components**
- Wrap AntD components with Tailwind when necessary (e.g., for spacing, layout).
- Reuse UI components (buttons, cards, forms) to avoid duplication.

---

## ⚡ Vite Best Practices

### 1. **Alias Setup**
```ts
// vite.config.ts
resolve: {
  alias: {
    '@': '/resources/ts',
  },
},
```

### 2. **Hot Module Reloading**
- Ensure `@vite` plugin is properly used in `app.blade.php`.
- Enable Fast Refresh for React in development.

### 3. **Environment Variables**
- Use `import.meta.env.VITE_*` for frontend envs.
- Never expose Laravel secrets to the frontend.

---

## 🛠 Dev & Deployment

### 1. **Testing**
- **Backend**: Write tests using **Pest** or **PHPUnit**.
- **Frontend**: Use **Jest**, **React Testing Library**, and **MSW** (for API mocking).
- Consider end-to-end tests using **Playwright** or **Cypress**.

### 2. **Linting & Formatting**
- Use:
  - **ESLint** with React/TS config
  - **Prettier** for formatting
  - **PHP CS Fixer** for Laravel
- Add **Husky** + **lint-staged** for pre-commit quality checks.

### 3. **CI/CD**
- Use GitHub Actions or similar CI tools to:
  - Run tests
  - Lint code
  - Deploy to staging/production environments

---

## 📈 Bonus Tips

- Use **React DevTools**, **Zustand Devtools**, and **Laravel Telescope** in development.
- Enable **dark mode** with Tailwind (`media` or `class`).
- Set up a robust error boundary + 404/403 pages.

---

# Copilot Instructions for Fakevest Frontend (TypeScript)

## 💼 Project Overview

Fakevest is a savings web app inspired by PiggyVest, enabling users to manage their money through **flex savings**, **lock savings**, and **target savings** features.

The backend is built with **Laravel**, and the frontend will be developed using:
- **Inertia.js**
- **React + TypeScript**
- **Tailwind CSS**
- **Ant Design (AntD)**

---

## ✅ Features to Build

### 👤 User Authentication & Profile
- [ ] User registration with avatar upload
- [ ] Login with email/password
- [ ] Social login (Google, Facebook, GitHub)
- [ ] Logout
- [ ] Get current user info via `/whoami`
- [ ] View and edit profile (fullname, phone, DOB, address, avatar)

### 💼 Savings Dashboard
- [ ] Fetch and display `/users/portfolio` data:
  - Lifetime savings
  - Balance changes and percentages
  - Monthly, yearly, weekly savings breakdown
  - Wallet vs savings distribution
  - Savings trend chart data

### 💰 Wallet
- [ ] Display wallet balance from `portfolio` response
- [ ] (Placeholder for future wallet funding and withdrawals)

### 🏦 Savings Modules (coming soon)
- [ ] Flex Savings (withdraw anytime)
- [ ] Lock Savings (fixed withdrawal date)
- [ ] Target Savings (goal-oriented)

---

## ⚙️ Tech Stack Guidelines

- **Language**: TypeScript
- **Router**: Inertia.js with React
- **UI**: Tailwind CSS for utility-first styling
- **Components**: Ant Design (v5+) for consistent UI/UX
- **Charting**: Ant Design Charts or Recharts
- **Theme Color**: `#3b8cb7` (primary brand color)

---

## 🗂 Project Structure

resources/ ├── ts/ │ ├── Pages/ │ │ ├── Auth/ │ │ │ ├── Login.tsx │ │ │ └── Register.tsx │ │ ├── Dashboard.tsx │ │ ├── Profile/ │ │ │ ├── View.tsx │ │ │ └── Edit.tsx │ │ └── Savings/ │ │ ├── Flex.tsx │ │ ├── Lock.tsx │ │ └── Target.tsx │ ├── Components/ │ │ ├── Navbar.tsx │ │ ├── Footer.tsx │ │ ├── AvatarUpload.tsx │ │ └── ChartCard.tsx │ ├── Layouts/ │ │ └── MainLayout.tsx │ └── App.tsx


---

## 🔑 Routes & Navigation

| Route             | Page          | Auth Required |
| ----------------- | ------------- | ------------- |
| `/login`          | LoginPage     | ❌             |
| `/register`       | RegisterPage  | ❌             |
| `/dashboard`      | DashboardPage | ✅             |
| `/profile`        | ProfileView   | ✅             |
| `/profile/edit`   | ProfileEdit   | ✅             |
| `/savings/flex`   | FlexSavings   | ✅             |
| `/savings/lock`   | LockSavings   | ✅             |
| `/savings/target` | TargetSavings | ✅             |

---

## 🔐 Auth Behavior

- All private routes should check for a valid auth token.
- Use `/whoami` to validate and fetch authenticated user.
- After login/registration, store token and set `Authorization: Bearer {token}` in request headers.

---

## 🔄 API Behavior

- Base URL: `{{url}}/api/v1`
- Format: JSON unless uploading images
- Avatar updates: Use `multipart/form-data`
- Use Axios or Inertia’s fetch helper with proper typing for requests

### Sample API Endpoints:

| Feature        | Method | URL                  |
| -------------- | ------ | -------------------- |
| Register       | POST   | `/register`          |
| Login          | POST   | `/login`             |
| WhoAmI         | GET    | `/whoami`            |
| Logout         | GET    | `/logout`            |
| Update Profile | PUT    | `/users/{id}`        |
| Update Avatar  | PUT    | `/users/{id}/avatar` |
| View Portfolio | GET    | `/users/portfolio`   |

---

## 📊 UI Notes

- Build responsive layouts with Tailwind’s utility classes
- Use AntD components like:
  - `Form`, `Input`, `Button`, `Upload`, `Modal`, `Tabs`, `Table`
- Use `antd` themes to align with primary color `#3b8cb7`
- Dashboard charts should use Recharts or Ant Design Charts
- Include loading states and error boundaries

---

## 📝 Misc Notes

- Start with Auth, then Dashboard + Portfolio
- Savings features can be stubbed for now until backend endpoints arrive
- Ensure accessibility and mobile-first UX
- Prefer local storage for storing auth token

---
