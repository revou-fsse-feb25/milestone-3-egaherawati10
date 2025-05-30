"use client"

import React from "react";
import { useCartStore } from "../stores/cartStore";

const CartPage = () => {
    const {
        cartItems, incrementQuantity, decrementQuantity, removeItem,
    } = useCartStore();

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    return (
        <div>
            <h1>Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                <div>
                    {cartItems.map((item) => (
                        <div key={item.id}>
                            <img src={item.image} alt={item.name} />
                            <div>
                                <h2>{item.name}</h2>
                                <p>Price: ${item.price}</p>
                                <div>
                                    <button onClick={() => decrementQuantity(item.id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => incrementQuantity(item.id)}>+</button>
                                </div>
                            </div>
                            <div>
                                <button onClick={() => removeItem(item.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <h2>Total:</h2>
                    <span>${total.toFixed(2)}</span>
                </div>

                <div>
                    <button>Checkout</button>
                </div>
                </>
            )}
        </div>
    );
};

export default CartPage;