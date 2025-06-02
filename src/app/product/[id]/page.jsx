// export default async function ProductPage({ params }) {
//     const id = params.id

//     const res = await fetch('https://api.escuelajs.co/api/v1/products?offset=0&limit=20');
//                 const data = await res.json();
//                 setProducts(data);

//     return (
//      <div>
//         <h1>{product.title}</h1>
//         <img src={product.images} className="h-80 mx-auto"/>
//         <p>{product.description}</p>
//         <p>{product.price}</p>
//      </div>
//     )
// }