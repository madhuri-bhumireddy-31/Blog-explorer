'use client';
import { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { memo } from 'react';

interface SearchBarProps {
  onDebouncedSearch: (value: string) => void;
}

export default memo(function SearchBar({ onDebouncedSearch }: SearchBarProps) {
  const [input, setInput] = useState('');
  const debounced = useDebounce(input, 500);

  useEffect(() => {
    onDebouncedSearch(debounced);
  }, [debounced, onDebouncedSearch]);

  return (
    <input
      type="text"
      placeholder="Search posts by title..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
});
