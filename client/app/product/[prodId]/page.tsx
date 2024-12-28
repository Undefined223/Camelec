import { Metadata } from 'next';
import ClientProductPage from './ClientProductPage';
import axiosInstance from '@/app/components/AxiosInstance';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  brand: string;
  avatars: string[];
  availability: 'En stock' | 'On order' | 'Out of stock';
  description: string;
  colors: string[];
}

async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const { data } = await axiosInstance.get(`/api/products/${id}`);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

type Props = {
  params: { prodId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProduct(params.prodId);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'This product could not be found.',
    };
  }

  return {
    title: `${product.name} - Buy Online at My E-commerce Store`,
    description: product.description || "Product description",
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.avatars[0]}` }],
      url: `https://infoplus-store.com/product/${params.prodId}`,
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await fetchProduct(params.prodId);

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ClientProductPage prodId={params.prodId} />;
}
