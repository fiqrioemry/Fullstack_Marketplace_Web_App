import { create } from "zustand";
import toast from "react-hot-toast";
import callApi from "../services/callApi";

export const useShopStore = create((set) => ({
  store: [],
  profile: [],
  products: [],
  currentPage: 0,
  totalPage: 0,
  totalData: 0,
  updating: false,
  loading: false,

  getStoreProduct: async (formData) => {
    set({ loading: true });
    try {
      const { products, totalPage, totalData, currentPage } =
        await callApi.getStoreProduct(formData);
      set({
        products,
        totalPage,
        totalData,
        currentPage,
      });
    } catch (err) {
      console.log(err.message);
    } finally {
      set({ loading: false });
    }
  },
  getStoreInfo: async () => {
    set({ loading: true });
    try {
      const store = await callApi.getStoreInfo();
      set({ store });
    } catch (err) {
      console.log(err.message);
    } finally {
      set({ loading: false });
    }
  },

  getStoreProfile: async () => {
    set({ loading: true });
    try {
      const profile = await callApi.getStoreProfile();
      set({ profile });
    } catch (err) {
      console.log(err.message);
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (formData) => {
    set({ loading: false });
    try {
      console.log(formData);
      const res = await callApi.createProduct(formData);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (formData, productId) => {
    set({ loading: false });
    try {
      const res = await callApi.updateProduct(formData, productId);
      toast.success(res.message);
      const products = await callApi.getStoreProduct();
      set({ products });
    } catch (err) {
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (productId) => {
    set({ loading: false });
    try {
      const res = await callApi.deleteProduct(productId);
      toast.success(res.message);
      const products = await callApi.getStoreProducts();
      set({ products });
    } catch (err) {
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },
}));
