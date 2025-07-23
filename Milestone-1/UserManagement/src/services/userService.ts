import { User, UserFormData } from '../types/user';

const API_URL = 'http://localhost:3001/api';

// Map MongoDB _id to id for frontend compatibility
const mapUser = (user: any): User => ({
  id: user._id,
  name: user.name,
  email: user.email,
  age: user.age,
  gender: user.gender,
  phone: user.phone,
  created_at: user.created_at,
  avatar: user.avatar || 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
});

export const userService = {
  // Get all users from MongoDB
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      return data.map(mapUser);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Get available collections
  getCollections: async (): Promise<string[]> => {
    try {
      const response = await fetch(`${API_URL}/collections`);
      if (!response.ok) throw new Error('Failed to fetch collections');
      return await response.json();
    } catch (error) {
      console.error('Error fetching collections:', error);
      return [];
    }
  },
  
  // Get raw database contents from a collection (debug endpoint)
  getDebugCollection: async (collection: string): Promise<any[]> => {
    try {
      const response = await fetch(`${API_URL}/debug/${collection}`);
      if (!response.ok) throw new Error(`Failed to fetch from ${collection}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from ${collection}:`, error);
      return [];
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`);
      if (!response.ok) return null;
      const data = await response.json();
      return mapUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  },

  // Create user
  createUser: async (userData: UserFormData): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) throw new Error('Failed to create user');
      const data = await response.json();
      return mapUser(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, userData: UserFormData): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) return null;
      const data = await response.json();
      return mapUser(data);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE'
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
};