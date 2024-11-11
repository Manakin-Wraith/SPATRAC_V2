import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Barcode, Thermometer, X } from 'lucide-react';
import { Product } from '../../types';

const schema = z.object({
  name: z.string().min(1, 'Product name is required'),
  temperature: z.number().min(-30).max(40),
  receivedBy: z.string().min(1, 'Receiver name is required'),
});

interface ReceiveFormProps {
  onSubmit: (data: any) => void;
  selectedProduct?: Product;
  onClearSelection: () => void;
}

export function ReceiveForm({ onSubmit, selectedProduct, onClearSelection }: ReceiveFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      temperature: undefined,
      receivedBy: '',
    },
  });

  React.useEffect(() => {
    if (selectedProduct) {
      reset({
        name: selectedProduct.name,
        temperature: undefined,
        receivedBy: '',
      });
    }
  }, [selectedProduct, reset]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Receive New Product</h2>
        {selectedProduct && (
          <button
            onClick={onClearSelection}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
            title="Clear selection"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {selectedProduct && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700">
            <span className="font-medium">Selected Product:</span> {selectedProduct.name}
          </div>
          <div className="text-sm text-blue-600 mt-1">
            <span className="font-medium">Supplier:</span> {selectedProduct.supplierName} ({selectedProduct.supplierCode})
          </div>
        </div>
      )}

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
  );
}