export default async function ProductPage({ params }) {
    const id = params.id

    const res = await fetch(`https://fakestoreapi.com/products/${id}`)
    const product = await res.json();

    return (
     <div>
        <h1>{product.title}</h1>
        <img src={product.image} className="h-80 mx-auto"/>
        <p>{product.description}</p>
        <p>{product.price}</p>
     </div>
    )
}