import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserProfile from "../../profile/page";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

jest.mock("next-auth/react");
jest.mock("next/navigation");

describe("UserProfile", () => {
  const pushMock = jest.fn();
  const replaceMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: pushMock, replace: replaceMock });
  });

  it("renders loading state", () => {
    useSession.mockReturnValue({ data: null, status: "loading" });

    render(<UserProfile />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("redirects unauthenticated users to login", async () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });

    render(<UserProfile />);
    await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/login"));
  });

  it("redirects admin users to dashboard", async () => {
    useSession.mockReturnValue({
      data: {
        user: { name: "Admin", role: "admin" },
      },
      status: "authenticated",
    });

    render(<UserProfile />);
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith("/dashboard"));
  });

  it("renders profile for regular user", () => {
    useSession.mockReturnValue({
      data: {
        user: { name: "Jane Doe", role: "user" },
      },
      status: "authenticated",
    });

    render(<UserProfile />);
    expect(screen.getByText("User Profile")).toBeInTheDocument();
    expect(screen.getByText("Welcome, Jane Doe!")).toBeInTheDocument();
  });

  it("calls signOut on button click", () => {
    useSession.mockReturnValue({
      data: {
        user: { name: "Jane Doe", role: "user" },
      },
      status: "authenticated",
    });

    signOut.mockImplementation(() => {});
    render(<UserProfile />);
    fireEvent.click(screen.getByText("Sign Out"));
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});
