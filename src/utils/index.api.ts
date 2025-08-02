import axios from "axios";

// const API_URL = "http://localhost:3002/api";
const API_URL = "https://143.110.150.238:3002/api";
// const API_URL = "https://melly-s-fashion-backend.onrender.com/api";
const AUTH_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYWRtaW4iLCJ1c2VySWQiOiJlNDE5MzgzOS01MzU0LTRjNGUtODY4Yy1kYmM5YmYwYzE4MTciLCJyb2xlIjoiQWRtaW4iLCJpYXQiOjE3NTI0NzY0NjMsImV4cCI6MTc1MjU2Mjg2M30.fCrezMjo0DUWtmaatBME43KPfnwwQ-kg0MWQ-IQKtfg";

// Phone number formatting utility for Ethiopian numbers
const formatEthiopianPhoneNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle different Ethiopian phone number formats
  if (cleaned.startsWith('251')) {
    // Already in +251 format, just add the +
    const formatted = `+${cleaned}`;
    console.log(`Phone number formatted: ${phoneNumber} -> ${formatted}`);
    return formatted;
  } else if (cleaned.startsWith('0')) {
    // Remove leading 0 and add +251
    const formatted = `+251${cleaned.substring(1)}`;
    console.log(`Phone number formatted: ${phoneNumber} -> ${formatted}`);
    return formatted;
  } else if (cleaned.length === 9) {
    // 9-digit number, add +251
    const formatted = `+251${cleaned}`;
    console.log(`Phone number formatted: ${phoneNumber} -> ${formatted}`);
    return formatted;
  } else if (cleaned.length === 10 && cleaned.startsWith('9')) {
    // 10-digit number starting with 9, add +251
    const formatted = `+251${cleaned}`;
    console.log(`Phone number formatted: ${phoneNumber} -> ${formatted}`);
    return formatted;
  } else {
    // Assume it's already in the correct format or return as is
    const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    console.log(`Phone number formatted: ${phoneNumber} -> ${formatted}`);
    return formatted;
  }
};

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
    console.log("getCart called with userId:", userId);
    if (!userId) {
      const guestCart = getGuestCart();
      console.log("Returning guest cart:", guestCart);
      return { cart: guestCart };
    }
    try {
      console.log("Fetching cart from API for user:", userId);
      const response = await apiClient.get(`/cart/${userId}`);
      console.log("Cart API response:", response.data);
      // Backend returns cart items directly, not wrapped in a cart property
      return { cart: response.data };
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
    console.log("addToCart called with userId:", userId, "productId:", productId);
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
      console.log("Added to guest cart:", cart);
      return { cart };
    }
    
    try {
      console.log("Adding to server cart with payload:", {
        user_id: userId,
        product_id: productId,
        title,
        price,
        image,
        quantity,
        size,
        color: selectedColor,
      });
      const response = await apiClient.post("/cart/add", {
        user_id: userId,
        product_id: productId,
        title,
        price,
        image,
        quantity,
        size,
        color: selectedColor,
      });
      console.log("Server cart response:", response.data);
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
      const formattedPhoneNumber = formatEthiopianPhoneNumber(phone_number);
      console.log(`Sending OTP to: ${formattedPhoneNumber}`);
      const response = await axios.post(`${API_URL}/auth/sendotp`, {
        phone_number: formattedPhoneNumber,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },

  login: async (name: string, otp: string, email: string, phoneNumber: string) => {
    try {
      const formattedPhoneNumber = formatEthiopianPhoneNumber(phoneNumber);
      console.log(`Logging in with phone: ${formattedPhoneNumber}`);
      // For login, we might not want to send the auth token
      const response = await axios.post(`${API_URL}/auth/login`, {
        name,
        otp,
        email,
        phone_number: formattedPhoneNumber,
      });
      return response.data;
    } catch (error: any) {
      console.error('Error during login:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
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

  updateCart: async (userId: string | null, cartItemId: string, quantity: number) => {
    console.log("updateCart called with:", { userId, cartItemId, quantity });
    
    if (!userId) {
      const cart = getGuestCart();
      const updatedCart = cart.map((item: any) => 
        item.id === cartItemId ? { ...item, quantity } : item
      );
      setGuestCart(updatedCart);
      return { cart: updatedCart };
    }
    
    try {
      console.log("Making PATCH request to:", `/cart/update/${cartItemId}`);
      const response = await apiClient.patch(`/cart/update/${cartItemId}`, {
        quantity,
      });
      console.log("Update cart response:", response.data);
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
  },

  // Telebirr Payment Methods
  initiateTelebirrB2B: async (payloadData: {
    amount: string;
    title: string;
    currency?: string;
    userId?: string;
    orderId?: string;
  }) => {
    try {
      const response = await axios.post(
        `${API_URL}/telebirr/b2b/initiate`,
        payloadData,
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: AUTH_TOKEN 
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error initiating Telebirr B2B payment:", error);
      throw error;
    }
  },

  initiateTelebirrH5: async (payloadData: {
    amount: string;
    title: string;
    currency?: string;
    userId?: string;
    orderId?: string;
  }) => {
    try {
      const response = await axios.post(
        `${API_URL}/telebirr/create-payment`,
        payloadData,
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: AUTH_TOKEN 
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error initiating Telebirr H5 payment:", error);
      throw error;
    }
  },

  initiateTelebirrMiniApp: async (payloadData: {
    amount: string;
    title: string;
    currency?: string;
    userId?: string;
    orderId?: string;
  }) => {
    try {
      const response = await axios.post(
        `${API_URL}/telebirr/miniapp/initiate`,
        payloadData,
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: AUTH_TOKEN 
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error initiating Telebirr Mini App payment:", error);
      throw error;
    }
  },

  queryTelebirrPaymentStatus: async (merchOrderId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/telebirr/status/${merchOrderId}`,
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: AUTH_TOKEN 
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error querying Telebirr payment status:", error);
      throw error;
    }
  },

  getTelebirrPaymentHistory: async (userId: string, page?: number, limit?: number) => {
    try {
      const params = new URLSearchParams();
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());

      const response = await axios.get(
        `${API_URL}/telebirr/history/${userId}?${params.toString()}`,
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: AUTH_TOKEN 
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting Telebirr payment history:", error);
      throw error;
    }
  }
};

