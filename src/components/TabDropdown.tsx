import { useState, useRef, useEffect } from 'react';
import { IoIosClose } from 'react-icons/io';
import type { Tab } from '../stores/tabStore';

interface TabDropdownProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

export default function TabDropdown({ tabs, activeTabId, onSelect, onClose }: TabDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (tabs.length === 0) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Кнопка відкриття dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-gray-100 transition-colors"
        title={`${tabs.length} прихованих табів`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="text-gray-600"
        >
          <path d="M6 8l4 4 4-4" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dropdown меню */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-100 min-w-[280px] max-h-[500px] overflow-y-auto py-1">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => {
                onSelect(tab.id);
                setIsOpen(false);
              }}
              className={`
                group flex items-center gap-3 px-4 py-3 cursor-pointer
                transition-colors hover:bg-gray-50
                ${tab.id === activeTabId ? 'bg-blue-50' : ''}
              `}
            >
              {/* Іконка таба */}
              {tab.icon && (
                <img 
                  src={tab.icon} 
                  alt={tab.title}
                  className="w-5 h-5 object-contain shrink-0"
                />
              )}
              
              {/* Назва таба */}
              <span className="flex-1 text-sm font-medium text-gray-700 truncate">
                {tab.title}
              </span>
              
              {/* Кнопка закриття */}
              {!tab.isPinned && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(tab.id);
                  }}
                  className="shrink-0 rounded-full hover:bg-red-500 hover:text-white text-gray-400 transition-colors"
                  title="Закрити таб"
                >
                  <IoIosClose size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
