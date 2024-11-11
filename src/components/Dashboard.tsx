import React from 'react';
import { BarChart3, Package, ChefHat, Thermometer, Users } from 'lucide-react';
import { useStore } from '../store';
import { TemperatureChart } from './TemperatureChart';
import { ProductList } from './ProductList';

export function Dashboard() {
  const { products, recipes, users } = useStore();

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Recipes',
      value: recipes.length,
      icon: ChefHat,
      color: 'bg-green-500',
    },
    {
      title: 'Team Members',
      value: users.length,
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'Avg Temperature',
      value: `${products.reduce((acc, p) => acc + p.temperature, 0) / products.length || 0}°C`,
      icon: Thermometer,
      color: 'bg-red-500',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Supply Chain Dashboard</h1>
        <p className="text-gray-600">Real-time tracking and monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Temperature Monitoring</h2>
          <TemperatureChart />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Products</h2>
          <ProductList />
        </div>
      </div>
    </div>
  );
}