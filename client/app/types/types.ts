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