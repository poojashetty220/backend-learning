import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Post } from '../../types/post';
import { postService } from '../../services/postService';

interface PostDeleteModalProps {
  post: Post;
  onConfirm: () => void;
  onCancel: () => void;
  setRefreshList?: React.Dispatch<React.SetStateAction<boolean>>;
  refreshList?: boolean;
}

const PostDeleteModal: React.FC<PostDeleteModalProps> = ({ post, onConfirm, onCancel, setRefreshList, refreshList }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await postService.deletePost(post.id);
      if (setRefreshList) {
        setRefreshList(!refreshList); // Notify parent to refresh the post list
      }
      onConfirm();
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delete Post</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            
            {/* Post Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {post.title}
                  </p>
                  <p className="text-sm text-gray-600">{post.category}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trash2 size={16} />
              )}
              {loading ? 'Deleting...' : 'Delete Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDeleteModal;