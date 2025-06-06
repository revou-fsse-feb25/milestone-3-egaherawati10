import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ShopFAQ from "../../component/FAQ";

describe("ShopFAQ", () => {
  test("renders all FAQ questions", () => {
    render(<ShopFAQ />);

    const questions = [
      "How long does shipping take?",
      "What is your return policy?",
      "Do you ship internationally?",
      "Can I change or cancel my order?",
      "What payment methods do you accept?",
    ];

    questions.forEach((question) => {
      expect(screen.getByText(question)).toBeInTheDocument();
    });
  });

  test("no answers are visible initially", () => {
    render(<ShopFAQ />);

    const answers = [
      "Standard shipping usually takes 3-5 days. Express options are available at checkout.",
      "We accept returns within 30 days of delivery. Items must be unused and in original packaging.",
      "Yes! We ship to over 50 countries. Shipping fees and delivery times vary by location.",
      "If your order hasn't shipped yet, you can contact our support team to change or cancel it.",
      "We accept Bank Transfers, Credit/Debit Cards, PayPal, Cash on Delivery, and e-Wallets.",
    ];

    answers.forEach((answer) => {
      expect(screen.queryByText(answer)).not.toBeInTheDocument();
    });
  });

  test("clicking a question shows its answer", () => {
    render(<ShopFAQ />);

    const question = screen.getByText("How long does shipping take?");
    fireEvent.click(question);

    expect(
      screen.getByText(
        "Standard shipping usually takes 3-5 days. Express options are available at checkout."
      )
    ).toBeInTheDocument();
  });

  test("clicking the same question again hides its answer", () => {
    render(<ShopFAQ />);

    const question = screen.getByText("How long does shipping take?");
    fireEvent.click(question);
    expect(
      screen.getByText(
        "Standard shipping usually takes 3-5 days. Express options are available at checkout."
      )
    ).toBeInTheDocument();

    fireEvent.click(question);
    expect(
      screen.queryByText(
        "Standard shipping usually takes 3-5 days. Express options are available at checkout."
      )
    ).not.toBeInTheDocument();
  });

  test("only one answer is visible at a time", () => {
    render(<ShopFAQ />);

    const firstQuestion = screen.getByText("How long does shipping take?");
    const secondQuestion = screen.getByText("What is your return policy?");

    fireEvent.click(firstQuestion);
    expect(
      screen.getByText(
        "Standard shipping usually takes 3-5 days. Express options are available at checkout."
      )
    ).toBeInTheDocument();

    fireEvent.click(secondQuestion);
    expect(
      screen.getByText(
        "We accept returns within 30 days of delivery. Items must be unused and in original packaging."
      )
    ).toBeInTheDocument();

    expect(
      screen.queryByText(
        "Standard shipping usually takes 3-5 days. Express options are available at checkout."
      )
    ).not.toBeInTheDocument();
  });

  test("shows plus sign when answer is closed and minus sign when open", () => {
    render(<ShopFAQ />);

    // Get the button element containing the first question
    const firstQuestionButton = screen.getByRole("button", {
      name: /how long does shipping take\?/i,
    });

    expect(firstQuestionButton).toHaveTextContent("+");

    fireEvent.click(firstQuestionButton);
    expect(firstQuestionButton).toHaveTextContent("−");

    fireEvent.click(firstQuestionButton);
    expect(firstQuestionButton).toHaveTextContent("+");
  });
});