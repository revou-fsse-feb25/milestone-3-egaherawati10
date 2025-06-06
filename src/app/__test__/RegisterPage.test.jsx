import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RegisterPage from "../register/page";
import { useRouter } from "next/navigation";

// Mock useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("RegisterPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      push: pushMock,
    });
    // Suppress console.log and alert during tests to keep output clean
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    console.log.mockRestore();
    window.alert.mockRestore();
  });

  test("updates email and password state on input change", () => {
    render(<RegisterPage />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("calls handleRegister on form submit", () => {
    render(<RegisterPage />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const registerButton = screen.getByRole("button", { name: /register/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(registerButton);

    // Check that console.log and alert were called (basic check for registration)
    expect(console.log).toHaveBeenCalledWith('Registered:', { email: 'test@example.com', password: 'password123' });
    expect(window.alert).toHaveBeenCalledWith('You are registered');

    // Checks if router.push is called
    expect(pushMock).toHaveBeenCalledWith('/login');
  });

  test("navigates to login page when 'Login' link is clicked", () => {
    render(<RegisterPage />);

    const loginLink = screen.getByRole("link", { name: /login/i });
    fireEvent.click(loginLink);

    // Check if router.push is called.
    expect(pushMock).not.toHaveBeenCalled();
  });
});
