import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';

export default function ProductCard({product}) {
    return(
        <div className="border grid grid-cols-1 place-content-between align-text-top p-4">
            <Link href={`/product/${product.id}`}>
            <img src={product.image} className="h-40 m-4"/></Link>
            <h3 className=" font-bold text-xl">{product.title}</h3>
            <p className="content-start">{product.description}</p>
            <p>Cost: ${product.price}</p>
            <div className="flex place-content-end gap-2">
                  <div className="w-8 h-8 bg-red-300 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-500">
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </div>
                  <div className="w-8 h-8 bg-red-300 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-500">
                    <FontAwesomeIcon icon={faHeart} />
                  </div>
                </div>
        </div>
    )
}