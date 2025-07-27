import React, { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { Post, PostFormData } from '../../types/post';
import { postService } from '../../services/postService';
import { userService } from '../../services/userService';
import CategorySelector from './CategorySelector';

interface PostFormProps {
  post?: Post | null;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    content: '',
    categories: [],
    user_id: '',
    user_name: '',
  });

  const [errors, setErrors] = useState<Partial<PostFormData>>({});
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
    fetchUsers();

    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        categories: post.categories.map((cat) => cat.id),
        user_id: post.user_id,
        user_name: post.user_name,
      });
    }
  }, [post]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PostFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (formData.categories.length === 0) {
      newErrors.categories = 'At least one category is required';
    }
    if (!formData.user_id.trim()) {
      newErrors.user_id = 'Author is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      let savedPost: Post | null;

      if (post) {
        savedPost = await postService.updatePost(post.id, formData);
      } else {
        savedPost = await postService.createPost(formData);
      }

      if (savedPost) {
        onSave(savedPost);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {post ? 'Edit Post' : 'Create New Post'}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              rows={4}
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter content"
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories *
              </label>
              <CategorySelector
                selectedCategories={formData.categories}
                onChange={(selected) => handleInputChange('categories', selected)}
              />
              {errors.categories && <p className="mt-1 text-sm text-red-600">{errors.categories}</p>}
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                Author *
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
          </div>

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
              {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
