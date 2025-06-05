import React from "react";
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShopFAQ from '@/component/FAQ'; 

describe('ShopFAQ', () => {

    const allQuestions = [
        "How long does shipping take?",
        "What is your return policy?",
        "Do you ship internationally?",
        "Can I change or cancel my order?",
        "What payment methods do you accept?"
    ];

    const allAnswers = [
        "Standard shipping usually takes 3-5 days. Express options are available at checkout.",
        "We accept returns within 30 days of delivery. Items must be unused and in original packaging.",
        "Yes! We ship to over 50 countries. Shipping fees and delivery times vary by location.",
        "If your order hasn't shipped yet, you can contact our support team to change or cancel it.",
        "We accept Bank Transfers, Credit/Debit Cards, PayPal, Cash on Delivery, and e-Wallets."
    ];

    it('should render the FAQ component', () => {
        render(<ShopFAQ />);
        allQuestions.forEach((question, index) => {
            expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
        });   
    });

it('show the answers when the question is clicked', () => {
    render(<ShopFAQ />);
    const question = screen.getByText('How long does shipping take?');
    fireEvent.click(question);
    expect(screen.getByText('Standard shipping usually takes 3-5 days. Express options are available at checkout.')).toBeInTheDocument();
});

it('hides the answers when the question is clicked again', () => {
    render(<ShopFAQ />);
    const question = screen.getByText('How long does shipping take?');
    fireEvent.click(question);
    expect(screen.getByText('Standard shipping usually takes 3-5 days. Express options are available at checkout.')).toBeInTheDocument();
    fireEvent.click(question);
    expect(screen.queryByText('Standard shipping usually takes 3-5 days. Express options are available at checkout.')).toBeNull();
});

it('only shows one answer at a time', () => {
    render(<ShopFAQ />);
    const firstQuestion = screen.getByText(allQuestions[0]);
    const secondQuestion = screen.getByText(allQuestions[1]);

    fireEvent.click(firstQuestion);
    expect(screen.getByText(allAnswers[0])).toBeInTheDocument();

    fireEvent.click(secondQuestion);
    expect(screen.getByText(allAnswers[1])).toBeInTheDocument();
    expect(screen.queryByText(allAnswers[0])).toBeInTheDocument();
    });
});