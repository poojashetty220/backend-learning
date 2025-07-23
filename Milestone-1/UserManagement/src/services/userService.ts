/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
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
  getUsers: async (min_age: number): Promise<User[]> => {
  try {
    const { data } = await axios.get(`${API_URL}/users?min_age=${min_age}`, {});
    return data.map(mapUser);
  } catch (error) {
    console.error('Error fetching users by min age:', error);
    return [];
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

  // Get raw database contents from a collection (debug endpoint)
  getDebugCollection: async (collection: string): Promise<any[]> => {
    try {
      const { data } = await axios.get(`${API_URL}/debug/${collection}`);
      return data;
    } catch (error) {
      console.error(`Error fetching from ${collection}:`, error);
      return [];
    }
  },

  // Get user by ID
  getUserById: async (id: string): Promise<User | null> => {
    try {
      const { data } = await axios.get(`${API_URL}/users/${id}`);
      return mapUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
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
