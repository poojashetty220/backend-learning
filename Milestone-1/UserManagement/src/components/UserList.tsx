/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react';
import { User, SortField, SortDirection } from '../types/user';
import { userService } from '../services/userService';
import moment from 'moment';

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
    sort_by: SortField;
    sort_order: SortDirection;
  }>({
    search: '',
    min_age: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  const [ageInput, setAgeInput] = useState('');

  const [searchInput, setSearchInput] = useState('');

const fetchUsers = async () => {
  setTableLoading(true);
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search); // ← use filters.search directly now
    if (filters.min_age) params.append('min_age', filters.min_age);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);

    const data = await userService.getUsers(`${params.toString()}`);
    setUsers(data);
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    setTableLoading(false);
  }
};

// Initial load & on filter change (not search input anymore)
useEffect(() => {
  fetchUsers();
}, [filters, refreshList]);

const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    setFilters(prev => ({ ...prev, search: searchInput }));
  }
};

  const handleApplyAgeFilter = () => {
    setFilters(prev => ({ ...prev, min_age: ageInput }));
  };

  const handleClearFilter = () => {
    setFilters(prev => ({ ...prev, min_age: '' }));
    setAgeInput('');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={onCreateUser}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add User
        </button>
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
          <button
            onClick={handleApplyAgeFilter}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Apply Age Filter
          </button>
          {filters.min_age && (
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
      <div className="text-sm text-gray-600">
        Showing {filteredAndSortedUsers.length} users
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-gray-700">
                    Name <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('email')} className="flex items-center gap-1 hover:text-gray-700">
                    Email <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                 <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => handleSort('created_at')} className="flex items-center gap-1 hover:text-gray-700">
                    Created <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array(6).fill('').map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredAndSortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{user.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{user.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{moment(user.created_at).format('MMM D, YYYY')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onViewUser(user)} className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => onEditUser(user)} className="text-green-600 hover:text-green-900">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => onDeleteUser(user)} className="text-red-600 hover:text-red-900">
                          <Trash2 size={16} />
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

export default UserList;
