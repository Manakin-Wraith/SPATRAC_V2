import React, { useState } from 'react';
import { useStore } from '../../store';
import { Department, Product } from '../../types';
import JsBarcode from 'jsbarcode';
import { SearchFilters } from './SearchFilters';
import { ProductTable } from './ProductTable';
import { ReceiveForm } from './ReceiveForm';

interface SearchFilters {
  description: string;
  department: Department | '';
  productCode: string;
  supplierName: string;
  supplierCode: string;
}

export function ProductReceiving() {
  const { products, addProduct } = useStore();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    description: '',
    department: '',
    productCode: '',
    supplierName: '',
    supplierCode: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();

  const filteredProducts = products.filter(product => {
    const matchDescription = product.name.toLowerCase().includes(searchFilters.description.toLowerCase());
    const matchDepartment = !searchFilters.department || product.department === searchFilters.department;
    const matchProductCode = product.productCode.toLowerCase().includes(searchFilters.productCode.toLowerCase());
    const matchSupplierName = product.supplierName.toLowerCase().includes(searchFilters.supplierName.toLowerCase());
    const matchSupplierCode = product.supplierCode.toLowerCase().includes(searchFilters.supplierCode.toLowerCase());

    return matchDescription && matchDepartment && matchProductCode && matchSupplierName && matchSupplierCode;
  });

  const generateBarcode = () => {
    const barcodeValue = Math.random().toString().substring(2, 14);
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, barcodeValue, { format: 'CODE128' });
    return barcodeValue;
  };

  const handleSubmit = (data: any) => {
    const barcode = generateBarcode();
    const product = {
      id: crypto.randomUUID(),
      barcode,
      ...data,
      receivedAt: new Date(),
      // Preserve supplier and product details if selected from existing product
      supplierCode: selectedProduct?.supplierCode || '',
      supplierName: selectedProduct?.supplierName || '',
      productCode: selectedProduct?.productCode || '',
      ean: selectedProduct?.ean || '',
      department: selectedProduct?.department,
    };
    addProduct(product);
    setSelectedProduct(undefined);
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

  const handleClearSelection = () => {
    setSelectedProduct(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReceiveForm
          onSubmit={handleSubmit}
          selectedProduct={selectedProduct}
          onClearSelection={handleClearSelection}
        />

        <div className="bg-white rounded-xl shadow-sm p-6">
          <SearchFilters
            filters={searchFilters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            setFilters={setSearchFilters}
            resetFilters={resetFilters}
          />

          <ProductTable
            products={filteredProducts}
            onSelectProduct={setSelectedProduct}
            selectedProductId={selectedProduct?.id}
          />
        </div>
      </div>
    </div>
  );
}