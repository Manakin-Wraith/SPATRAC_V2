import { create } from 'zustand';
import { Product, Recipe, User } from '../types';

interface StoreState {
  products: Product[];
  recipes: Recipe[];
  users: User[];
  addProduct: (product: Product) => void;
  addRecipe: (recipe: Recipe) => void;
  importProducts: (products: Product[]) => void;
  importRecipes: (recipes: Recipe[]) => void;
  transferProduct: (productId: string, department: string, managerId: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  products: [],
  recipes: [],
  users: [
    { id: '1', name: 'John Doe', role: 'admin' },
    { id: '2', name: 'Jane Smith', role: 'manager', department: 'butchery' },
  ],
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  addRecipe: (recipe) =>
    set((state) => ({ recipes: [...state.recipes, recipe] })),
  importProducts: (products) =>
    set((state) => ({ products: [...state.products, ...products] })),
  importRecipes: (recipes) =>
    set((state) => ({ recipes: [...state.recipes, ...recipes] })),
  transferProduct: (productId, department, managerId) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId
          ? { ...product, department, lastHandledBy: managerId }
          : product
      ),
    })),
}));