import React from 'react';
import { Product } from '../../types';

interface ProductTableProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  selectedProductId?: string;
}

export function ProductTable({ products, onSelectProduct, selectedProductId }: ProductTableProps) {
  return (
    <div className="overflow-y-auto max-h-[600px] -mx-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-white sticky top-0 z-10 shadow-sm">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
              Codes
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-white">
              Supplier
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className={`
                cursor-pointer transition-colors duration-150
                ${selectedProductId === product.id 
                  ? 'bg-blue-50 hover:bg-blue-100' 
                  : 'hover:bg-gray-50'
                }
              `}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-start flex-col">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500 font-mono">{product.barcode}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`
                  px-2 py-1 text-xs font-medium rounded-full capitalize
                  ${product.department === 'butchery' ? 'bg-red-100 text-red-800' :
                    product.department === 'bakery' ? 'bg-yellow-100 text-yellow-800' :
                    product.department === 'hmr' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'}
                `}>
                  {product.department || 'Unassigned'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-900">#{product.productCode}</span>
                  {product.ean && (
                    <span className="text-sm text-gray-500">EAN: {product.ean}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-900">{product.supplierName}</span>
                  <span className="text-sm text-gray-500">Code: {product.supplierCode}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}