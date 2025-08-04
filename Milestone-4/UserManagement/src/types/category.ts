/* eslint-disable @typescript-eslint/no-explicit-any */

export interface Category {
  _id: string;
  name: string;
  created_at?: string;
}

export interface CategoryFormData {
    name: string;
}
