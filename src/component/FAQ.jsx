import { useState } from 'react';

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping usually takes 3-5 days. Express options are available at checkout.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We accept returns within 30 days of delivery. Items must be unused and in original packaging.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship to over 50 countries. Shipping fees and delivery times vary by location.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "If your order hasn't shipped yet, you can contact our support team to change or cancel it.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Bank Transfers, Credit/Debit Cards, PayPal, Cash on Delivery, and e-Wallets.",
  },
];

export default function ShopFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-800 rounded-lg bg-gray-900 shadow-sm">
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-2 py-4 flex justify-between items-center focus:not-2xl:"
            >
              <span className="font-medium">{faq.question}</span>
              <span className="text-xl">{openIndex === index ? '−' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
