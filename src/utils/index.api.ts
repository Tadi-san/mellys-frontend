import axios from "axios";
import { get } from "http";

const API_URL = "http://localhost:3002/api";
// const API_URL = "https://ali-express-clone.onrender.com/api";
const authToken = ""

export const api = {
  login: async (name: string, otp: string, email: string, phoneNumber: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        name,
        otp,
        email,
        phone_number: phoneNumber,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getCategories: async () => {
    try {
      const response = await axios.get(`${API_URL}/categories/`);
      return response.data as any[];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
getProducts: async () => {
  try {
    const response = await axios.get(`${API_URL}/products/`);
    return response.data as any[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
},
  getProductDetails: async (productId: string) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  },

  getCart: async () => {
    try {
      const response = await axios.get(`${API_URL}/cart/data`, {
        headers: { Authorization: authToken },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  addToCart: async (
    productId: string,
    title: string,
    price: string,
    image: string,
    quantity: number,
    size: string,
    selectedColor: string
  
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/add`,
        { productId, title, price, image, quantity, size, selectedColor },
        { headers: { "Content-Type": "application/json", Authorization: authToken } }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  updateCart: async (productId: string, quantity: number,) => {
    try {
      const response = await axios.patch(
        `${API_URL}/cart/${productId}`,
        { productId, quantity },
        { headers: { "Content-Type": "application/json", Authorization: authToken } }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    }
  },

  getWishlist: async () => {
    try {
      const response = await axios.get(`${API_URL}/wishlist/data`, {
        headers: { Authorization: authToken },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  },

  addToWishlist: async (productId: string, title: string, price: string, image: string, ) => {
    try {
      const response = await axios.post(
        `${API_URL}/wishlist/add`,
        { productId, title, price, image },
        { headers: { "Content-Type": "application/json", Authorization: authToken } }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  },

  removeFromWishlist: async (productId: string, ) => {
    try {
      const response = await axios.delete(`${API_URL}/wishlist/removeone/${productId}`, {
        headers: { "Content-Type": "application/json", Authorization: authToken },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  },

  getUser: async (id:string) => {
    try {
      const response = await axios.get(`${API_URL}/users/${id}`, {
        headers: { Authorization: authToken },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  },

  uploadImage: async (formData: FormData, id: string) => {
    try {
      const response = await axios.post(`${API_URL}/uploads/?product_id=${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: authToken },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },
  

  postProducts: async (payloadData: any) => {
    try {
      console.log(payloadData)
      const response = await axios.post(`${API_URL}/products`, payloadData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: authToken },
      });
      return response.data;
    } catch (error) {
      console.error("Error posting product:", error);
      throw error;
    }
  },
};
