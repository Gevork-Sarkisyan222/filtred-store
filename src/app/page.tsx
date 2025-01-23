import Card, { CardProps } from '@/components/card';
import FilterOptions from '@/components/filter-options';
import Header from '@/components/header';
import HomeTemplate from '@/templates/home-template';
import axios from 'axios';
import { Suspense } from 'react';

interface ProductsResponse {
  products: CardProps[];
}

export default async function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeTemplate />
    </Suspense>
  );
}
