import Link from 'next/link';
import React from 'react';

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface CardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
}

function Card({
  id,
  title,
  description,
  category,
  price,
  discountPercentage,
  rating,
  stock,
  tags,
  brand,
  sku,
  weight,
  dimensions,
  warrantyInformation,
  shippingInformation,
  availabilityStatus,
  reviews,
  returnPolicy,
  minimumOrderQuantity,
  meta,
  images,
  thumbnail,
}: CardProps) {
  // Расчет скидки
  const discountedPrice = price - (price * discountPercentage) / 100;

  // Создаем массив для звезд рейтинга
  const stars = Array.from({ length: 5 }, (_, index) => index < Math.round(rating));

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="h-56 w-full">
        <Link href={`/product/${id}`}>
          <img className="mx-auto h-full dark:hidden" src={thumbnail} alt={title} />
        </Link>
      </div>
      <div className="pt-6">
        <span className="rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800 dark:bg-primary-900 dark:text-primary-300">
          {`Up to ${discountPercentage}% off`}
        </span>
        <Link
          href={`/product/${id}`}
          className="block mt-4 text-lg font-semibold leading-tight text-gray-900 hover:underline dark:text-white">
          {title}
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>

        {/* Рейтинг */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center">
            {stars.map((filled, index) => (
              <svg
                key={index}
                className={`h-4 w-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M13.8 4.2a2 2 0 0 0-3.6 0L8.4 8.4l-4.6.3a2 2 0 0 0-1.1 3.5l3.5 3-1 4.4c-.5 1.7 1.4 3 2.9 2.1l3.9-2.3 3.9 2.3c1.5 1 3.4-.4 3-2.1l-1-4.4 3.4-3a2 2 0 0 0-1.1-3.5l-4.6-.3-1.8-4.2Z"></path>
              </svg>
            ))}
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{rating}</p>
        </div>

        {/* Цена */}
        <div className="mt-4">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            ${discountedPrice.toFixed(2)}
          </span>
          {discountPercentage > 0 && (
            <span className="ml-2 text-sm text-gray-500 line-through dark:text-gray-400">
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Статус */}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{availabilityStatus}</p>
      </div>
    </div>
  );
}

export default Card;
