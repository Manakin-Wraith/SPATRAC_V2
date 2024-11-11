import React from 'react';
import { Filter, X } from 'lucide-react';
import { Department } from '../../types';

interface SearchFiltersProps {
  filters: {
    description: string;
    department: Department | '';
    productCode: string;
    supplierName: string;
    supplierCode: string;
  };
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  setFilters: (filters: any) => void;
  resetFilters: () => void;
}

export function SearchFilters({ filters, showFilters, setShowFilters, setFilters, resetFilters }: SearchFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Product Search</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
          >
            <Filter className="h-5 w-5" />
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Description
            </label>
            <input
              type="text"
              value={filters.description}
              onChange={(e) => setFilters(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search by description..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value as Department | '' }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              <option value="butchery">Butchery</option>
              <option value="bakery">Bakery</option>
              <option value="hmr">HMR</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Internal Product Code
            </label>
            <input
              type="text"
              value={filters.productCode}
              onChange={(e) => setFilters(prev => ({ ...prev, productCode: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search by product code..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier Name
            </label>
            <input
              type="text"
              value={filters.supplierName}
              onChange={(e) => setFilters(prev => ({ ...prev, supplierName: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search by supplier name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Supplier Code
            </label>
            <input
              type="text"
              value={filters.supplierCode}
              onChange={(e) => setFilters(prev => ({ ...prev, supplierCode: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Search by supplier code..."
            />
          </div>
        </div>
      )}
    </>
  );
}