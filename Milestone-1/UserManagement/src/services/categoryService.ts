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
  getCategories: async (page = 1, limit = 10) => {
    try {
      const { data } = await axios.get(`${API_URL}/categories?page=${page}&limit=${limit}`, config);
      const mappedCategories = data.categories.map(mapCategory);
      return {
        categories: mappedCategories,
        stats: data.stats
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { categories: [], stats: { totalCount: 0, currentPage: 1, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
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
      const { data } = await axios.patch(`${API_URL}/categories/${id}`, category, config);
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },
};
