import React, { useState } from 'react';
import { BarChart3, FileText, Filter } from 'lucide-react';
import { useStore } from '../store';
import { format } from 'date-fns';
import { Department } from '../types';

export function Reports() {
  const { products, recipes, users } = useStore();
  const [department, setDepartment] = useState<Department | 'all'>('all');

  const filteredProducts = department === 'all'
    ? products
    : products.filter(p => p.department === department);

  const departmentStats = {
    butchery: products.filter(p => p.department === 'butchery').length,
    bakery: products.filter(p => p.department === 'bakery').length,
    hmr: products.filter(p => p.department === 'hmr').length,
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2 flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          Reports & Analytics
        </h2>
        <p className="text-gray-600">Comprehensive supply chain insights and statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(departmentStats).map(([dept, count]) => (
          <div key={dept} className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold capitalize">{dept}</h3>
            <p className="text-3xl font-bold mt-2">{count}</p>
            <p className="text-sm text-gray-600 mt-1">Products</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Product Movement Report</h3>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department | 'all')}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="butchery">Butchery</option>
              <option value="bakery">Bakery</option>
              <option value="hmr">HMR</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Barcode
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Temperature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Received
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Handler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {product.barcode}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {product.department || 'Warehouse'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.temperature}°C
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(product.receivedAt, 'MMM d, HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.receivedBy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-6">Recipe Utilization</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border rounded-lg p-4">
              <h4 className="font-semibold">{recipe.name}</h4>
              <p className="text-sm text-gray-600 capitalize mb-2">{recipe.department}</p>
              <div className="text-sm text-gray-600">
                <strong>Ingredients:</strong> {recipe.ingredients.length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}