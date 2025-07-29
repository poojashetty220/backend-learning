/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Post, PostFormData } from '../types/post';

const API_URL = 'http://localhost:3001/api';

// Map MongoDB _id to id for frontend compatibility
const mapPost = (post: any): Post => ({
  id: post._id,
  title: post.title,
  content: post.content,
  categories: post.categories || [],
  created_at: post.created_at,
  user_id: post.user_id,
  user_name: post.user_name || '',
  _id: post._id || '',
  user_info: post.user_info || {}
});

const token = localStorage.getItem('token');
const config = token
  ? { headers: { Authorization: `Bearer ${token}` } }
  : {};

export const postService = {
  // Get all posts from MongoDB
  getPosts: async (filters: any): Promise<{ posts: Post[]; stats: { totalCount: number } }> => {
  try {
    const { data } = await axios.get(`${API_URL}/posts?page=1&${filters || ''}`, config);
    const mappedPosts = data.posts.map(mapPost);
    return {
      posts: mappedPosts,
      stats: data.stats
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], stats: { totalCount: 0 } };
  }
},

  // Create post
  createPost: async (userData: PostFormData): Promise<Post> => {
    try {
      const { data } = await axios.post(`${API_URL}/posts`, userData, config);
      return mapPost(data);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update post
  updatePost: async (id: string, userData: PostFormData): Promise<Post | null> => {
    try {
      const { data } = await axios.put(`${API_URL}/posts/${id}`, userData, config);
      return mapPost(data);
    } catch (error) {
      console.error('Error updating post:', error);
      return null;
    }
  },

  // Delete post
  deletePost: async (id: string): Promise<boolean> => {
    try {
      await axios.delete(`${API_URL}/posts/${id}`, config);
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  },

  // Get posts by category ID
  getPostsByCategoryId: async (categoryId: string): Promise<{ posts: Post[] }> => {
    try {
      const { data } = await axios.get(`${API_URL}/posts/category/${categoryId}`, config);
      const mappedPosts = data.posts.map(mapPost);
      return { posts: mappedPosts };
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      return { posts: [] };
    }
  }
};
