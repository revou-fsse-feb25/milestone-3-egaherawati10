import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../login/page";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mock next-auth signIn
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

// Mock next/navigation useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: pushMock });
  });

  test("does not render form until mounted", () => {
    // We can simulate mounted state by rendering and checking null initially
    const { container } = render(<LoginPage />);
    // Initially, because mounted is false, component returns null
    expect(container.firstChild).toBeNull();
  });

  test("renders form after mount", async () => {
    // To test mounted state, we wait for useEffect to run
    render(<LoginPage />);

    // Wait for the form to appear (mounted = true)
    const heading = await screen.findByRole("heading", { name: /login/i });
    expect(heading).toBeInTheDocument();
  });

  test("shows error message on failed login", async () => {
    signIn.mockResolvedValue({ ok: false });

    render(<LoginPage />);

    // Wait for form
    await screen.findByRole("heading", { name: /login/i });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Wait for error message to appear
    const errorMsg = await screen.findByText(/invalid email or password/i);
    expect(errorMsg).toBeInTheDocument();

    // Button should be enabled again
    expect(screen.getByRole("button", { name: /login/i })).not.toBeDisabled();
  });

  test("redirects to /dashboard if user role is admin on successful login", async () => {
    signIn.mockResolvedValue({ ok: true });

    // Mock fetch to return admin role
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ user: { role: "admin" } }),
      })
    );

    render(<LoginPage />);

    await screen.findByRole("heading", { name: /login/i });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });

    // Clean up fetch mock
    global.fetch.mockRestore();
  });

  test("redirects to /profile if user role is not admin on successful login", async () => {
    signIn.mockResolvedValue({ ok: true });

    // Mock fetch to return non-admin role
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ user: { role: "user" } }),
      })
    );

    render(<LoginPage />);

    await screen.findByRole("heading", { name: /login/i });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/profile");
    });

    // Clean up fetch mock
    global.fetch.mockRestore();
  });

  test("disables login button while loading", async () => {
    // Make signIn resolve after a delay to test loading state
    let resolveSignIn;
    signIn.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSignIn = resolve;
        })
    );

    render(<LoginPage />);
    await screen.findByRole("heading", { name: /login/i });

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password" },
    });

    const button = screen.getByRole("button", { name: /login/i });
    fireEvent.click(button);

    // Button should be disabled and show "Logging in..."
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent(/logging in/i);

    // Resolve signIn to finish loading
    resolveSignIn({ ok: false });

    await waitFor(() => expect(button).not.toBeDisabled());
  });
});
