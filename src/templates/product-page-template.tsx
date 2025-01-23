'use client';

import Header from '@/components/header';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface ProductDetails {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  images: string[];
}

interface ProductPageTemplateProps {
  productId: string;
}

const ProductPageTemplate: React.FC<ProductPageTemplateProps> = ({ productId }) => {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`https://dummyjson.com/products/${productId}`);
        setProductDetails(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(true);
        console.error('Error fetching product details:', error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error || !productDetails) {
    return <p>Error fetching product details.</p>;
  }

  const discountedPrice =
    productDetails.price - (productDetails.price * productDetails.discountPercentage) / 100;

  return (
    <>
      <Header />
      <section className="py-8 md:py-16 dark:bg-gray-900 antialiased bg-[#fafafa]">
        <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            <div className="shrink-0 max-w-md lg:max-w-lg mx-auto">
              {imageLoading && (
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                </div>
              )}

              <Image
                width={500}
                height={500}
                className="w-full rounded-lg"
                src={productDetails.images[0]}
                alt={productDetails.title}
                onLoadingComplete={() => setImageLoading(false)}
              />
            </div>
            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                {productDetails.title}
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {productDetails.category}
              </p>
              <div className="mt-4 flex items-center gap-4">
                <p className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
                  ${discountedPrice.toFixed(2)}{' '}
                  <span className="line-through text-gray-500 dark:text-gray-400">
                    ${productDetails.price.toFixed(2)}
                  </span>
                </p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, index) => (
                    <svg
                      key={index}
                      className={`h-4 w-4 ${
                        index < Math.round(productDetails.rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="mt-4 text-gray-700 dark:text-gray-300">{productDetails.description}</p>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Brand:{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {productDetails.brand}
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Stock:{' '}
                <span className="font-medium text-gray-900 dark:text-white">
                  {productDetails.stock}
                </span>
              </p>
              <div className="mt-6 sm:gap-4 sm:flex">
                <button className="flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800">
                  Add to Cart
                </button>
                <button className="flex items-center justify-center px-5 py-2.5 mt-4 text-sm font-medium text-gray-900 bg-gray-200 rounded-lg hover:bg-gray-300 sm:mt-0">
                  Add to Favorites
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPageTemplate;
