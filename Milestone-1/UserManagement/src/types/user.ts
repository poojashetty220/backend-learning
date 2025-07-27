/* eslint-disable @typescript-eslint/no-explicit-any */

export interface User {
  [x: string]: string | number | readonly string[] | undefined;
  _id: any;
  id: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  phone: string;
  created_at: string;
  password?: string; // Optional for edit scenarios
}

export interface UserFormData {
  password: string | number | readonly string[] | undefined;
  name: string;
  email: string;
  age: string;
  gender: string;
  phone: string;
}

export interface UserFilters {
  gender?: string;
}

export type SortField = 'name' | 'email' | 'age' | 'gender' | 'created_at';
export type SortDirection = 'asc' | 'desc';