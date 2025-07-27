/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { postService } from '../../services/postService';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  age: string;
  gender: string;
  phone: string;
  created_at: string;
}

interface PostWithUser {
  _id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  user_info: UserInfo;
}

interface PostsWithUserListProps {
  refreshList?: boolean;
}

const PostsWithUserList: React.FC<PostsWithUserListProps> = ({
  refreshList
}) => {
  const [posts, setPosts] = useState<PostWithUser[]>([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [stats, setStats] = useState({ totalCount: 0 });

  const fetchPostsWithUsers = async () => {
    setTableLoading(true);
    try {
      // For now, no filters applied on backend for this route, can be extended later
      const response = await postService.getPostsWithUsers();
      setPosts(response.posts);
      setStats({ totalCount: response.posts.length });
    } catch (error) {
      console.error('Error fetching posts with user info:', error);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsWithUsers();
  }, [refreshList]);

  const filteredAndSortedPosts = useMemo(() => posts, [posts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Posts with User Info</h1>
      </div>

      {/* Count */}
      {stats && (
        <div className="text-sm text-gray-600">
          Showing {stats.totalCount} posts
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">Content</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">Author</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">Email</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">Phone</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">Category</th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  Created
                </th>
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
              ) : filteredAndSortedPosts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No posts found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedPosts.map(post => (
                  <tr key={post._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                    <td className="px-6 py-4 max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {post.content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{post.user_info.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{post.user_info.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{post.user_info.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{post.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{moment(post.created_at).format('MMM D, YYYY')}</td>
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

export default PostsWithUserList;
