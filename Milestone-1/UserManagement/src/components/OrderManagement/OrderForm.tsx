import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Order, OrderFormData } from '../../types/order';
import { orderService } from '../../services/orderService';
import { userService } from '../../services/userService';

interface OrderFormProps {
  order?: Order | null;
  onSave: (order: Order) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, onSave, onCancel }) => {
  const [formData, setFormData] = useState<OrderFormData>({
    order_number: '',
    total_amount: '',
    user_id: '',
    user_name: '',
  });
  const [errors, setErrors] = useState<Partial<OrderFormData>>({});
  const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<{ _id: string; name: string }[]>([]);
  
    const fetchUsers = async () => {
      try {
        const { users: fetchedUsers } = await userService.getUsers('');
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

  useEffect(() => {
    if (order) {
      setFormData({
        order_number: order.order_number,
        total_amount: order.total_amount,
        user_id: order.user_id,
        user_name: order.user_name,
      });
    }
    fetchUsers();
  }, [order]);

  const validateForm = (): boolean => {
    const newErrors: Partial<OrderFormData> = {};

    if (!formData.order_number.trim()) {
      newErrors.order_number = 'Order Number is required';
    }

    if (!formData.total_amount.trim()) {
      newErrors.total_amount = 'Total Amount is required';
    }

     if (!formData.user_id.trim()) {
      newErrors.user_id = 'User is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      let savedOrder: Order | null;
      
      if (order) {
        savedOrder = await orderService.updateOrder(order._id, formData);
      } else {
        savedOrder = await orderService.createOrder(formData);
      }

      if (savedOrder) {
        onSave(savedOrder);
      }
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {order ? 'Edit Order' : 'Create New Order'}
          </h1>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="order_number" className="block text-sm font-medium text-gray-700 mb-2">
                Order Number *
              </label>
              <input
                type="text"
                id="order_number"
                value={formData.order_number}
                onChange={(e) => handleInputChange('order_number', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.order_number ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter order number"
              />
              {errors.order_number && (
                <p className="mt-1 text-sm text-red-600">{errors.order_number}</p>
              )}
            </div>

            <div>
              <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700 mb-2">
                Total Amount *
              </label>
              <input
                type="text"
                id="total_amount"
                name='total_amount'
                value={formData.total_amount}
                onChange={(e) => handleInputChange('total_amount', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.total_amount ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter total amount"
              />
              {errors.total_amount && (
                <p className="mt-1 text-sm text-red-600">{errors.total_amount}</p>
              )}
            </div>
          </div>

          <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                User *
              </label>
              <select
                id="author"
                value={formData.user_id}
                onChange={(e) => {
                  const selectedUserId = e.target.value;
                  const selectedUser = users.find((user) => user._id === selectedUserId);
                  handleInputChange('user_id', selectedUserId);
                  handleInputChange('user_name', selectedUser?.name || '');
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.user_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select author</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {errors.user_id && <p className="mt-1 text-sm text-red-600">{errors.user_id}</p>}
            </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save size={16} />
              )}
              {loading ? 'Saving...' : (order ? 'Update Order' : 'Create Order')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;