// Authentication utilities
import Cookies from "js-cookie";

export interface User {
  id: string;
  name: string;
  email?: string;
  phone_number?: string;
  role: string;
}

export const getUser = (): User | null => {
  const userCookie = Cookies.get("UserAuth");
  return userCookie ? JSON.parse(userCookie) : null;
};

export const setUser = (user: User) => {
  Cookies.set("UserAuth", JSON.stringify(user), { expires: 7 });
};

export const removeUser = () => {
  Cookies.remove("UserAuth");
};

export const isAuthenticated = (): boolean => {
  return !!getUser();
};

// Generate a temporary guest ID for unauthenticated users
export const getGuestId = (): string => {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

export const clearGuestId = () => {
  localStorage.removeItem("guestId");
};