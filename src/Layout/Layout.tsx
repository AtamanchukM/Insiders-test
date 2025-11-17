import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import TabContainer from '../components/TabContainer';
export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className={`
        w-64 bg-gray-800 text-white flex flex-col
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <h1 className="text-xl font-bold">My App</h1>
          {/* Кнопка закриття для мобільних */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded hover:bg-gray-700"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                Projects
              </a>
            </li>
            <li>
              <a href="#" className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors">
                Settings
              </a>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <p className="text-sm text-gray-400">User Profile</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col relative">
        {/* Backdrop для табів на мобільних */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-30 lg:hidden"
            style={{ left: '256px' }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Header з кнопкою меню */}
        <div className="lg:hidden flex items-center px-4 py-2 bg-white border-b">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded hover:bg-gray-100"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <TabContainer />
        
        {/* Page content */}
        <main className="flex-1 overflow-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
