import React from "react";
import { useIsAuthenticated, useIsEmailVerified } from "@/Stores/authStore";
import { router } from "@inertiajs/react";

interface AuthMiddlewareProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireVerified?: boolean;
  redirectAuthenticatedTo?: string;
}

/**
 * A middleware component to handle authentication and verification redirects
 *
 * @param children The components to render if conditions are met
 * @param requireAuth If true, redirects to login if not authenticated
 * @param requireVerified If true, redirects to email verification if not verified
 * @param redirectAuthenticatedTo If set, redirects authenticated users to the specified path
 */
const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({
  children,
  requireAuth = false,
  requireVerified = false,
  redirectAuthenticatedTo,
}) => {
  const isAuthenticated = useIsAuthenticated();
  const isEmailVerified = useIsEmailVerified();

  // Handle redirection
  if (redirectAuthenticatedTo && isAuthenticated) {
    router.visit(redirectAuthenticatedTo);
    return null;
  }

  if (requireAuth && !isAuthenticated) {
    router.visit("/login");
    return null;
  }

  if (requireAuth && requireVerified && !isEmailVerified) {
    router.visit("/email/verify");
    return null;
  }

  return <>{children}</>;
};

export default AuthMiddleware;
