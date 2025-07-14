interface OrderRes {
  status: string;
  checkoutPayload: CheckoutPayload;
}

interface CheckoutPayload {
  customer: Customer;
  paymentMethod: PaymentMethod;
}

interface Order2 {
  items: OrderItem2[];
  totalPrice: number;
}

interface OrderItem2 {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  items: OrderItem[];
  totalPrice: number;
}

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Customer {
  name: string;
  email: string;
  // address: string;
}

interface PaymentMethod {
  type: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
}
