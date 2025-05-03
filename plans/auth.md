# 🔐 Fakevest Authentication Plan

## ✅ Overview

The authentication system supports:
- Email/password registration and login
- Social login (Google, Facebook, GitHub)
- Logout
- Token-based auth with expiration handling
- Password reset via email
- Profile update (including avatar)
- Zustand-managed auth state with persistence

---

## 📌 API Endpoints

| Feature            | Method | Endpoint             |
| ------------------ | ------ | -------------------- |
| Register           | POST   | `/register`          |
| Login              | POST   | `/login`             |
| Social Login       | POST   | `/login/social`      |
| Logout             | GET    | `/logout`            |
| Password Reset Req | POST   | `/forgot-password`   |
| Password Reset     | POST   | `/reset-password`    |
| Update Profile     | PUT    | `/users/{id}`        |
| Update Avatar      | PUT    | `/users/{id}/avatar` |

---

## 🔄 Auth Flows

### 1. **Registration**
- Fields: `name`, `email`, `password`, optional `avatar`
- On success:
  - Store returned token
  - Redirect to `/dashboard`

### 2. **Login (Email/Password)**
- Fields: `email`, `password`
- On success:
  - Store token
  - Redirect to `/dashboard`

### 3. **Social Login**
- Fields: `provider`, `access_token`
- On success:
  - Store token
  - Redirect to `/dashboard`

### 4. **Logout**
- Call `/logout`
- Clear token and auth state
- Redirect to `/login`

---

## 🔐 Token Expiration Handling

- Store access token in `localStorage` via Zustand
- Use Axios interceptor to:
  - Inject token in `Authorization` header
  - Detect `401 Unauthorized` responses and redirect to `/login`
- Optional: decode JWT if applicable to check for client-side expiry

---

## 🔑 Password Reset Flow

### Step 1: Request Reset Link
- Endpoint: `POST /forgot-password`
- Fields: `email`
- User receives a reset link via email

### Step 2: Reset Password
- Endpoint: `POST /reset-password`
- Fields: `email`, `token`, `password`, `password_confirmation`
- On success, optionally auto-login or redirect to `/login`

---

## 📋 Required Pages

| Route              | Description                      |
| ------------------ | -------------------------------- |
| `/login`           | Login form                       |
| `/register`        | Registration form                |
| `/forgot-password` | Request password reset link      |
| `/reset-password`  | Submit new password (with token) |
| `/dashboard`       | Post-login landing page          |
| `/profile`         | User profile view                |
| `/profile/edit`    | Profile and avatar update form   |

---

## 🧪 Validation & UX

- Use AntD form validation
- Display 422 server-side validation errors inline
- Global 401 handler: redirect to `/login`

---

## 🛡 Route Protection

- Guard private routes using middleware/layout check
- On missing or invalid token, redirect to `/login`

---

## ✅ Summary of Auth Features

| Feature             | Status |
| ------------------- | ------ |
| Email/Password Auth | ✅      |
| Social Login        | ✅      |
| Logout              | ✅      |
| Token Expiration    | ✅      |
| Password Reset      | ✅      |
| Profile Editing     | ✅      |
| Avatar Upload       | ✅      |
