import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useCartStorage } from "@/app/stores/CartStorage";

export default function ProductCard({product}) {
    return(
        <div className="border grid grid-cols-1 place-content-between align-text-top p-4">
            <Link href={`/product/${product.id}`}>
            <img src={product.images[0]} className="h-40 m-4"/></Link>
            <h3 className=" font-bold text-xl">{product.title}</h3>
            <p className="content-start">{product.description}</p>
            <p>Price: ${product.price}</p>
            <div className="flex place-content-end gap-2">
                  <div className="w-8 h-8 bg-red-300 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-500" onClick={() => useCartStorage.getState().addToCart(product)}>
                    <FontAwesomeIcon icon={faShoppingCart} data-testid="icon" />
                  </div>
                  <div className="w-8 h-8 bg-red-300 rounded-full flex justify-center items-center cursor-pointer hover:bg-red-500">
                    <FontAwesomeIcon icon={faHeart} data-testid="icon" />
                  </div>
                </div>
        </div>
    )
}