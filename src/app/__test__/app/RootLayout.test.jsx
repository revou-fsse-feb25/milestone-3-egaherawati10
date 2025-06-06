import React from "react";
import { render, screen } from "@testing-library/react";
import RootLayout from "../../layout";

// Mock next/font/google
jest.mock("next/font/google", () => ({
  Geist: jest.fn(() => ({
    variable: "--font-geist-sans",
    className: 'Geist',
    style: {
        fontFamily: 'Geist',
    }
  })),
  Geist_Mono: jest.fn(() => ({
    variable: "--font-geist-mono",
    className: 'Geist_Mono',
        style: {
        fontFamily: 'Geist_Mono',
    }
  })),
}));

// Mock the SessionProviderWrapper
jest.mock("@/app/component/SessionProviderWrapper", () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="session-provider">{children}</div>,
}));

describe("RootLayout", () => {
  test("applies font CSS classes to the body", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    // Access the body element directly
    const body = document.body;
    expect(body).toHaveClass("--font-geist-sans");
    expect(body).toHaveClass("--font-geist-mono");
    expect(body).toHaveClass("antialiased");
  });

  test("renders ToastContainer", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    // Verify that ToastContainer is present in the document
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test("renders SessionProviderWrapper with children", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const sessionProvider = screen.getByTestId("session-provider");
    expect(sessionProvider).toBeInTheDocument();
    expect(sessionProvider).toHaveTextContent("Test Content"); // Check if children are rendered inside
  });
});
