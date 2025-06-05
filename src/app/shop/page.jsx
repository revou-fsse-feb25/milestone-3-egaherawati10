// app/shop/page.js

import { getProducts } from '@/services/productService';
import Image from 'next/image';

// ISR: revalidate every 60 seconds
export const revalidate = 60;

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Shop Our Products</h1>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-6">
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={200}
              className="rounded-md mb-4 object-cover"
            />
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-gray-700 mb-2">${product.price.toFixed(2)}</p>
            <p className="text-gray-500 text-sm">{product.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
