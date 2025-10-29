const AUTH_URL = 'https://functions.poehali.dev/7cd4c987-d850-4867-95c2-a5909a9d3fcf';
const DONATIONS_URL = 'https://functions.poehali.dev/de392e14-c5dd-4cdc-8b0e-33f4d7719454';

const TOKEN_KEY = 'auth_token';

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface DonationStatus {
  donations: Array<{
    id: number;
    amount: number;
    status: string;
    created_at: string;
  }>;
  total: number;
  has_donated: boolean;
}

export const authService = {
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'register', email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'login', email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  },

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await fetch(AUTH_URL, {
        method: 'GET',
        headers: {
          'X-Auth-Token': token,
        },
      });

      if (!response.ok) {
        localStorage.removeItem(TOKEN_KEY);
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  async getDonationStatus(): Promise<DonationStatus> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(DONATIONS_URL, {
      method: 'GET',
      headers: {
        'X-Auth-Token': token,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get donation status');
    }

    return response.json();
  },

  async createDonation(amount: number): Promise<void> {
    const token = this.getToken();
    if (!token) throw new Error('Not authenticated');

    const response = await fetch(DONATIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Token': token,
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Donation failed');
    }
  },
};
