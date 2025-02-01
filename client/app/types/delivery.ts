// types/delivery.ts
export interface Product {
  _id: string;
  name: string;
  price: number;
  subCategory: string;
  discount: number;
  availability: string;
  avatars: string[];
  brand: string;
  colors: string[];
  description: string;
  sizes: string[];
}

export interface OrderItem {
  _id: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  address: string[];
  createdAt: string;
  updatedAt: string;
  verified: boolean;
  discount: number;
  password: string;
}

export interface Delivery {
  _id: string;
  createdAt: string;
  itemsPrice: number;
  orderItems: OrderItem[];
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: ShippingAddress;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  updatedAt: string;
  userId: User;
}

export interface SidebarProps {
  onSelectDelivery: (deliveryId: string) => void;
}