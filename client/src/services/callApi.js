import Cookies from 'js-cookie';
import { authInstance, publicInstance } from './instance';

const errorHandle = (error) => {
  const errorMessage = error.response?.data?.message || 'Something went wrong';
  return Promise.reject(new Error(errorMessage));
};

const callApi = {
  login: async (formData) => {
    return publicInstance
      .post('/auth/login', formData)
      .then((res) => {
        const { accessToken } = res.data;
        Cookies.set('accessToken', accessToken, { expires: 1 });
        return res.data;
      })
      .catch(errorHandle);
  },

  logout: async () => {
    return authInstance
      .post('/auth/logout')
      .then((res) => {
        Cookies.remove('accessToken');
        return res.data.message;
      })
      .catch(errorHandle);
  },

  register: async (formData) => {
    return publicInstance
      .post('/auth/register', formData)
      .then((res) => res.data)
      .catch(errorHandle);
  },

  sendOTP: async (formData) => {
    return publicInstance
      .post('/auth/send-otp', formData)
      .then((res) => res.data);
  },

  verifyOTP: async (formData) => {
    return publicInstance
      .post('/auth/verify-otp', formData)
      .then((res) => res.data)
      .catch(errorHandle);
  },

  refreshToken: async () => {
    return publicInstance
      .get('/refresh')
      .then((res) => res.data.accessToken)
      .catch(errorHandle);
  },

  resetPassword: async (token, formData) => {
    return publicInstance
      .put(`/auth/reset/${token}`, formData)
      .then((res) => res.data)
      .catch(errorHandle);
  },

  authCheck: async () => {
    return authInstance
      .get('/auth/me')
      .then((res) => res.data.payload)
      .catch(errorHandle);
  },

  getProfile: async () => {
    return authInstance
      .get('/user/profile')
      .then((res) => res.data.payload)
      .catch(errorHandle);
  },

  updateProfile: async (formData) => {
    return authInstance
      .put('/user/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data)
      .catch(errorHandle);
  },

  getAddress: async () => {
    return authInstance
      .get('/user/profile/address')
      .then((res) => res.data.payload)
      .catch(errorHandle);
  },

  addAddress: async (formData) => {
    return authInstance
      .post('/user/profile/address', formData)
      .then((res) => res.data)
      .catch(errorHandle);
  },

  updateAddress: async (formData, addressId) => {
    return authInstance
      .put(`/user/profile/address/${addressId}`, formData)
      .then((res) => res.data)
      .catch(errorHandle);
  },

  deleteAddress: async (addressId) => {
    return authInstance
      .delete(`/user/profile/address/${addressId}`)
      .then((res) => res.data)
      .catch(errorHandle);
  },

  getProduct: async (slug) => {
    return authInstance
      .get(`/product/${slug}`)
      .then((res) => res.data.data)
      .catch(errorHandle);
  },

  getProducts: async ({
    search = '',
    city = [],
    category = [],
    minPrice = '',
    maxPrice = '',
    page = 1,
    sortBy = 'price',
    orderBy = 'asc',
    limit,
  }) => {
    return authInstance
      .get(
        `/product?search=${search}&city=${city}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&page=${page}&sortBy=${sortBy}&orderBy=${orderBy}&limit=${limit}`,
      )
      .then((res) => res.data)
      .catch(errorHandle);
  },

  getCategories: async () => {
    return authInstance
      .get('/category')
      .then((res) => res.data.data)
      .catch(errorHandle);
  },

  getStoreInfo: async (slug) => {
    return authInstance
      .get(`/store/${slug}`)
      .then((res) => res.data)
      .catch(errorHandle);
  },

  getStoreProfile: async () => {
    return authInstance
      .get(`/store`)
      .then((res) => res.data)
      .catch(errorHandle);
  },

  getStoreProduct: async ({
    sortBy = 'createdAt',
    orderBy = 'desc',
    page = 1,
    limit = 10,
    search = '',
  }) => {
    return authInstance
      .get(
        `/store/product?search=${encodeURIComponent(
          search,
        )}&sortBy=${sortBy}&orderBy=${orderBy}&page=${page}&limit=${limit}}`,
      )
      .then((res) => res.data)
      .catch(errorHandle);
  },

  createProduct: async (formData) => {
    console.log(formData);
    return authInstance
      .post('/store/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data)
      .catch(errorHandle);
  },

  updateProduct: async (formData, productId) => {
    return authInstance
      .put(`/store/product/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data)
      .catch(errorHandle);
  },

  deleteProduct: async (productId) => {
    return authInstance
      .delete(`/store/product/${productId}`)
      .then((res) => res.data)
      .catch(errorHandle);
  },

  createStore: async (formData) => {
    return authInstance
      .post('/auth/open-store', formData)
      .then((res) => res.data)
      .catch(errorHandle);
  },
};

export default callApi;
