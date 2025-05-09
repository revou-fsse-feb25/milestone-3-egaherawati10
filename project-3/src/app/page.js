'use client'
import { useState, useEffect} from 'react';
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://api.escuelajs.co/api/v1/products?limit=12')
      .then(res => res.json())
      .then(json => setProducts);
  }, [])};

  return (
    <div>
      <h1>Our Products</h1>
      <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem'}}>
        {products.map(product => (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>
            <a>
              <img src={product.images[0]} alt={product.title} width={200} height={200} />
              <h3>{product.title}</h3>
              <p>{product.price}</p>
            </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  export async function getStaticPaths() {
    const res = await fetch('https://api.escuelajs.co/api/v1/products?limit=12');
    const products = await res.json();
    const paths = products.map(p => ({
      params: { id: p.id.toString() } }));

    return { paths, fallback: false };
  }
  export default function Product({ product }) {
    return (
      <div>
        <h1>{product.title}</h1>
        <img src={product.images[0]} alt={product.title} width={200} height={200} />
        <p>{product.price}</p>
      </div>
    );
  }
