import axios from "axios";
import { get } from "http";

const API_URL = "http://localhost:3002/api";
// const API_URL = "https://melly-s-fashion-backend.onrender.com/api";
const authToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJ1c2VySWQiOiJlNDE5MzgzOS01MzU0LTRjNGUtODY4Yy1kYmM5YmYwYzE4MTciLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NDI0NTU3NzQsImV4cCI6MTc0MjU0MjE3NH0.N3yf6fFZgQwoLw5-cowT_cInKFFGe5XV70LUO5vBbM0"

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
      const response = await axios.get(`${API_URL}/categories/`, {
        headers: { Authorization: authToken }});
      return response.data as any[];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
getProducts: async () => {
  try {
    const response = await axios.get(`${API_URL}/products/` ,{
      headers: { Authorization: authToken }});
    return response.data as any[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
},
  getProductDetails: async (productId: string) => {
    try {
      const response = await axios.get(`${API_URL}/products/${productId}` ,{
        headers: { Authorization: authToken }});
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  },

  getCart: async (id:string) => {
    try {
      const response = await axios.get(`${API_URL}/cart/${id}`, {
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
    selectedColor: string,
    user_id: string
  
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/add`,
        { product_id:productId, title, price, image, quantity, size, color:selectedColor, user_id },
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

  getWishlist: async (id:string) => {
    try {
      const response = await axios.get(`${API_URL}/wishlist/${id}`, {
        headers: { Authorization: authToken },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  },

  addToWishlist: async (user_id:string, product_id:string ) => {
    try {
      const response = await axios.post(
        `${API_URL}/wishlist/add`,
        { user_id, product_id  },
        { headers: { "Content-Type": "application/json", Authorization: authToken } }
      );
      return response.data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  },

  removeFromWishlist: async (productId: string, user_id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/wishlist/remove/${productId}/${user_id}`, {
        headers: { "Content-Type": "application/json", Authorization: authToken },
      });
      return response.data;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  },

  removeFromCart: async (productId: string, ) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/remove/${productId}`, {
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

  initiatePayment: async (payloadData: {
    amount: string;
    currency: string;
    referenceNumber: string;
  }) => {
    try {
      const response = await axios.post(
        `${API_URL}/payments/initiate-payment`, // Your payment endpoint
        payloadData,
        {
          headers: { 
            "Content-Type": "application/json", // Keep as JSON for CyberSource
            Authorization: authToken 
          },
          responseType: "text" // Important to get raw HTML response
        }
      );
      return response ;
    } catch (error) {
      console.error("Error initiating payment:", error);
      throw error;
    }
  }
};

