import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminDashboard from '../dashboard/page';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mock next-auth/react
jest.mock("next-auth/react");
// Mock next/navigation
jest.mock("next/navigation");

describe("AdminDashboard", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: pushMock });
  });

  test("renders loading state when status is loading", () => {
    useSession.mockReturnValue({ data: null, status: "loading" });

    render(<AdminDashboard />);

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test("redirects to /login when unauthenticated", async () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<AdminDashboard />);

    // Wait for useEffect to run and trigger router.push
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login");
    });
  });

  test("renders dashboard when authenticated", () => {
    const user = { name: "John Doe" };
    useSession.mockReturnValue({ data: { user }, status: "authenticated" });

    render(<AdminDashboard />);

    expect(screen.getByRole("heading", { name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome, john doe!/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /manage products/i })).toBeInTheDocument();
  });

  test("calls signOut with callbackUrl on sign out button click", () => {
    const user = { name: "John Doe" };
    useSession.mockReturnValue({ data: { user }, status: "authenticated" });

    render(<AdminDashboard />);

    const signOutMock = jest.fn();
    signOut.mockImplementation(signOutMock);

    const button = screen.getByRole("button", { name: /sign out/i });
    fireEvent.click(button);

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});
