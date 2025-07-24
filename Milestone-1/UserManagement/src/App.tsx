import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import UserList from './components/UserManagement/UserList';
import UserForm from './components/UserManagement/UserForm';
import UserViewModal from './components/UserManagement/UserViewModal';
import UserDeleteModal from './components/UserManagement/UserDeleteModal';
import PostForm from './components/PostManagement/PostForm';
import PostViewModal from './components/PostManagement/PostViewModal';
import PostDeleteModal from './components/PostManagement/PostDeleteModal';
import PostList from './components/PostManagement/PostList';
import { User } from './types/user';
import { Post } from './types/post'; // create this if you haven't

function AppWrapper() {
  return (
    <App />
  );
}

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [viewPost, setViewPost] = useState<Post | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [deletePost, setDeletePost] = useState<Post | null>(null);
  const [refreshList, setRefreshList] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-gray-50">
      
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md h-screen p-4 sticky top-0 flex flex-col space-y-4">
        <button
          onClick={() => navigate('/users')}
          className="text-left px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Users
        </button>
        <button
          onClick={() => navigate('/posts')}
          className="text-left px-4 py-2 rounded hover:bg-gray-100 transition"
        >
          Posts
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* Modals */}
        {viewUser && <UserViewModal user={viewUser} onClose={() => setViewUser(null)} />}
        {deleteUser && (
          <UserDeleteModal
            user={deleteUser}
            onConfirm={() => {
              setDeleteUser(null);
              setRefreshList(true);
            }}
            onCancel={() => setDeleteUser(null)}
            refreshList={refreshList}
            setRefreshList={setRefreshList}
          />
        )}
        {viewPost && <PostViewModal post={viewPost} onClose={() => setViewPost(null)} />}
        {deletePost && (
          <PostDeleteModal
            post={deletePost}
            onConfirm={() => {
              setDeletePost(null);
              setRefreshList(true);
            }}
            onCancel={() => setDeletePost(null)}
            refreshList={refreshList}
            setRefreshList={setRefreshList}
          />
        )}

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Navigate to="/users" />} />

          {/* User Routes */}
          <Route path="/users" element={
            <UserList
              onCreateUser={() => { setSelectedUser(null); navigate('/users/create'); }}
              onEditUser={(user) => { setSelectedUser(user); navigate(`/users/edit/${user.id}`); }}
              onViewUser={setViewUser}
              onDeleteUser={setDeleteUser}
              refreshList={refreshList}
            />
          } />
          <Route path="/users/create" element={
            <UserForm
              user={null}
              onSave={() => { setSelectedUser(null); navigate('/users'); }}
              onCancel={() => { setSelectedUser(null); navigate('/users'); }}
            />
          } />
          <Route path="/users/edit/:id" element={
            <UserForm
              user={selectedUser}
              onSave={() => { setSelectedUser(null); navigate('/users'); }}
              onCancel={() => { setSelectedUser(null); navigate('/users'); }}
            />
          } />

          {/* Post Routes */}
          <Route path="/posts" element={
            <PostList
              onCreatePost={() => { setSelectedPost(null); navigate('/posts/create'); }}
              onEditPost={(post) => { setSelectedPost(post); navigate(`/posts/edit/${post.id}`); }}
              onViewPost={setViewPost}
              onDeletePost={setDeletePost}
              refreshList={refreshList}
            />
          } />
          <Route path="/posts/create" element={
            <PostForm
              post={null}
              onSave={() => { setSelectedPost(null); navigate('/posts'); }}
              onCancel={() => { setSelectedPost(null); navigate('/posts'); }}
            />
          } />
          <Route path="/posts/edit/:id" element={
            <PostForm
              post={selectedPost}
              onSave={() => { setSelectedPost(null); navigate('/posts'); }}
              onCancel={() => { setSelectedPost(null); navigate('/posts'); }}
            />
          } />
        </Routes>
      </div>
    </div>
  );
}

export default AppWrapper;
