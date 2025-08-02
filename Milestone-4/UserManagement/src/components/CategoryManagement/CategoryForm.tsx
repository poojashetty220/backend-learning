import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';

interface Category {
  id?: string;
  name: string;
}

interface CategoryFormProps {
  category?: Category | null;
  onSave: (category: Category) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
  const [name, setName] = useState(category?.name || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const validate = (): boolean => {
    if (!name.trim()) {
      setError('Category name is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!validate()) return;

      try {
        let savedCategory: Category | null;
        
        if (category) {
          savedCategory = await categoryService.updateCategory(category._id, { name: name.trim() });
        } else {
          savedCategory = await categoryService.createCategory({ name: name.trim() });
        }
  
        if (savedCategory) {
          onSave({ name: name.trim() });
        }
      } catch (error) {
        alert(error?.response?.data?.message || 'Failed');
      } 
    };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-2xl font-semibold mb-4">{category ? 'Edit Category' : 'Create Category'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              error ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter category name"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {category ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
