import { create } from "zustand";
import callApi from "@/api/callApi";

export const useProductStore = create((set) => ({
  results: null,
  product: null,
  products: null,
  categories: null,
  totalPage: 0,
  totalData: 0,
  currentPage: 0,
  loading: false,
  totalProducts: 0,
  searching: false,

  getProduct: async (slug) => {
    set({ product: null });
    try {
      const { product } = await callApi.getProduct(slug);
      set({ product });
    } catch (error) {
      set({ product: [] });
      console.log(error.message);
    }
  },

  getProducts: async (searchParams) => {
    try {
      set({ loading: true });
      const { products, totalPage, totalProducts, currentPage } =
        await callApi.getProducts(searchParams);
      set({ products, totalPage, totalProducts, currentPage });
    } catch (error) {
      console.log(error.message);
    } finally {
      set({ loading: false });
    }
  },

  getCategories: async () => {
    try {
      const categories = await callApi.getCategories();
      set({ categories });
    } catch (error) {
      console.log(error.message);
    }
  },

  searchProducts: async (search) => {
    set({ searching: true });
    try {
      const { products } = await callApi.searchProducts(search);
      set({ results: products });
    } catch {
      set({ results: [] });
    } finally {
      set({ searching: false });
    }
  },
}));
