import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FileUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';
import { useStore } from '../store';
import { Department } from '../types';

interface ImportResult {
  success: boolean;
  message: string;
  type: 'products' | 'recipes';
  count: number;
}

export function CSVImport() {
  const { importProducts, importRecipes } = useStore();
  const [results, setResults] = useState<ImportResult[]>([]);
  const { register, handleSubmit } = useForm();

  const processProductsCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const products = results.data.map((row: any) => ({
            id: crypto.randomUUID(),
            name: row['Product Description'],
            supplierCode: row['Supp. Cd.'],
            supplierName: row['Supplier Name'],
            productCode: row['Product Code'],
            ean: row['EAN'],
            department: row['Sub-Department'].toLowerCase() as Department,
            size: row['Size'],
            temperature: 0, // Default temperature, can be updated later
            receivedAt: new Date(),
            receivedBy: 'CSV Import',
            barcode: row['EAN'] || row['Product Code'], // Use EAN if available, fallback to Product Code
          }));

          importProducts(products);
          setResults(prev => [...prev, {
            success: true,
            message: `Successfully imported ${products.length} products`,
            type: 'products',
            count: products.length
          }]);
        } catch (error) {
          setResults(prev => [...prev, {
            success: false,
            message: `Error importing products: ${error.message}`,
            type: 'products',
            count: 0
          }]);
        }
      }
    });
  };

  const processRecipesCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const recipes = results.data.map((row: any) => ({
            id: crypto.randomUUID(),
            name: row['Final Product Name'],
            recipeCode: row['Final Product Code'],
            department: row['Department'].toLowerCase() as Department,
            ingredients: [{
              productId: row['Ingredient Prod Code'],
              description: row['Ingredient Description'],
              quantity: parseFloat(row['Weight']) || 0,
              unit: 'g', // Assuming weight is in grams
              packDeliver: row['Pack Deliver']
            }],
            recipe: row['Recipe'] || '',
          }));

          importRecipes(recipes);
          setResults(prev => [...prev, {
            success: true,
            message: `Successfully imported ${recipes.length} recipes`,
            type: 'recipes',
            count: recipes.length
          }]);
        } catch (error) {
          setResults(prev => [...prev, {
            success: false,
            message: `Error importing recipes: ${error.message}`,
            type: 'recipes',
            count: 0
          }]);
        }
      }
    });
  };

  const onSubmit = (data: any) => {
    setResults([]);
    if (data.productsFile?.[0]) {
      processProductsCSV(data.productsFile[0]);
    }
    if (data.recipesFile?.[0]) {
      processRecipesCSV(data.recipesFile[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <FileUp className="h-6 w-6 mr-2" />
          Import CSV Data
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Products CSV
            </label>
            <div className="mt-1">
              <input
                type="file"
                accept=".csv"
                {...register('productsFile')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Expected columns: Supp. Cd. | Supplier Name | Sub-Department | Supplier Product Code | Product Code | EAN | Product Description | Size
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Recipes CSV
            </label>
            <div className="mt-1">
              <input
                type="file"
                accept=".csv"
                {...register('recipesFile')}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Expected columns: Department | Final Product Code | Final Product Name | Ingredient Prod Code | Ingredient Description | Pack Deliver | Weight | Recipe
            </p>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Process CSV Files
          </button>
        </form>

        {results.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium">Import Results</h3>
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-md ${
                  result.success ? 'bg-green-50' : 'bg-red-50'
                }`}
              >
                {result.success ? (
                  <div className="flex items-center text-green-800">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    {result.message}
                  </div>
                ) : (
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {result.message}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}