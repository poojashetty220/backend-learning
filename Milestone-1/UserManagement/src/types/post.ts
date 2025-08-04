/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Category {
  id: string;
  name: string;
}

export interface Post {
  user_info: any;
  _id: any;
  id: string;
  title: string;
  user_id: string;
  user_name: string;
  content: string;
  categories: Category[];
  created_at: string;
}

export interface PostFormData {
  title: string;
  user_id: string;
  user_name?: string;
  content: string;
  categories: string[]; // array of category IDs
}

export type SortField = 'title' | 'created_at';
export type SortDirection = 'asc' | 'desc';
