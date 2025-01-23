import ProductPageTemplate from '@/templates/product-page-template';
import React from 'react';

type Props = {
  params: { id: string };
};

async function PoductPage({ params }: Props) {
  const { id } = await params;

  return <ProductPageTemplate productId={id} />;
}

export default PoductPage;
