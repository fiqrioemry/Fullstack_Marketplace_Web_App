import { create } from "zustand";
import toast from "react-hot-toast";
import callApi from "@/api/callApi";

export const useUserStore = create((set, get) => ({
  orders: null,
  profile: null,
  address: null,
  shipment: null,
  transactions: null,
  orderDetail: null,
  transactionDetail: null,
  loading: false,

  getProfile: async () => {
    set({ profile: null });
    try {
      const { profile } = await callApi.getProfile();
      set({ profile });
    } catch (error) {
      console.log(error.message);
    }
  },

  updateProfile: async (formData) => {
    set({ loading: true });
    try {
      const { message, updatedProfile } = await callApi.updateProfile(formData);
      console.log(message);
      set({ profile: updatedProfile });
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  getAddress: async () => {
    try {
      const { address } = await callApi.getAddress();
      set({ address });
    } catch (error) {
      console.log(error.message);
    }
  },

  addAddress: async (formData) => {
    try {
      set({ loading: true });
      const { message, newAddress } = await callApi.addAddress(formData);
      get().setNewAddress(newAddress);
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  setNewAddress: (newAddress) => {
    set((state) => ({
      address: newAddress.isMain
        ? state.address
            .map((add) => ({ ...add, isMain: false }))
            .concat(newAddress)
        : [...state.address, newAddress],
    }));
  },

  updateAddress: async (formData, addressId) => {
    try {
      set({ loading: true });
      const { message, updatedAddress } = await callApi.updateAddress(
        formData,
        addressId
      );

      get().setUpdatedAddress(addressId, updatedAddress);

      toast.success(message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      set({ loading: false });
    }
  },

  setUpdatedAddress: (addressId, updatedAddress) => {
    set((state) => ({
      address: state.address.map((add) =>
        add.id === addressId
          ? updatedAddress
          : updatedAddress.isMain
          ? { ...add, isMain: false }
          : add
      ),
    }));
  },

  deleteAddress: async (addressId) => {
    try {
      set({ loading: true });
      const { message } = await callApi.deleteAddress(addressId);
      get().setDeletedAddress(addressId);
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  setDeletedAddress: (addressId) => {
    set((state) => ({
      address: state.address.filter((add) => add.id !== addressId),
    }));
  },

  // customer transactions and orders management
  getAllUserOrders: async () => {
    set({ orders: null });
    try {
      const { orders } = await callApi.getAllUserOrders();
      set({ orders });
    } catch (error) {
      console.log(error.message);
    }
  },

  getUserOrderDetail: async () => {
    set({ orderDetail: null });
    try {
      const { orderDetail } = await callApi.getUserOrderDetail();
      set({ orderDetail });
    } catch (error) {
      console.log(error.message);
    }
  },

  cancelUserOrder: async (orderId) => {
    set({ loading: true });
    try {
      const { message } = await callApi.cancelUserOrder(orderId);
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  confirmOrderDelivery: async (formData, orderId) => {
    set({ loading: true });
    try {
      const { message } = await callApi.confirmOrderDelivery(formData, orderId);
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      set({ loading: false });
    }
  },

  getShipmentDetail: async () => {
    set({ shipment: null });
    try {
      const { shipment } = await callApi.getShipmentDetail();
      set({ shipment });
    } catch (error) {
      console.error(error.message);
    }
  },

  getAllTransactions: async () => {
    set({ transactions: null });
    try {
      const { transactions } = await callApi.getAllTransactions();
      set({ transactions });
    } catch (error) {
      console.error(error.message);
    }
  },

  getTransactionDetail: async (transactionId) => {
    set({ transactionDetail: null });
    try {
      const { transactionDetail } = await callApi.getTransactionDetail(
        transactionId
      );
      set({ transactionDetail });
    } catch (error) {
      console.error(error.message);
    }
  },

  createNewTransaction: async (formData) => {
    set({ loading: true });

    try {
      const { message, transactionUrl } = await callApi.createNewTransaction(
        formData
      );
      if (transactionUrl) {
        window.location.href = transactionUrl;
      }

      toast.success(message);
    } catch (error) {
      console.error(error.message);
    } finally {
      set({ loading: false });
    }
  },
}));
