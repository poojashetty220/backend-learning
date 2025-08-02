/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit } from 'lucide-react';
import { Order } from '../../types/order';
import { orderService } from '../../services/orderService';
import moment from 'moment';

interface OrderListProps {
  onCreateOrder: () => void;
  onEditOrder: (order: Order) => void;
  refreshList?: boolean;
}

const OrderList: React.FC<OrderListProps> = ({
  onCreateOrder,
  onEditOrder,
  refreshList
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tableLoading, setTableLoading] = useState(true);

  const [stats, setStats] = useState({ averageAge: 0, totalCount: 0 });

  const fetchOrders = async () => {
    setTableLoading(true);
    try {

      const response = await orderService.getOrders();
      const fetchedOrders = response.orders || [];
      const stats = response.stats || { totalCount: 0, averageAge: 0 };
      setOrders(fetchedOrders);
      setStats(stats);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [refreshList]);

  const filteredAndSortedOrders = useMemo(() => orders, [orders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <div className="flex gap-4">
          <button
            onClick={onCreateOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Add Order
          </button>
        </div>
      </div>

      {/* Count */}
      {stats && (
        <div className="text-sm text-gray-600">
          Showing {stats.totalCount} orders
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                    Order Number
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500  tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  User Email
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  User Phone
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array(6)
                      .fill('')
                      .map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </td>
                      ))}
                  </tr>
                ))
              ) : filteredAndSortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedOrders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{order.order_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.total_amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{(order.user_info as any)?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{(order.user_info as any)?.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{(order.user_info as any)?.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {moment(order.created_at).format('MMM D, YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditOrder(order)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
