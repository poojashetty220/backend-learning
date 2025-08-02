
export interface Order {
  phone: string;
  email: string;
  gender: string;
  _id: string;
  id: string;
  total_amount: string;
  order_number: string;
  user_name?: string;
  user_id: string;
  created_at: string;
  user_info: object;
}

export interface OrderFormData {
  total_amount: string;
  order_number: string;
  user_name?: string;
  user_id: string;
}


