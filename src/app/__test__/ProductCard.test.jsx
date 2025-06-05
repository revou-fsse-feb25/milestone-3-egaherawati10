import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from '@/component/ProductCard';
import { faShoppingCart, faHeart } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useRouter } from 'next/router';

// Adding custom icons
library.add(faShoppingCart, faHeart);

// Mock next/link to render children
jest.mock('next/link', () => {
    return ({ children, href }) => <a href={href}>{children}</a>;
});

// Mock router
jest.mock('next/router', () => ({
    userRouter: jest.fn()
}));

describe('ProductCard', () => {
    const mockProduct = {
        id: 1,
        title: 'Product 1',
        description: 'Description 1',
        price: 10,
        image: 'https://via.placeholder.com/150'
    };

    it('should render the product title', () => {
        render(<ProductCard product={mockProduct} />);

        // check image
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', mockProduct.image);

        // check title
        expect(screen.getByText(mockProduct.title)).toBeInTheDocument();

        // check description
        expect(screen.getByText(mockProduct.description)).toBeInTheDocument();

        // check price
        expect(screen.getByText(`Price: ${mockProduct.price}`)).toBeInTheDocument();
    });

    it('displays shopping cart and heart icons', () => {
        render(<ProductCard product={mockProduct} />);
        const icons = screen.getAllByTestId('icon');
        expect(icons.length).toBe(2);
    });
});