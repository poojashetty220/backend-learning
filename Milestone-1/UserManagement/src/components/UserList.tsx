import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ArrowUpDown, Grid, List } from 'lucide-react';
import { User, SortField, SortDirection } from '../types/user';
import { userService } from '../services/userService';
import moment from 'moment';

interface UserListProps {
  onCreateUser: () => void;
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ onCreateUser, onEditUser, onViewUser, onDeleteUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Prevent duplicate API calls in React 18 Strict Mode (dev only)
  const fetchedOnceRef = useRef(false);

  useEffect(() => {
    // In production (where Strict Mode double‑invoke is disabled), this guard is harmless
    if (fetchedOnceRef.current) return;
    fetchedOnceRef.current = true;

    const loadUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const filteredAndSortedUsers = useMemo(() => {
    const filtered = users.filter(user =>
      searchTerm === '' ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.gender.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = (aValue as string).toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (sortDirection === 'asc') return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    });

    return filtered;
  }, [users, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

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

      {/* Search */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Count */}
      <div className="text-sm text-gray-600">Showing {filteredAndSortedUsers.length} of {users.length} users</div>

      {/* Table View */}
      {viewMode === 'table' ? (
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
                  <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('email')} className="flex items-center gap-1 hover:text-gray-700">
                      Email <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">
                    <button onClick={() => handleSort('created_at')} className="flex items-center gap-1 hover:text-gray-700">
                      Created <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAndSortedUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{user.gender}</td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedUsers.map(user => (
            <div key={user.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mb-3">
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                <p className="text-sm text-gray-600 capitalize">Gender: {user.gender}</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">Joined: {moment(user.created_at).format('MMM D, YYYY')}</p>
              <div className="flex justify-center gap-2">
                <button onClick={() => onViewUser(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Eye size={16} />
                </button>
                <button onClick={() => onEditUser(user)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                  <Edit size={16} />
                </button>
                <button onClick={() => onDeleteUser(user)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;