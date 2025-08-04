/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface User {
  [x: string]: string | number | readonly string[] | Address[] | undefined;
  _id: string;  // changed from any to string for consistency
  id: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  phone: string;
  created_at: string;
  password?: string; // Optional for edit scenarios
  addresses?: Address[];
}

export interface UserFormData {
  password?: string;  // changed to string only and optional
  name: string;
  email: string;
  age: string;
  gender: string;
  phone: string;
  addresses?: Address[];
  pageAccess?: string[];
}

export interface UserFilters {
  gender?: string;
}

export type SortField = 'name' | 'email' | 'age' | 'gender' | 'created_at';
export type SortDirection = 'asc' | 'desc';