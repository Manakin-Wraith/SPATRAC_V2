export type Department = 'butchery' | 'bakery' | 'hmr';

export interface Product {
  id: string;
  barcode: string;
  name: string;
  supplierCode: string;
  supplierName: string;
  productCode: string;
  ean?: string;
  size?: string;
  temperature: number;
  receivedAt: Date;
  receivedBy: string;
  department?: Department;
  parentProductId?: string;
}

export interface Recipe {
  id: string;
  name: string;
  recipeCode: string;
  ingredients: {
    productId: string;
    description: string;
    quantity: number;
    unit: string;
    packDeliver?: string;
  }[];
  recipe: string;
  department: Department;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'manager' | 'staff';
  department?: Department;
}