import { useState, useEffect, useRef } from 'react';
import type { Tab } from '../stores/tabStore';

export function useTabsVisibility(tabs: Tab[]) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [visibleTabs, setVisibleTabs] = useState<Tab[]>(tabs);
  const [hiddenTabs, setHiddenTabs] = useState<Tab[]>([]);

  useEffect(() => {
    const updateVisibility = () => {
      if (!containerRef.current || !tabsContainerRef.current) return;

      const container = containerRef.current;
      const tabsContainer = tabsContainerRef.current;
      const containerWidth = container.offsetWidth - 50; // резерв для dropdown кнопки
      const tabElements = tabsContainer.querySelectorAll('[data-tab-id]');
      
      let accumulatedWidth = 0;
      const visible: Tab[] = [];
      const hidden: Tab[] = [];

      tabs.forEach((tab, index) => {
        const tabElement = tabElements[index] as HTMLElement;
        if (!tabElement) {
          visible.push(tab);
          return;
        }

        const tabWidth = tabElement.offsetWidth + 4; // +4 для gap
        accumulatedWidth += tabWidth;

        if (accumulatedWidth <= containerWidth) {
          visible.push(tab);
        } else {
          hidden.push(tab);
        }
      });

      setVisibleTabs(visible);
      setHiddenTabs(hidden);
    };

    // Викликаємо після рендеру
    const timer = setTimeout(updateVisibility, 0);

    const resizeObserver = new ResizeObserver(() => {
      updateVisibility();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [tabs]);

  return {
    containerRef,
    tabsContainerRef,
    visibleTabs,
    hiddenTabs,
  };
}
