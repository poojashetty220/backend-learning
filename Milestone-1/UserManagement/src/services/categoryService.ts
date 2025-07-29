/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Category } from '../types/post';

const API_URL = 'http://localhost:3001/api';

const mapCategory = (category: any): Category => ({
    id: category._id,
    name: category.name,
});

const token = localStorage.getItem('token');
const config = token
  ? { headers: { Authorization: `Bearer ${token}` } }
  : {};

export const categoryService = {
  getCategories: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`, config);
      const mappedCategories = data.map(mapCategory);
      return {
        categories: mappedCategories,
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  createCategory: async (category: { name: string }) => {
    try {
      const { data } = await axios.post(`${API_URL}/categories`, category, config);
      return data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  updateCategory: async (id: string, category: { name: string }) => {
    try {
      const { data } = await axios.put(`${API_URL}/categories/${id}`, category, config);
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },
};
