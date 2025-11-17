import { useSortable } from '@dnd-kit/sortable';
import { useState, useRef, useEffect } from 'react';
import type { Tab as TabType } from '../stores/tabStore';
import { IoIosClose } from "react-icons/io";


interface TabItemProps {
  tab: TabType;
  isActive: boolean;
  onClose: (id: string) => void;
  onTogglePin: (id: string) => void;
  onSelect: (id: string) => void;
}

export default function TabItem({ tab, isActive, onClose, onTogglePin, onSelect }: TabItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tab.id });

  const [contextMenuPosition, setContextMenuPosition] = useState({ top: 0, left: 0 });
  const [showContextMenu, setShowContextMenu] = useState(false);
  const tabRef = useRef<HTMLDivElement>(null);

  // Закриття контекстного меню при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showContextMenu && tabRef.current && !tabRef.current.contains(e.target as Node)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showContextMenu]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const menuWidth = 150;
    const menuHeight = 100;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Використовуємо clientX/clientY для fixed позиціювання
    let left = e.clientX;
    let top = e.clientY;
    
    // Корекція якщо виходить за межі
    if (left + menuWidth > viewportWidth) {
      left = left - menuWidth;
    }
    
    if (top + menuHeight > viewportHeight) {
      top = top - menuHeight;
    }
    
    setContextMenuPosition({ top, left });
    setShowContextMenu(true);
  };

  const style = {
    transform: transform ? `translate3d(${transform.x}px, 0, 0)` : undefined,
    transition,
  };

  return (
      <div
        ref={(node) => {
          setNodeRef(node);
          if (node) tabRef.current = node;
        }}
        style={style}
        data-tab-id={tab.id}
        {...attributes}
        {...listeners}
        onClick={() => onSelect(tab.id)}
        onContextMenu={handleContextMenu}
        className={`
          flex items-center gap-2 cursor-pointer
          shrink-0 relative group 
          ${tab.isPinned ? 'px-3 py-[15px]' : 'px-5 py-[15px]'}
          ${isDragging ? 'bg-[#7F858D] text-white z-50' : isActive ? 'bg-[#F1F5F8]' : 'bg-[#FEFEFE]'}
          ${!isDragging && 'hover:bg-gray-50'}
          transition-colors
        `}
      >

        {/* Контекстне меню */}
        {showContextMenu && (
          <div 
            className="fixed flex flex-col bg-white border border-gray-300 rounded shadow-lg py-1 z-60 min-w-[150px]"
            style={{
              top: `${contextMenuPosition.top}px`,
            }}
          >
            {/* Pin/Unpin option */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(tab.id);
                setShowContextMenu(false);
              }}
              className="px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="currentColor"
                className={tab.isPinned ? 'text-blue-600' : 'text-gray-600'}
              >
                <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-.42.195-.614 0l-.707-.707a.5.5 0 0 1 0-.707l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146z"/>
              </svg>
              {tab.isPinned ? 'Відкріпити' : 'Закріпити'}
            </button>

            {/* Close option */}
   
          </div>
        )}
        {/* Icon */}
        {tab.icon && (
          <img 
            src={tab.icon} 
            alt={tab.title}
            className="w-4 h-4 object-contain"
          />
        )}

        {/* Tab title - приховуємо для закріплених табів */}
        {!tab.isPinned && (
          <div
            className="flex-1 whitespace-nowrap text-sm font-medium"
          >
            {tab.title}
          </div>
        )}
         {!tab.isPinned && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(tab.id);
              }}
              className=" rounded-full opacity-0 group-hover:opacity-100  transition-all bg-red-500 text-white "
              title="Закрити"
            >
              <IoIosClose size={16} />
              
            </button>
          )}

          

        
      </div>

      
  );
}
