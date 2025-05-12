import { router } from '@inertiajs/react';

/**
 * Utility functions for handling API requests with Inertia router
 * Ensures all API requests use the correct base path: /api/v1
 */

/**
 * Make a GET request to the API using Inertia router
 * @param endpoint API endpoint without the /api/v1 prefix
 * @param options Additional Inertia visit options
 */
export const apiGet = (endpoint: string, options = {}) => {
  const url = `/api/v1/${endpoint.replace(/^\//, '')}`;
  return router.get(
    url,
    {},
    {
      preserveState: true,
      ...options,
    },
  );
};

/**
 * Make a POST request to the API using Inertia router
 * @param endpoint API endpoint without the /api/v1 prefix
 * @param data Request payload
 * @param options Additional Inertia visit options
 */
export const apiPost = (endpoint: string, data = {}, options = {}) => {
  const url = `/api/v1/${endpoint.replace(/^\//, '')}`;
  return router.post(url, data, {
    preserveState: true,
    ...options,
  });
};

/**
 * Make a PUT request to the API using Inertia router
 * @param endpoint API endpoint without the /api/v1 prefix
 * @param data Request payload
 * @param options Additional Inertia visit options
 */
export const apiPut = (endpoint: string, data = {}, options = {}) => {
  const url = `/api/v1/${endpoint.replace(/^\//, '')}`;
  return router.put(url, data, {
    preserveState: true,
    ...options,
  });
};

/**
 * Make a PATCH request to the API using Inertia router
 * @param endpoint API endpoint without the /api/v1 prefix
 * @param data Request payload
 * @param options Additional Inertia visit options
 */
export const apiPatch = (endpoint: string, data = {}, options = {}) => {
  const url = `/api/v1/${endpoint.replace(/^\//, '')}`;
  return router.patch(url, data, {
    preserveState: true,
    ...options,
  });
};

/**
 * Make a DELETE request to the API using Inertia router
 * @param endpoint API endpoint without the /api/v1 prefix
 * @param options Additional Inertia visit options
 */
export const apiDelete = (endpoint: string, options = {}) => {
  const url = `/api/v1/${endpoint.replace(/^\//, '')}`;
  return router.delete(url, {
    preserveState: true,
    ...options,
  });
};

/**
 * The complete API utility object
 */
export const inertiaApi = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  patch: apiPatch,
  delete: apiDelete,
};

export default inertiaApi;
