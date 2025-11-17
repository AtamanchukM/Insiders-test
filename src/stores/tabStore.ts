import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Імпорт іконок
import dashboardIcon from '../assets/icons/dashboard-icon.png';
import bookIcon from '../assets/icons/Book-icon.png';
import settingIcon from '../assets/icons/Setting-icon.png';
import listIcon from '../assets/icons/List-icon.png';
import bankIcon from '../assets/icons/Bank-icon.png';
import browserIcon from '../assets/icons/Browser-icon.png';
import mailIcon from '../assets/icons/Mail-icon.png';
import statistikIcon from '../assets/icons/Statistik-icon.png';

export interface Tab {
  id: string;
  title: string;
  url: string;
  isPinned: boolean;
  icon?: string;
}

interface TabStore {
  tabs: Tab[];
  activeTabId: string | null;
  setTabs: (tabs: Tab[]) => void;
  setActiveTab: (id: string) => void;
  togglePin: (id: string) => void;
  reorderTabs: (activeId: string, overId: string) => void;
  addTab: (tab: Tab) => void;
  removeTab: (id: string) => void;
}

export const useTabStore = create<TabStore>()(
  persist(
    (set) => ({
      tabs: [
        { id: 'dashboard', title: 'Dashboard', url: '/dashboard', isPinned: false, icon: dashboardIcon },
        { id: 'accounting', title: 'Accounting', url: '/accounting', isPinned: false, icon: bookIcon },
        { id: 'administration', title: 'Administration', url: '/administration', isPinned: false, icon: settingIcon },
        { id: 'auswahilsten', title: 'Auswahilsten', url: '/auswahilsten', isPinned: false, icon: listIcon },
        { id: 'banking', title: 'Banking', url: '/banking', isPinned: false, icon: bankIcon },
        { id: 'help', title: 'Help', url: '/help', isPinned: false, icon: browserIcon },
        { id: 'postoffice', title: 'Post Office', url: '/postoffice', isPinned: false, icon: mailIcon },
        { id: 'statistik', title: 'Statistik', url: '/statistik', isPinned: false, icon: statistikIcon },
      ],
      activeTabId: 'dashboard',

      setTabs: (tabs) => set({ tabs }),

      setActiveTab: (id) => set({ activeTabId: id }),

      togglePin: (id) =>
        set((state) => {
          const updatedTabs = state.tabs.map((tab) =>
            tab.id === id ? { ...tab, isPinned: !tab.isPinned } : tab
          );
          
          // Сортуємо: закріплені таби ліворуч
          const pinnedTabs = updatedTabs.filter(tab => tab.isPinned);
          const unpinnedTabs = updatedTabs.filter(tab => !tab.isPinned);
          
          return { tabs: [...pinnedTabs, ...unpinnedTabs] };
        }),

      reorderTabs: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.tabs.findIndex((tab) => tab.id === activeId);
          const newIndex = state.tabs.findIndex((tab) => tab.id === overId);

          const activeTab = state.tabs[oldIndex];
          const targetTab = state.tabs[newIndex];

          // Забороняємо перетягування між закріпленими та незакріпленими табами
          if (activeTab.isPinned !== targetTab.isPinned) {
            return state;
          }

          const newTabs = [...state.tabs];
          newTabs.splice(oldIndex, 1);
          newTabs.splice(newIndex, 0, activeTab);

          return { tabs: newTabs };
        }),

      addTab: (tab) =>
        set((state) => ({
          tabs: [...state.tabs, tab],
        })),

      removeTab: (id) =>
        set((state) => ({
          tabs: state.tabs.filter((tab) => tab.id !== id),
          activeTabId: state.activeTabId === id ? state.tabs[0]?.id || null : state.activeTabId,
        })),
    }),
    {
      name: 'tab-storage',
    }
  )
);
