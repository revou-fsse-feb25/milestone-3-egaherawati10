import Link from "next/link";

export default function ProductCard({product}) {
    return(
        <div className="border p-4">
            <Link href={`/product/${product.id}`}>
            <img src={product.image} className="h-40 mx-auto"/></Link>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>Cost: ${product.price}</p>
        </div>
    )
}