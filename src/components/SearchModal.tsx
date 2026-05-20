import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchItem {
  value: string;
  label: string;
  subLabel?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: SearchItem[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

export function SearchModal({ isOpen, onClose, title, items, onSelect, placeholder = "Search..." }: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = items.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) || 
    (item.subLabel && item.subLabel.toLowerCase().includes(query.toLowerCase())) ||
    item.value.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl h-[85vh] sm:h-[60vh] flex flex-col shadow-2xl">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={24} className="text-gray-500" />
          </button>
        </div>
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative">
             <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
             <input
               type="text"
               autoFocus
               placeholder={placeholder}
               value={query}
               onChange={e => setQuery(e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-sm"
             />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No results found</div>
          ) : (
            filtered.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  onSelect(item.value);
                  onClose();
                  setQuery('');
                }}
                className="w-full flex justify-between items-center px-4 py-3.5 hover:bg-green-50 active:bg-green-100 rounded-xl transition-colors text-left group border border-transparent hover:border-green-100"
              >
                <span className="font-medium text-gray-800 group-hover:text-green-700">{item.label}</span>
                {item.subLabel && <span className="text-gray-500 text-sm font-mono bg-gray-100 group-hover:bg-green-100 px-2 py-1 rounded-md">{item.subLabel}</span>}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
