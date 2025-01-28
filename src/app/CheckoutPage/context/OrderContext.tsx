"use client";
import {
  createContext,
  useContext,
  useState,
  FC,
  ReactNode,
  useEffect,
} from "react";

interface OrderContextProps {
  order: Order;
  setOrder: React.Dispatch<React.SetStateAction<Order>>;
}

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: FC<OrderProviderProps> = ({ children }) => {
  const [order, setOrder] = useState<Order>({
    items: [],
    totalPrice: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const initialData: Order = {
        items: [
          {
            productId: "product_id_1",
            name: "Product 1",
            image: "/products/p1.jpg",
            quantity: 2,
            price: 19.99,
          },
          {
            productId: "product_id_2",
            name: "Product 2",
            image: "/products/p1.jpg",
            quantity: 1,
            price: 29.99,
          },
        ],
        totalPrice: 69.97,
      };

      setOrder(initialData);
    };

    fetchData();
  }, []);

  return (
    <OrderContext.Provider value={{ order, setOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
