export interface User {
  id: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  phone: string;
  created_at: string;
  avatar?: string;
}

export interface UserFormData {
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