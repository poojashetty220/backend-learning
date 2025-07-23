import React, { useState } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserViewModal from './components/UserViewModal';
import UserDeleteModal from './components/UserDeleteModal';
import UserDebug from './components/UserDebug';
import { User } from './types/user';

type View = 'list' | 'create' | 'edit' | 'debug';

function App() {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setCurrentView('create');
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setCurrentView('edit');
  };

  const handleViewUser = (user: User) => {
    setViewUser(user);
  };

  const handleDeleteUser = (user: User) => {
    setDeleteUser(user);
  };

  const handleFormSave = (user: User) => {
    setCurrentView('list');
    setSelectedUser(null);
    // In a real app, you would refresh the user list here
  };

  const handleFormCancel = () => {
    setCurrentView('list');
    setSelectedUser(null);
  };

  const handleDeleteConfirm = () => {
    setDeleteUser(null);
    // In a real app, you would refresh the user list here
  };

  const handleDeleteCancel = () => {
    setDeleteUser(null);
  };

  const handleViewClose = () => {
    setViewUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'list' && (
          <UserList
            onCreateUser={handleCreateUser}
            onEditUser={handleEditUser}
            onViewUser={handleViewUser}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {(currentView === 'create' || currentView === 'edit') && (
          <UserForm
            user={selectedUser}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        )}

        {viewUser && (
          <UserViewModal
            user={viewUser}
            onClose={handleViewClose}
          />
        )}

        {deleteUser && (
          <UserDeleteModal
            user={deleteUser}
            onConfirm={handleDeleteConfirm}
            onCancel={handleDeleteCancel}
          />
        )}
      </div>
    </div>
  );
}

export default App;