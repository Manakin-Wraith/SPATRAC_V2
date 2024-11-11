import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChefHat, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import { Department } from '../types';

const schema = z.object({
  name: z.string().min(1, 'Recipe name is required'),
  department: z.enum(['butchery', 'bakery', 'hmr'] as const),
  instructions: z.string().min(1, 'Instructions are required'),
  ingredients: z.array(z.object({
    productId: z.string(),
    quantity: z.number().positive(),
    unit: z.string().min(1),
  })),
});

export function RecipeManagement() {
  const { recipes, products, addRecipe } = useStore();
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ingredients: [{ productId: '', quantity: 1, unit: 'unit' }],
    },
  });

  const onSubmit = (data: any) => {
    addRecipe({
      id: crypto.randomUUID(),
      ...data,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <ChefHat className="h-6 w-6 mr-2" />
          Recipe Management
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recipe Name
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
                Department
              </label>
              <select
                {...register('department')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="butchery">Butchery</option>
                <option value="bakery">Bakery</option>
                <option value="hmr">HMR</option>
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            {watch('ingredients')?.map((_, index) => (
              <div key={index} className="flex gap-4 mb-4">
                <select
                  {...register(`ingredients.${index}.productId`)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  {...register(`ingredients.${index}.quantity`, { valueAsNumber: true })}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Qty"
                />
                <input
                  type="text"
                  {...register(`ingredients.${index}.unit`)}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Unit"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Instructions
            </label>
            <textarea
              {...register('instructions')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.instructions && (
              <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Recipe
          </button>
        </form>
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-xl font-semibold mb-4">Existing Recipes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border rounded-lg p-4">
              <h4 className="font-semibold text-lg">{recipe.name}</h4>
              <p className="text-sm text-gray-600 capitalize">{recipe.department}</p>
              <div className="mt-2">
                <h5 className="font-medium text-sm">Ingredients:</h5>
                <ul className="text-sm text-gray-600">
                  {recipe.ingredients.map((ing, idx) => (
                    <li key={idx}>
                      {products.find(p => p.id === ing.productId)?.name} - {ing.quantity} {ing.unit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}