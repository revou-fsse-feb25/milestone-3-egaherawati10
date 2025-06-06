import { render, screen, waitFor } from "@testing-library/react";
import AdminDashboard from "../../dashboard/page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mock next-auth
jest.mock("next-auth/react");
// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("AdminDashboard", () => {
  const mockPush = jest.fn();
  const mockReplace = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush, replace: mockReplace });
  });

  it("shows loading when status is loading", () => {
    useSession.mockReturnValue({ data: null, status: "loading" });

    render(<AdminDashboard />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects unauthenticated users to login", async () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("redirects non-admin users to profile", async () => {
    useSession.mockReturnValue({
      data: { user: { name: "User", role: "user" } },
      status: "authenticated",
    });

    render(<AdminDashboard />);
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/profile");
    });
  });

  it("renders admin dashboard for admin user", () => {
    useSession.mockReturnValue({
      data: { user: { name: "Admin", role: "admin" } },
      status: "authenticated",
    });

    render(<AdminDashboard />);
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Welcome, Admin!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /manage products/i })).toBeInTheDocument();
  });
});
