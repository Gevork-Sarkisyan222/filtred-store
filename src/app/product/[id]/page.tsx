import ProductPageTemplate from '@/templates/product-page-template';
import React from 'react';

function ProductPage({ params: { id } }: { params: { id: string } }) {
  return <ProductPageTemplate productId={id} />;
}

export default ProductPage;
