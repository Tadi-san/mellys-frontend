import axios from "axios";

// const API_URL = "http://localhost:3002/api";
const API_URL = "https://melly-s-fashion-backend.onrender.com/api";
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJ1c2VySWQiOiJlNDE5MzgzOS01MzU0LTRjNGUtODY4Yy1kYmM5YmYwYzE4MTciLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NTI0NzY0NjMsImV4cCI6MTc1MjU2Mjg2M30.fCrezMjo0DUWtmaatBME43KPfnwwQ-kg0MWQ-IQKtfg";

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: AUTH_TOKEN,
  },
});


// Add these helper functions at the top of your index.api.ts
const getGuestCart = () => {
  const cart = localStorage.getItem('guestCart');
  return cart ? JSON.parse(cart) : [];
};

const setGuestCart = (cart: any[]) => {
  localStorage.setItem('guestCart', JSON.stringify(cart));
};

const getGuestWishlist = () => {
  const wishlist = localStorage.getItem('guestWishlist');
  return wishlist ? JSON.parse(wishlist) : [];
};

const setGuestWishlist = (wishlist: any[]) => {
  localStorage.setItem('guestWishlist', JSON.stringify(wishlist));
};


  // ... other methods ...



export const api = {

  
  getCart: async (userId: string | null) => {
    if (!userId) {
      return { cart: getGuestCart() };
    }
    try {
      const response = await apiClient.get(`/cart/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  addToCart: async (
    userId: string | null,
    productId: string,
    title: string,
    price: string,
    image: string,
    quantity: number,
    size: string,
    selectedColor: string
  ) => {
    if (!userId) {
      const cart = getGuestCart();
      const existingItem = cart.find((item: any) => 
        item.productId === productId && 
        item.size === size && 
        item.color === selectedColor
      );
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: `guest_${Date.now()}`,
          productId,
          title,
          price,
          image,
          quantity,
          size,
          color: selectedColor,
          product: { // Mimic backend response structure
            id: productId,
            name: title,
            price,
            images: [{ image_url: image }]
          }
        });
      }
      setGuestCart(cart);
      return { cart };
    }
    
    try {
      const response = await apiClient.post("/cart/add", {
        productId,
        title,
        price,
        image,
        quantity,
        size,
        selectedColor,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  removeFromCart: async (userId: string | null, itemId: string) => {
    if (!userId) {
      const cart = getGuestCart();
      const updatedCart = cart.filter((item: any) => item.id !== itemId);
      setGuestCart(updatedCart);
      return { cart: updatedCart };
    }
    
    try {
      const response = await apiClient.delete(`/cart/remove/${itemId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },

  // Similar modifications for wishlist methods
  getWishlist: async (userId: string | null) => {
    if (!userId) {
      return { wishlist: getGuestWishlist() };
    }
    try {
      const response = await apiClient.get(`/wishlist/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  },

  addToWishlist: async (
    userId: string | null,
    productId: string,
    title: string,
    price: string,
    image: string
  ) => {
    if (!userId) {
      const wishlist = getGuestWishlist();
      const existingItem = wishlist.find((item: any) => item.productId === productId);
      
      if (!existingItem) {
        wishlist.push({
          id: `guest_${Date.now()}`,
          productId,
          title,
          price,
          image,
          product: {
            id: productId,
            name: title,
            price,
            images: [{ image_url: image }]
          }
        });
        setGuestWishlist(wishlist);
      }
      return { wishlist };
    }
    
    try {
      const response = await apiClient.post("/wishlist/add", {
        productId,
        title,
        price,
        image,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  },

  removeFromWishlist: async (userId: string | null, productId: string) => {
    if (!userId) {
      const wishlist = getGuestWishlist();
      const updatedWishlist = wishlist.filter((item: any) => item.productId !== productId);
      setGuestWishlist(updatedWishlist);
      return { wishlist: updatedWishlist };
    }
    
    try {
      const response = await apiClient.delete(`/wishlist/remove/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  },
  sendOtp: async (phone_number: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/send-otp`, {
        phone_number,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },



  login: async (name: string, otp: string, email: string, phoneNumber: string) => {
    try {
      // For login, we might not want to send the auth token
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
      const response = await apiClient.get("/categories/");
      return response.data as any[];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  getProducts: async () => {
    try {
      const response = await apiClient.get("/products/");
      return response.data as any[];
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  getProductDetails: async (productId: string) => {
    try {
      const response = await apiClient.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  },

  // getCart: async (id: string) => {
  //   try {
  //     const response = await apiClient.get(`/cart/${id}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching cart:", error);
  //     throw error;
  //   }
  // },

  // addToCart: async (
  //   productId: string,
  //   title: string,
  //   price: string,
  //   image: string,
  //   quantity: number,
  //   size: string,
  //   selectedColor: string
  // ) => {
  //   try {
  //     const response = await apiClient.post("/cart/add", {
  //       productId,
  //       title,
  //       price,
  //       image,
  //       quantity,
  //       size,
  //       selectedColor,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error adding to cart:", error);
  //     throw error;
  //   }
  // },

  updateCart: async (productId: string, quantity: number) => {
    try {
      const response = await apiClient.patch(`/cart/${productId}`, {
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    }
  },

  // getWishlist: async (id: string) => {
  //   try {
  //     const response = await apiClient.get(`/wishlist/${id}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching wishlist:", error);
  //     throw error;
  //   }
  // },

  // addToWishlist: async (productId: string, title: string, price: string, image: string) => {
  //   try {
  //     const response = await apiClient.post("/wishlist/add", {
  //       productId,
  //       title,
  //       price,
  //       image,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error adding to wishlist:", error);
  //     throw error;
  //   }
  // },

  // removeFromWishlist: async (productId: string) => {
  //   try {
  //     const response = await apiClient.delete(`/wishlist/remove/${productId}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error removing from wishlist:", error);
  //     throw error;
  //   }
  // },

  // removeFromCart: async (productId: string) => {
  //   try {
  //     const response = await apiClient.delete(`/cart/remove/${productId}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error removing from cart:", error);
  //     throw error;
  //   }
  // },

  getUser: async (id: string) => {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  },

  uploadImage: async (formData: FormData, id: string) => {
    try {
      // For file uploads, we need to override the default Content-Type
      const response = await apiClient.post(`/uploads/?product_id=${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  postProducts: async (payloadData: any) => {
    try {
      console.log(payloadData);
      // For file uploads, we need to override the default Content-Type
      const response = await apiClient.post("/products", payloadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
            Authorization: AUTH_TOKEN 
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

