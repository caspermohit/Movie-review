const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5001/api';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to register');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error('Registration API error:', error);
    
    // Check if it's a network error (fetch will throw TypeError for network issues)
    if (error instanceof TypeError) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection or try again later.');
    }
    
    // Re-throw the original error if it's already an Error instance
    if (error instanceof Error) {
      throw error;
    }
    
    // Fallback for unknown errors
    throw new Error('An unexpected error occurred during registration');
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to login');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  } catch (error) {
    console.error('Login API error:', error);
    
    // Check if it's a network error (fetch will throw TypeError for network issues)
    if (error instanceof TypeError) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection or try again later.');
    }
    
    // Re-throw the original error if it's already an Error instance
    if (error instanceof Error) {
      throw error;
    }
    
    // Fallback for unknown errors
    throw new Error('An unexpected error occurred during login');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
}; 