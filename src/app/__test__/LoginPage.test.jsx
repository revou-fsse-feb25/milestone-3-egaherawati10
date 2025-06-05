import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '@/login/page';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from "react-toastify";

//  mock next-auth login
jest.mock('next-auth/react', () => ({
    signIn: jest.fn(),
}));

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}));

jest.mock("react-toastify", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe("LoginPage", () => {
    const push = jest.fn();

it("renders login form", () => {
    render(<LoginPage />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
});

it("submits login and navigates on success", async () => {
    signIn.mockResolvedValueOnce({ ok: true });

    render(<LoginPage />);

    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });
    
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
        expect(signIn).toHaveBeenCalledWith("credentials", { email: "test@example.com", password: "password123", redirect: false });
    });

    expect(push).toHaveBeenCalledWith("/dashboard");
});

it("shows error toast on failed login", async () => {
    signIn.mockResolvedValueOnce({ ok: false });

    const { getByPlaceholderText, getByRole } = render(<LoginPage />);
    fireEvent.change(getByPlaceholderText("Email"), { target: { value: "failed@example.com" } 
});
    fireEvent.change(getByPlaceholderText("Password"), { target: { value: "failure123" } 
});
    fireEvent.click(getByRole("button", { name: "Login" }));

    await waitFor(() => {
        expect(signIn).toHaveBeenCalled();
    });

    const { toast } = require("react-toastify");
    expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
});