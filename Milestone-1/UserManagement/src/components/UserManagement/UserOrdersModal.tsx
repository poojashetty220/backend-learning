import React from 'react';

interface Order {
  _id: string;
  order_number: string;
  total_amount: number;
}

interface UserOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  orders: Order[];
}

const UserOrdersModal: React.FC<UserOrdersModalProps> = ({ isOpen, onClose, userName, orders }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 !m-0">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Orders for {userName}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-bold text-xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        {orders.length === 0 ? (
          <p>No orders found for this user.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Order Number</th>
                <th className="border-b px-4 py-2">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="hover:bg-gray-100">
                  <td className="border-b px-4 py-2">{order.order_number}</td>
                  <td className="border-b px-4 py-2">${(parseInt(order.total_amount)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserOrdersModal;
