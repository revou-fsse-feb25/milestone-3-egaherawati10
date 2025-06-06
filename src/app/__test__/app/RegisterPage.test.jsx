import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../../register/page";
import { useRouter } from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock alert
global.alert = jest.fn();

describe("RegisterPage", () => {
  const push = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the register form", () => {
    render(<RegisterPage />);
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("fills and submits the form", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign Up"));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("You are registered");
      expect(push).toHaveBeenCalledWith("/login");
    });
  });

  it("shows loading text when submitting", async () => {
    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "loading@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "loading123" },
    });

    fireEvent.click(screen.getByText("Sign Up"));

    expect(await screen.findByText("Register your account...")).toBeInTheDocument();
  });
});
