/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Post {
  _id: any;
  id: string;
  title: string;
  user_id: string;
  user_name: string;
  content: string;
  category: string;
  created_at: string;
}

export interface PostFormData {
  title: string;
  user_id: string;
  user_name: string;
  content: string;
  category: string;
}

export type SortField = 'title' | 'created_at';
export type SortDirection = 'asc' | 'desc';