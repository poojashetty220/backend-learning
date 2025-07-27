/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Edit } from 'lucide-react';
import { Category } from '../../types/category';
import moment from 'moment';
import { categoryService } from '../../services/categoryService';

interface CategoryListProps {
  onCreateCategory: () => void;
  onEditCategory: (category: Category) => void;
  refreshList?: boolean;
}

const CategoryList: React.FC<CategoryListProps> = ({
  onCreateCategory,
  onEditCategory,
  refreshList
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tableLoading, setTableLoading] = useState(true);

  const fetchCategories = async () => {
    setTableLoading(true);
    try {
      const response = await categoryService.getCategories();
      const fetchCategories = response?.categories ?? [];
      setCategories(fetchCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [refreshList]);

  const filteredAndSortedCategories = useMemo(() => categories ?? [], [categories]);
  console.log('Filtered and Sorted Categories:', filteredAndSortedCategories, 'cat', categories);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
        <button
          onClick={onCreateCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left font-medium text-gray-500 tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {Array(3).fill('').map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : filteredAndSortedCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedCategories.map(category => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {moment(category.created_at).format('MMM D, YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditCategory(category)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit size={16} />
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

export default CategoryList;
