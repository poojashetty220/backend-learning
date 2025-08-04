/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { User, UserFormData, Address } from '../types/user';

const API_URL = 'http://localhost:3001/api';

const mapUser = (user: any): User => ({
  name: user.name,
  email: user.email,
  age: user.age,
  gender: user.gender,
  phone: user.phone,
  created_at: user.created_at,
  _id: user._id,
  id: '',
  addresses: user.addresses || [],
  pageAccess: user.pageAccess || [],

});

const token = localStorage.getItem('token');
const config = token
  ? { headers: { Authorization: `Bearer ${token}` } }
  : {};

export const userService = {
  // Get all users from MongoDB
  getUsers: async (filters: any): Promise<{ users: User[]; stats: { averageAge: number; totalCount: number } }> => {
    try {
      const { data } = await axios.get(`${API_URL}/users?page=1${filters ? `&${filters}` : ''}`, config);
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
  // Create user
  createUser: async (userData: UserFormData): Promise<User> => {
    try {
      const { data } = await axios.post(`${API_URL}/users`, userData, config);
      return mapUser(data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (_id: string, userData: UserFormData): Promise<User | null> => {
    try {
      const { data } = await axios.put(`${API_URL}/users/${_id}`, userData, config);
      return mapUser(data);
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  },

  // Delete user
  deleteUser: async (_id: string): Promise<boolean> => {
    try {
      await axios.delete(`${API_URL}/users/${_id}`, config);
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  },

  // Login user
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      const { data } = await axios.post(`${API_URL}/users/login`, { email, password });
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // New method to get addresses for a user
  getUserAddresses: async (userId: string): Promise<Address[]> => {
    try {
      const { data } = await axios.get(`${API_URL}/users/${userId}/addresses`, config);
      return data.addresses || [];
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      return [];
    }
  }
};
