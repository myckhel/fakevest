Fakevest

Here are best practices tailored for a project using **Laravel**, **Inertia.js (React adapter)**, **TailwindCSS**, **Vite**, and **Refine**. These practices aim to maintain scalability, performance, developer experience, and maintainability.

---

## ✅ General Best Practices

### 1. **Keep a Clean Architecture**
- **Backend (Laravel)**: Use a service-repository pattern for complex logic.
- **Frontend (React)**: Use composable and reusable components.
- Use **Inertia** only for top-level routing and props, not for deeply nested communication.

---

## 🧱 Laravel Best Practices

### 1. **Controllers**
- Keep controllers slim — delegate business logic to Services.
- Use Form Request classes for validation.
- Group routes and use route names for clarity.

### 2. **Models**
- Use accessors/mutators for attribute transformations.
- Always define `fillable` or `guarded` properties.
- Use Laravel Eloquent relationships effectively for clear data access.

### 3. **API & Routing**
- Prefer **resource routes** and **API Resources** when exposing data.
- Keep route files organized by feature (`routes/admin.php`, `routes/api.php`, etc.)

---

## ⚛️ Inertia + React Best Practices

### 1. **Page Structure**
- Place all React pages under `resources/js/Pages`.
- Structure components inside `resources/js/Components`, `Layouts`, and possibly `Hooks`.

### 2. **Props Management**
- Avoid deeply nested props — use shared props via `handleInertiaRequests()` middleware.
- Use Inertia’s `usePage()` hook wisely to extract props.

### 3. **Code Splitting**
- Lazy load pages/components where possible using `React.lazy()` or dynamic imports.

### 4. **Routing**
- Use Laravel for top-level routing only.
- Avoid client-side routing libraries like `react-router-dom` — Inertia handles this.

---

## 🎨 Tailwind CSS Best Practices

### 1. **Atomic Classes**
- Favor utility classes over custom styles unless necessary.
- Use `@apply` in component-scoped CSS for repeated style patterns.

### 2. **Componentization**
- Wrap common layouts (cards, modals, etc.) into React components and reuse.

### 3. **Dark Mode / Themes**
- Configure and support dark mode in your `tailwind.config.js` (`media` or `class`).

---

## ⚡ Vite Best Practices

### 1. **Alias & Imports**
- Configure aliases in `vite.config.js` to simplify imports:
  ```js
  resolve: {
    alias: {
      '@': '/resources/ts',
    },
  },
  ```

### 2. **Hot Reload**
- Ensure Vite is set up properly with Inertia so hot reload works for both Laravel and React changes.

### 3. **Env Variables**
- Use `.env` and `import.meta.env` safely — never expose sensitive backend envs to frontend.

---

## 🧠 Refine Integration Best Practices

### 1. **RouterProvider**
- Use `@refinedev/inertia-router` to bridge Laravel routes with Refine’s router.

### 2. **Access Control**
- Define access policies in Laravel, then reflect those as permissions in Refine with `canAccess()` or `accessControlProvider`.

### 3. **Data Provider**
- Connect a custom dataProvider to your Laravel API endpoints.
- Handle pagination, filtering, and sorting using query parameters consistently.

### 4. **Theming**
- TailwindCSS is not used out-of-the-box in Refine — use `Refine` with a custom layout and Tailwind styles for consistency.

---

## 🛠 Dev & Deployment Practices

### 1. **Testing**
- Write **Pest** or **PHPUnit** tests for backend logic.
- Use **Jest**/**React Testing Library** for front-end unit/component tests.

### 2. **Linting & Formatting**
- Use **ESLint**, **Prettier**, and **PHP CS Fixer**.
- Add hooks with **Husky** to enforce quality before commit.

### 3. **CI/CD**
- Set up GitHub Actions or another CI to run tests, lint, and deploy automatically.

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
