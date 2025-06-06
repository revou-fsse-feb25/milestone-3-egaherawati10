import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import LogoutPage from "../../logout/page";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LogoutPage", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ push: pushMock });

    // Clear document.cookie before each test
    Object.defineProperty(document, "cookie", {
      writable: true,
      value: "",
    });
  });

  test("renders logout messages", () => {
    render(<LogoutPage />);
    expect(screen.getByText(/logging you out/i)).toBeInTheDocument();
    expect(screen.getByText(/you'll be redirected shortly/i)).toBeInTheDocument();
  });

  test("clears auth_token cookie on mount", () => {
    render(<LogoutPage />);
    expect(document.cookie).toContain("auth_token=; Max-Age=0; path=/");
  });

  test("redirects to /login after 1 second", async () => {
    jest.useFakeTimers();

    render(<LogoutPage />);

    // Fast-forward time by 1 second
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/login");
    });

    jest.useRealTimers();
  });
});
