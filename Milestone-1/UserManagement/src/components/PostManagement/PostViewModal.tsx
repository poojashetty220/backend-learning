import React from 'react';
import { X, LucideCaptions } from 'lucide-react';
import { Post } from '../../types/post';

interface PostViewModalProps {
  post: Post;
  onClose: () => void;
}

const PostViewModal: React.FC<PostViewModalProps> = ({ post, onClose }) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Post Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Avatar and Basic Info */}
          <div className="flex items-center gap-6 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {post.title}
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <LucideCaptions size={20} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium text-gray-900">{post.category}</p>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full h-80 overflow-auto'>
            <p className="font-medium text-gray-900 break-all">{post.content}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostViewModal;