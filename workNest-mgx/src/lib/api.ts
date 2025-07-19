import { ApiResponse } from '@/types';

// Base URLs for each service
const API_URLS = {
  client: 'http://localhost:5001/api',
  developer: 'http://localhost:5002/api',
  admin: 'http://localhost:5003/api'
};

// Get the appropriate base URL based on user role
const getBaseUrl = (role?: string): string => {
  if (role === 'admin') {
    return API_URLS.admin;
  } else if (role === 'developer') {
    return API_URLS.developer;
  }
  return API_URLS.client; // Default to client API
};

// Generic fetch function with authentication and error handling
export async function fetchApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  role?: string
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token');
  const baseUrl = getBaseUrl(role || localStorage.getItem('userRole') || undefined);
  const url = `${baseUrl}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${url}):`, error);
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong';
    return {
      success: false,
      message: errorMessage,
    };
  }
}

// Helper methods for common HTTP methods
export const api = {
  get: <T = unknown>(endpoint: string, role?: string) => 
    fetchApi<T>(endpoint, { method: 'GET' }, role),
  
  post: <T = unknown>(endpoint: string, data: Record<string, unknown>, role?: string) => 
    fetchApi<T>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }, role),
  
  put: <T = unknown>(endpoint: string, data: Record<string, unknown>, role?: string) => 
    fetchApi<T>(endpoint, { 
      method: 'PUT', 
      body: JSON.stringify(data) 
    }, role),
  
  delete: <T = unknown>(endpoint: string, role?: string) => 
    fetchApi<T>(endpoint, { method: 'DELETE' }, role),
  
  upload: <T = unknown>(endpoint: string, formData: FormData, role?: string) => {
    const token = localStorage.getItem('token');
    const baseUrl = getBaseUrl(role || localStorage.getItem('userRole') || undefined);
    const url = `${baseUrl}${endpoint}`;
    
    return fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        throw new Error(data.message || 'Upload failed');
      }
      return data as ApiResponse<T>;
    })
    .catch(error => {
      console.error(`Upload Error (${url}):`, error);
      return {
        success: false,
        message: error.message || 'Upload failed',
      };
    });
  }
};