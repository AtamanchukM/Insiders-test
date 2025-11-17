import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useTabStore } from '../stores/tabStore';
import TabItem from './TabItem';
import TabDropdown from './TabDropdown';

export default function TabContainer() {
  const { tabs, activeTabId, setActiveTab, reorderTabs, removeTab, togglePin } = useTabStore();
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hiddenTabs, setHiddenTabs] = useState<typeof tabs>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // Синхронізація активного таба з поточним URL
  useEffect(() => {
    const currentTab = tabs.find(tab => tab.url === location.pathname);
    if (currentTab && currentTab.id !== activeTabId) {
      setActiveTab(currentTab.id);
    }
  }, [location.pathname, tabs, activeTabId, setActiveTab]);

  // Логіка визначення видимих/прихованих табів
  useEffect(() => {
    const checkOverflow = () => {
      if (!scrollContainerRef.current || !containerRef.current) return;

      const scrollContainer = scrollContainerRef.current;
      const container = containerRef.current;
      
      const dropdownWidth = 60;
      const padding = 32; // px-4
      
      // Видима ширина контейнера
      const viewportWidth = scrollContainer.parentElement!.offsetWidth - padding - dropdownWidth;
      
      const hidden: typeof tabs = [];
      let accumulatedWidth = 0;

      // Отримуємо всі DOM елементи табів у порядку їх відображення
      const tabElements = Array.from(container.querySelectorAll('[data-tab-id]')) as HTMLElement[];
      
      tabElements.forEach((element) => {
        const tabId = element.getAttribute('data-tab-id');
        const tab = tabs.find(t => t.id === tabId);
        if (!tab) return;

        // Додаємо ширину поточного таба
        const tabWidth = element.offsetWidth;
        accumulatedWidth += tabWidth;
        
        // Таб видимий якщо його кінець не виходить за межі viewport
        const isVisible = accumulatedWidth <= viewportWidth;

        console.log(`${tab.title}:`, {
          tabWidth,
          accumulatedWidth,
          viewportWidth,
          isVisible,
          overflow: accumulatedWidth - viewportWidth
        });

        if (!isVisible) {
          hidden.push(tab);
        }
      });

      console.log('Hidden tabs:', hidden.map(t => t.title));
      console.log('Total tabs:', tabElements.length, 'Hidden:', hidden.length);
      setHiddenTabs(hidden);
    };

    // Перевірка при зміні розміру та скролі
    const scrollContainer = scrollContainerRef.current;
    const resizeObserver = new ResizeObserver(checkOverflow);
    const parentElement = scrollContainer?.parentElement;
    
    if (parentElement) {
      resizeObserver.observe(parentElement);
    }
    
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkOverflow);
    }

    // Початкова перевірка
    setTimeout(checkOverflow, 100);

    return () => {
      resizeObserver.disconnect();
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkOverflow);
      }
    };
  }, [tabs]);

  // Оновлення позиції синього індикатора
  useEffect(() => {
    const updateIndicator = () => {
      if (!containerRef.current || !scrollContainerRef.current || !activeTabId) return;

      const activeIndex = tabs.findIndex(t => t.id === activeTabId);
      if (activeIndex === -1) return;

      const tabElement = containerRef.current.querySelector(`[data-tab-id="${activeTabId}"]`) as HTMLElement;
      if (!tabElement) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const tabRect = tabElement.getBoundingClientRect();

      setIndicatorStyle({
        left: tabRect.left - containerRect.left + scrollContainerRef.current.scrollLeft,
        width: tabRect.width,
      });
    };

    // Невелика затримка для коректного рендерингу
    requestAnimationFrame(() => {
      updateIndicator();
    });
    
    // Оновлюємо при скролі
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateIndicator);
      return () => scrollContainer.removeEventListener('scroll', updateIndicator);
    }
  }, [activeTabId, tabs]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderTabs(active.id as string, over.id as string);
    }
    setIsDragging(false);
  };

  const handleTabSelect = (id: string) => {
    const tab = tabs.find(t => t.id === id);
    if (tab) {
      setActiveTab(id);
      navigate(tab.url);
    }
  };

  return (
    <div className="w-full relative">
      <div className="pb-2">
        <div 
          ref={scrollContainerRef}
          className={isDragging ? 'overflow-hidden px-4' : 'overflow-hidden px-4'}
          style={{ touchAction: isDragging ? 'none' : 'auto' }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tabs.map((t) => t.id)} strategy={horizontalListSortingStrategy}>
              <div 
                className="relative pr-12 inline-flex"
                ref={containerRef}
              >
                {tabs.map((tab) => (
                  <TabItem
                    key={tab.id}
                    tab={tab}
                    isActive={tab.id === activeTabId}
                    onClose={removeTab}
                    onTogglePin={togglePin}
                    onSelect={handleTabSelect}
                  />
                  
                ))}

                
                
                {/* Синій індикатор активного таба */}
                <div
                  className="absolute top-0 h-[3px] bg-blue-500 transition-all duration-300 ease-out pointer-events-none"
                  style={{
                    left: `${indicatorStyle.left}px`,
                    width: `${indicatorStyle.width}px`,
                  }}
                />
              </div>
              
            </SortableContext>
            
          </DndContext>
        </div>
      </div>
        
      {/* Dropdown для прихованих табів */}
      {hiddenTabs.length > 0 && (
        <div className="fixed right-4 top-0 z-50">
          <TabDropdown
            tabs={hiddenTabs}
            activeTabId={activeTabId}
            onSelect={handleTabSelect}
            onClose={removeTab}
          />
        </div>
      )}
    </div>
  );
}
