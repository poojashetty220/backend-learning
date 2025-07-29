import React from 'react';

interface Post {
  _id: string;
  title: string;
  user_info: {
    name?: string;
  };
}

interface CategoryPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string;
  posts: Post[];
}

const CategoryPostsModal: React.FC<CategoryPostsModalProps> = ({ isOpen, onClose, categoryName, posts }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 !m-0">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Posts in {categoryName}</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-bold text-xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        {posts.length === 0 ? (
          <p>No posts found for this category.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Post Title</th>
                <th className="border-b px-4 py-2">Author Name</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post._id} className="hover:bg-gray-100">
                  <td className="border-b px-4 py-2">{post.title}</td>
                  <td className="border-b px-4 py-2">{post.user_info?.name || 'Unknown'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CategoryPostsModal;
