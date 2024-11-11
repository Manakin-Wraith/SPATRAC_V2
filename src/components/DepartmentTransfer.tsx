import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Building2 } from 'lucide-react';
import { useStore } from '../store';
import { Department } from '../types';

const schema = z.object({
  productId: z.string().min(1, 'Product is required'),
  department: z.enum(['butchery', 'bakery', 'hmr'] as const),
  managerId: z.string().min(1, 'Manager is required'),
});

export function DepartmentTransfer() {
  const { products, users, transferProduct } = useStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
  });

  const managers = users.filter(user => user.role === 'manager');

  const onSubmit = (data: any) => {
    transferProduct(data.productId, data.department, data.managerId);
    reset();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <Building2 className="h-6 w-6 mr-2" />
          Department Transfer
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Product
            </label>
            <select
              {...register('productId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Choose a product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.barcode})
                </option>
              ))}
            </select>
            {errors.productId && (
              <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Target Department
            </label>
            <select
              {...register('department')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select department</option>
              <option value="butchery">Butchery</option>
              <option value="bakery">Bakery</option>
              <option value="hmr">HMR</option>
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department Manager
            </label>
            <select
              {...register('managerId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select manager</option>
              {managers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name} ({manager.department})
                </option>
              ))}
            </select>
            {errors.managerId && (
              <p className="mt-1 text-sm text-red-600">{errors.managerId.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowRight className="h-5 w-5 mr-2" />
            Transfer Product
          </button>
        </form>
      </div>
    </div>
  );
}