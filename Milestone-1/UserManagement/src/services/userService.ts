/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { User, UserFormData } from '../types/user';

const API_URL = 'http://localhost:3001/api';

// Map MongoDB _id to id for frontend compatibility
const mapUser = (user: any): User => ({
  name: user.name,
  email: user.email,
  age: user.age,
  gender: user.gender,
  phone: user.phone,
  created_at: user.created_at,
  _id: undefined,
  id: ''
});

export const userService = {
  // Get all users from MongoDB
  getUsers: async (filters: any): Promise<{ users: User[]; stats: { averageAge: number; totalCount: number } }> => {
  try {
    const { data } = await axios.get(`${API_URL}/users?page=1${filters ? `&${filters}` : ''}`, {});
    const mappedUsers = data.users.map(mapUser);
    return {
      users: mappedUsers,
      stats: data.stats
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], stats: { averageAge: 0, totalCount: 0 } };
  }
},

  // Get available collections
  getCollections: async (): Promise<string[]> => {
    try {
      const { data } = await axios.get(`${API_URL}/collections`);
      return data;
    } catch (error) {
      console.error('Error fetching collections:', error);
      return [];
    }
  },

  // Create user
  createUser: async (userData: UserFormData): Promise<User> => {
    try {
      const { data } = await axios.post(`${API_URL}/users`, userData);
      return mapUser(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: string, userData: UserFormData): Promise<User | null> => {
    try {
      const { data } = await axios.put(`${API_URL}/users/${id}`, userData);
      return mapUser(data);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
};
