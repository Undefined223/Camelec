export interface ImageFile {
    id: string;
    url: string;
    order: number;
  }

  export interface FormDataa {
    productName: string;
    category: string;
    subcategory: string;
    description: string;
    price: string;
    brand: string;
    availability: string;
    colors: string[];
    sizes: string[];
    images: Array<{ file: File }>;
    discount?: number;  // Added this field
  }

  // types.ts
// types.ts
export interface IProduct {
  _id: string;
  name: string;
  price: number;
  subCategory: string; // Assuming it's a string (ObjectId in the schema)
  discount: number;
  brand: string;
  colors: string[];
  sizes: string[];
  avatars: string[];
  availability: string;
  description: string;
}

export interface IOrderItem {
  product: IProduct; // Product details
  quantity: number;
  price: number; // Price at the time of ordering
}

export interface IShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface IOrder {
  _id: string;
  orderItems: IOrderItem[];
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  paymentRef?: string; // Optional field
  paymentStatus: string;
  orderStatus: string;
  userId: string; // User ID (or use a more specific type if needed)
  createdAt?: string;
  updatedAt?: string;
}