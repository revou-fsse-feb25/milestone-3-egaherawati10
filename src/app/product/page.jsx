// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useCartStore } from '../stores/cartStore';
// import { useRouter } from 'next/navigation';

// const ProductListPage = () => {
//     const [products, setProducts] = useState([]);
//     const addToCart = useCartStore((state) => state.addToCart);
//     const router = useRouter();

//     useEffect(() => {
//         const fetchProducts = async () => {
//             try {
//                 const res = await fetch('https://api.escuelajs.co/api/v1/products?offset=0&limit=20');
//                 const data = await res.json();
//                 setProducts(data);
//             } catch (error) {
//                 console.error('Error fetching products:', error);
//             }
//         };

//         fetchProducts();
//     }, []);

//     const handleAddToCart = (product) => {
//         addToCart({
//             id: product.id,
//             name: product.title,
//             image: product.image[0],
//             price: product.price,
//         });
//         router.push('/cart');
//     };

//     return (
//         <div>
//             <h1>Products</h1>
//             <div>
//                 {products.map((product) => (
//                     <div key={product.id}>
//                     <img src={product.image[0]} alt={product.title} />
//                     <h2>{product.title}</h2>
//                     <p>${product.price.toFixed(2)}</p>
//                     <button onClick={() => handleAddToCart(product)}>
//                         Add to cart
//                     </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default ProductListPage;