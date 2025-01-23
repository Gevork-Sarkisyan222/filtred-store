import ProductPageTemplate from '@/templates/product-page-template';
import React from 'react';

type Props = {
  params: { id: string };
};

function ProductPage({ params }: Props) {
  const { id } = params;

  return <ProductPageTemplate productId={id} />;
}

export default ProductPage;
