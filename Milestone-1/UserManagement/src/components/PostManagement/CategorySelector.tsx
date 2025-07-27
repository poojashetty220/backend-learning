import React, { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';

interface Category {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  selectedCategories: string[];
  onChange: (selected: string[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategories, onChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      const cats = await categoryService.getCategories();
      setCategories(cats);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  const handleToggle = (id: string) => {
    if (selectedCategories.includes(id)) {
      onChange(selectedCategories.filter(catId => catId !== id));
    } else {
      onChange([...selectedCategories, id]);
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category.id}
          type="button"
          onClick={() => handleToggle(category.id)}
          className={`px-3 py-1 rounded-full border ${
            selectedCategories.includes(category.id)
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
