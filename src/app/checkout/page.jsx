"use client";

import { useState } from 'react';
// import { useRouter } from 'next/navigation';
import { useCartStore } from '../stores/cartStore';

export default function CheckoutPage() {
    // const router = useRouter();
    const { cartItems, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
   
    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    // router.push('/confirmation');

    return (
        <div>
            <h1>Checkout</h1>

            <div>
                <h2>Your Order Summary</h2>
                {cartItems.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <div>
                        {cartItems.map((item) => (
                            <div key={item.id}>
                                <div>
                                    <p>{item.name}</p>
                                    <p>{item.quantity} x ${item.price}</p>
                                </div>
                                <p>Total: ${item.price * item.quantity.toFixed(2)}</p>
                            </div>
                        ))}
                        <div>
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment method selector */}
            <div>
                <label>Payment Method:</label>
                <div>
                    <label>
                        <input 
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        // checked={form.paymentMethod === 'card'}
                        // onChange={handleChange}
                        />
                        <span>Credit/Debit Card</span>
                    </label>
                    <label>
                        <input 
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        // checked={form.paymentMethod === 'transfer'}
                        // onChange={handleChange}
                        />
                        <span>Bank Transfer</span>
                    </label>
                    <label>
                        <input 
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        // checked={form.paymentMethod === 'cod'}
                        // onChange={handleChange}
                        />
                        <span>Cash On Delivery</span>
                    </label>
                    <label>
                        <input 
                        type="radio"
                        name="paymentMethod"
                        value="wallet"
                        // checked={form.paymentMethod === 'wallet'}
                        // onChange={handleChange}
                        />
                        <span>e-Wallet</span>
                    </label>
                </div>
            </div>
        </div>
    )
}