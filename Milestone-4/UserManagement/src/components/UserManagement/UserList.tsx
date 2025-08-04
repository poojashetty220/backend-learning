/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react';
import { User, SortField, SortDirection, Address } from '../../types/user';
import { userService } from '../../services/userService';
import moment from 'moment';
import AddressModal from './AddressModal';
import MultipleAddressesModal from './MultipleAddressesModal';
import UserOrdersModal from './UserOrdersModal';
import { orderService } from '../../services/orderService';
 

interface UserListProps {
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  refreshList?: boolean;
}

const UserList: React.FC<UserListProps> = ({
  onCreateUser,
  onEditUser,
  onViewUser,
  onDeleteUser,
  refreshList
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [tableLoading, setTableLoading] = useState(true);

  const [filters, setFilters] = useState<{
    search: string;
    min_age: string;
    city: string;
    sort_by: SortField;
    sort_order: SortDirection;
  }>({
    search: '',
    min_age: '',
    city: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  const [ageInput, setAgeInput] = useState('');
  const [cityInput, setCityInput] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [stats, setStats] = useState({ averageAge: 0, totalCount: 0 });

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // New state for multiple addresses modal
  const [multipleAddressesModalOpen, setMultipleAddressesModalOpen] = useState(false);
  const [usersWithMultipleAddresses, setUsersWithMultipleAddresses] = useState<User[]>([]);

  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [selectedUserOrders, setSelectedUserOrders] = useState<any[]>([]);
  const [selectedUserName, setSelectedUserName] = useState<string>('');

  // Removed duplicate states
  // const [multiAddressModalOpen, setMultiAddressModalOpen] = useState(false);
  // const [usersWithMultipleAddresses, setUsersWithMultipleAddresses] = useState<User[]>([]);

  const fetchUsers = async () => {
    setTableLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.min_age) params.append('min_age', filters.min_age);
      if (filters.city) params.append('city', filters.city);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);

      const { users: fetchedUsers, stats } = await userService.getUsers(`${params.toString()}`);
      setUsers(fetchedUsers);
      setStats(stats);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setTableLoading(false);
    }
  };

  // Handler to open multiple addresses modal
  const openMultipleAddressesModal = () => {
    const filteredUsers = users.filter(user => user.addresses && user.addresses.length > 1);
    setUsersWithMultipleAddresses(filteredUsers);
    setMultipleAddressesModalOpen(true);
  };

  // Handler to close multiple addresses modal
  const closeMultipleAddressesModal = () => {
    setUsersWithMultipleAddresses([]);
    setMultipleAddressesModalOpen(false);
  };

   const openOrdersModal = async (user: User) => {
    try {
      const orders = await orderService.getOrdersByUserId(user._id);
      setSelectedUserOrders(orders);
      setSelectedUserName(user.name);
      setOrdersModalOpen(true);
    } catch (error) {
      console.error('Error fetching orders for user:', error);
      alert('Failed to fetch orders for user. Please try again.');
    }
  };

   // Handler to close orders modal
 const closeOrdersModal = () => {
   setSelectedUserOrders([]);
   setSelectedUserName('');
   setOrdersModalOpen(false);
 };

  useEffect(() => {
    fetchUsers();
  }, [filters, refreshList]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }
  };

  const handleApplyFilter = () => {
    setFilters(prev => ({ ...prev, min_age: ageInput, city: cityInput }));
  };

  const handleClearFilter = () => {
    setFilters(prev => ({ ...prev, min_age: '', city: '' }));
    setAgeInput('');
    setCityInput('');
  };

  const handleSort = (field: SortField) => {
    setFilters(prev => ({
      ...prev,
      sort_by: field,
      sort_order:
        prev.sort_by === field
          ? prev.sort_order === 'asc'
            ? 'desc'
            : 'asc'
          : 'asc'
    }));
  };

  const filteredAndSortedUsers = useMemo(() => users, [users]);

  const openAddressModal = async (user: User) => {
    try {
      const addresses = await userService.getUserAddresses(user._id);
      setSelectedUser({ ...user, addresses });
      setAddressModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      alert('Failed to fetch addresses. Please try again.');
    }
  };

  const closeAddressModal = () => {
    setSelectedUser(null);
    setAddressModalOpen(false);
  };

  const handleSaveAddresses = async (addresses: Address[]) => {
    if (!selectedUser) return;
    try {
      const updatedUser = await userService.updateUser(selectedUser._id, {
        addresses
      });
      if (updatedUser) {
        setUsers(prevUsers =>
          prevUsers.map(u => (u._id === updatedUser._id ? updatedUser : u))
        );
      }
      closeAddressModal();
    } catch (error) {
      console.error('Failed to update addresses:', error);
      alert('Failed to update addresses. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <div className="flex gap-4">
          <button
            onClick={openMultipleAddressesModal}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            View Users with Multiple Addresses
          </button>
          <button
            onClick={onCreateUser}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            value={ageInput}
            maxLength={2}
            onChange={e => setAgeInput(e.target.value)}
            placeholder="Enter minimum age"
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={cityInput}
            onChange={e => setCityInput(e.target.value)}
            placeholder="Enter city"
            className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleApplyFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Apply Filter
          </button>
          {(filters.min_age || filters.city) && (
            <button
              onClick={handleClearFilter}
              className="text-sm text-blue-600 underline"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* Count */}
      {stats && (
        <div className="text-sm text-gray-600">
          Showing {stats.totalCount} users | Avg Age: {stats?.averageAge?.toFixed(1)}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Name <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500  tracking-wider">
                  Age
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  <button
                    onClick={() => handleSort('email')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Email <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  <button
                    onClick={() => handleSort('created_at')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Created <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  Addresses
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
                    {Array(8)
                      .fill('')
                      .map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </td>
                      ))}
                  </tr>
                ))
              ) : filteredAndSortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedUsers.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{user.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{user.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {moment(user.created_at).format('MMM D, YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    {user.addresses && user.addresses.length > 0
                      ? user.addresses.length
                      : 0}
                      &nbsp;
                      <button
                        onClick={() => openAddressModal(user)}
                        className="text-purple-600 hover:text-purple-900 underline text-sm"
                        title="View Addresses"
                      >
                        View
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => onEditUser(user)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteUser(user)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => openOrdersModal(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Orders"
                        >
                          🛒
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

      <AddressModal
        isOpen={addressModalOpen}
        onClose={closeAddressModal}
        addresses={selectedUser?.addresses || []}
        onSave={handleSaveAddresses}
      />

      <MultipleAddressesModal
        isOpen={multipleAddressesModalOpen}
        onClose={closeMultipleAddressesModal}
        users={usersWithMultipleAddresses}
      />

      <UserOrdersModal
        isOpen={ordersModalOpen}
        onClose={closeOrdersModal}
        userName={selectedUserName}
        orders={selectedUserOrders}
      />
    </div>
  );
};

export default UserList;