import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../../login/page";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mocks
jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn(); // mock fetch used for getting session

describe("LoginPage", () => {
  const push = jest.fn();
  const replace = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push, replace });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the login form", async () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<LoginPage />);
    expect(await screen.findByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("fills and submits the form with correct credentials (admin)", async () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    signIn.mockResolvedValue({ ok: true });
    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          user: { role: "admin" },
        }),
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "admin@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        redirect: false,
        email: "admin@example.com",
        password: "password123",
      });
      expect(push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("fills and submits the form with correct credentials (user)", async () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    signIn.mockResolvedValue({ ok: true });
    fetch.mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          user: { role: "user" },
        }),
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/profile");
    });
  });

  it("shows error on failed login", async () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    signIn.mockResolvedValue({ ok: false });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });
  });

  it("redirects authenticated admin", async () => {
    useSession.mockReturnValue({
      data: { user: { role: "admin" } },
      status: "authenticated",
    });

    render(<LoginPage />);

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("redirects authenticated user", async () => {
    useSession.mockReturnValue({
      data: { user: { role: "user" } },
      status: "authenticated",
    });

    render(<LoginPage />);

    await waitFor(() => {
      expect(replace).toHaveBeenCalledWith("/profile");
    });
  });
});
