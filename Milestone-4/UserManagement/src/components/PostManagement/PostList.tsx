/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react';
import { Post, SortField, SortDirection } from '../../types/post';
import moment from 'moment';
import { postService } from '../../services/postService';

interface PostListProps {
  onCreatePost: () => void;
  onEditPost: (post: Post) => void;
  onViewPost: (post: Post) => void;
  onDeletePost: (post: Post) => void;
  refreshList?: boolean;
}

const PostList: React.FC<PostListProps> = ({
  onCreatePost,
  onEditPost,
  onViewPost,
  onDeletePost,
  refreshList
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tableLoading, setTableLoading] = useState(true);

  const [filters, setFilters] = useState<{
    search: string;
    sort_by: SortField;
    sort_order: SortDirection;
  }>({
    search: '',
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  const [searchInput, setSearchInput] = useState('');
  const [stats, setStats] = useState({ totalCount: 0 });

const fetchPosts = async () => {
  setTableLoading(true);
  try {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);

    const { posts: fetchedPOsts, stats } = await postService.getPosts(`${params.toString()}`);
    setPosts(fetchedPOsts);
    setStats(stats);
  } catch (error) {
    console.error('Error fetching posts:', error);
  } finally {
    setTableLoading(false);
  }
};

// Initial load & on filter change (not search input anymore)
useEffect(() => {
  fetchPosts();
}, [filters, refreshList]);

const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter') {
    setFilters(prev => ({ ...prev, search: searchInput }));
  }
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

  const filteredAndSortedPosts = useMemo(() => posts, [posts]);

  console.log(filteredAndSortedPosts, 'filteredAndSortedPosts');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Post Management</h1>
        <button
          onClick={onCreatePost}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Post
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
          </div>
        </div>
      </div>

      {/* Count */}
      {stats && <div className="text-sm text-gray-600">
        Showing {stats.totalCount} posts
      </div>}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  <button onClick={() => handleSort('title')} className="flex items-center gap-1 hover:text-gray-700">
                    Title <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500  tracking-wider">Content</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">Author</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">Author Email</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">Author Phone</th>
                 <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">Categories</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  <button onClick={() => handleSort('created_at')} className="flex items-center gap-1 hover:text-gray-700">
                    Created <ArrowUpDown size={14} />
                  </button>
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array(5).fill('').map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredAndSortedPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No posts found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedPosts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                    <td className="px-6 py-4 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {post.content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{post.user_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{post.user_info?.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{post.user_info?.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.categories && post.categories.length > 0
                        ? post.categories.map((cat) => cat.name).join(', ')
                        : 'No categories'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{moment(post.created_at).format('MMM D, YYYY')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => onViewPost(post)} className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => onEditPost(post)} className="text-green-600 hover:text-green-900">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => onDeletePost(post)} className="text-red-600 hover:text-red-900">
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

export default PostList;
