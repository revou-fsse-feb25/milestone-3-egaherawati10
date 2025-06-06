import React from "react";
import { render, screen } from "@testing-library/react";
import SessionProviderWrapper from "../../component/SessionProviderWrapper";

jest.mock("next-auth/react", () => {
  const actual = jest.requireActual("next-auth/react");
  return {
    ...actual,
    SessionProvider: ({ children }) => <>{children}</>, // mock provider
  };
});

describe("SessionProviderWrapper", () => {
  test("renders children inside SessionProvider", () => {
    render(
      <SessionProviderWrapper>
        <p>Test Child</p>
      </SessionProviderWrapper>
    );

    expect(screen.getByText("Test Child")).toBeInTheDocument();
  });
});
