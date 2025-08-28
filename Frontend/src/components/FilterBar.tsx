// src/components/FilterBar.tsx
import React from 'react';

interface FilterBarProps {
  search: string;
  setSearch: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ search, setSearch }) => {
  return (
    <div className="filter-bar mb-6 flex justify-center">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 Pesquisar vagas..."
        className="
          w-full max-w-lg
          border border-gray-300 rounded-full
          px-4 py-3
          shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition duration-300
          placeholder-gray-400
        "
      />
    </div>
  );
};

export default FilterBar;
