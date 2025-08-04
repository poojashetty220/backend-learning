import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';

interface CategorySelectorProps {
  selectedCategories: string[];
  onChange: (selected: string[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategories, onChange }) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<string[]>(selectedCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getCategories();
        if (response && 'categories' in response) {
          setCategories(response.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelected(selectedCategories);
  }, [selectedCategories]);

  const toggleCategory = (id: string) => {
    let updatedSelected: string[];
    if (selected.includes(id)) {
      updatedSelected = selected.filter(catId => catId !== id);
    } else {
      updatedSelected = [...selected, id];
    }
    setSelected(updatedSelected);
    onChange(updatedSelected);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <button
          key={category.id}
          type="button"
          onClick={() => toggleCategory(category.id)}
          className={`px-3 py-1 rounded-full border ${
            selected.includes(category.id)
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
