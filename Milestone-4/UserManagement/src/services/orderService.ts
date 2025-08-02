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
  getOrders: async (): Promise<any> => {
    try {
      const { data } = await axios.get(`${API_URL}/orders`, getAuthConfig());
      // Return object with orders array and stats
      return {
        orders: data,
        stats: {
          totalCount: data.length,
          averageAge: 0 // Placeholder, calculate if needed
        }
      };
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      return { orders: [], stats: { totalCount: 0, averageAge: 0 } };
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
      const { data } = await axios.put(`${API_URL}/orders/${id}`, orderData, getAuthConfig());
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
