import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Barcode, Thermometer, Search, Filter, X } from 'lucide-react';
import { useStore } from '../store';
import JsBarcode from 'jsbarcode';
import { Department } from '../types';

const schema = z.object({
  name: z.string().min(1, 'Product name is required'),
  temperature: z.number().min(-30).max(40),
  receivedBy: z.string().min(1, 'Receiver name is required'),
});

interface SearchFilters {
  description: string;
  department: Department | '';
  productCode: string;
  supplierName: string;
  supplierCode: string;
}

export function ProductReceiving() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });
  const { products, addProduct } = useStore();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    description: '',
    department: '',
    productCode: '',
    supplierName: '',
    supplierCode: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchDescription = product.name.toLowerCase().includes(searchFilters.description.toLowerCase());
    const matchDepartment = !searchFilters.department || product.department === searchFilters.department;
    const matchProductCode = product.productCode.toLowerCase().includes(searchFilters.productCode.toLowerCase());
    const matchSupplierName = product.supplierName.toLowerCase().includes(searchFilters.supplierName.toLowerCase());
    const matchSupplierCode = product.supplierCode.toLowerCase().includes(searchFilters.supplierCode.toLowerCase());

    return matchDescription && matchDepartment && matchProductCode && matchSupplierName && matchSupplierCode;
  });

  const onSubmit = (data: any) => {
    const barcode = generateBarcode();
    const product = {
      id: crypto.randomUUID(),
      barcode,
      ...data,
      receivedAt: new Date(),
    };
    addProduct(product);
  };

  const generateBarcode = () => {
    const barcodeValue = Math.random().toString().substring(2, 14);
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, barcodeValue, { format: 'CODE128' });
    return barcodeValue;
  };

  const resetFilters = () => {
    setSearchFilters({
      description: '',
      department: '',
      productCode: '',
      supplierName: '',
      supplierCode: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6">Receive New Product</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                {...register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temperature (°C)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Thermometer className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  step="0.1"
                  {...register('temperature', { valueAsNumber: true })}
                  className="block w-full pl-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {errors.temperature && (
                <p className="mt-1 text-sm text-red-600">{errors.temperature.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Received By
              </label>
              <input
                type="text"
                {...register('receivedBy')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.receivedBy && (
                <p className="mt-1 text-sm text-red-600">{errors.receivedBy.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Barcode className="h-5 w-5 mr-2" />
              Generate Barcode & Save
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Product Search</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
              >
                <Filter className="h-5 w-5" />
              </button>
              {(searchFilters.description || searchFilters.department || searchFilters.productCode || 
                searchFilters.supplierName || searchFilters.supplierCode) && (
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
                  value={searchFilters.description}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Search by description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  value={searchFilters.department}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, department: e.target.value as Department | '' }))}
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
                  value={searchFilters.productCode}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, productCode: e.target.value }))}
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
                  value={searchFilters.supplierName}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, supplierName: e.target.value }))}
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
                  value={searchFilters.supplierCode}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, supplierCode: e.target.value }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Search by supplier code..."
                />
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Codes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-gray-500">{product.barcode}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {product.department || 'Unassigned'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="text-gray-900">{product.productCode}</div>
                      {product.ean && (
                        <div className="text-gray-500">EAN: {product.ean}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <div className="text-gray-900">{product.supplierName}</div>
                      <div className="text-gray-500">Code: {product.supplierCode}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}