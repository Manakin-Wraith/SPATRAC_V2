import React, { useState } from 'react';
import { LayoutGrid, PackageSearch, ChefHat, BarChart3, Menu, Building2, FileUp } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ProductReceiving } from './components/ProductReceiving';
import { RecipeManagement } from './components/RecipeManagement';
import { DepartmentTransfer } from './components/DepartmentTransfer';
import { Reports } from './components/Reports';
import { CSVImport } from './components/CSVImport';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', icon: LayoutGrid, id: 'dashboard' },
    { name: 'Product Receiving', icon: PackageSearch, id: 'receiving' },
    { name: 'Recipe Management', icon: ChefHat, id: 'recipes' },
    { name: 'Department Transfer', icon: Building2, id: 'transfer' },
    { name: 'Reports', icon: BarChart3, id: 'reports' },
    { name: 'Import CSV', icon: FileUp, id: 'import' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-4 text-gray-600 hover:text-gray-900"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col
        ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block
      `}>
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <PackageSearch className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                SPATRAC
              </span>
            </div>
            <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full
                    ${
                      activeTab === item.id
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 h-6 w-6 flex-shrink-0
                      ${
                        activeTab === item.id
                          ? 'text-gray-500'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }
                    `}
                  />
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'receiving' && <ProductReceiving />}
          {activeTab === 'recipes' && <RecipeManagement />}
          {activeTab === 'transfer' && <DepartmentTransfer />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'import' && <CSVImport />}
        </main>
      </div>
    </div>
  );
}

export default App;