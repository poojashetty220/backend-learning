/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Always get fresh token
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
};

export const orderService = {
  getOrders: async (page = 1, limit = 10): Promise<any> => {
    try {
      const { data } = await axios.get(`${API_URL}/orders?page=${page}&limit=${limit}`, getAuthConfig());
      return {
        orders: data.orders,
        stats: data.stats
      };
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      return { orders: [], stats: { totalCount: 0, currentPage: 1, totalPages: 0, hasNextPage: false, hasPrevPage: false } };
    }
  },

  createOrder: async (orderData: any): Promise<any> => {
    try {
      const { data } = await axios.post(`${API_URL}/orders`, orderData, getAuthConfig());
      return data;
    } catch (error) {
      console.error('❌ Error creating order:', error);
      throw error;
    }
  },

  updateOrder: async (id: string, orderData: any): Promise<any> => {
    try {
      const { data } = await axios.patch(`${API_URL}/orders/${id}`, orderData, getAuthConfig());
      return data;
    } catch (error) {
      console.error(`❌ Error updating order ${id}:`, error);
      throw error;
    }
  },

  getOrdersByUserId: async (userId: string): Promise<any[]> => {
    try {
      const { data } = await axios.get(`${API_URL}/orders/user/${userId}`, getAuthConfig());
      return data;
    } catch (error) {
      console.error(`❌ Error fetching orders for user ${userId}:`, error);
      return [];
    }
  }
};
