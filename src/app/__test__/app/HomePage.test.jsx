import React from "react";
import Home from "../../page";
import HomeClient from "../../HomeClient";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

// ⬅️ Mock NextAuth and Next.js
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// ⬅️ Mock the client component separately
jest.mock("../../HomeClient", () => jest.fn(() => <div>Mocked HomeClient</div>));

describe("Home page (protected)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to /login if not authenticated", async () => {
    getServerSession.mockResolvedValue(null);

    // Await the server component rendering
    await Home();

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  it("renders HomeClient when authenticated", async () => {
    const fakeSession = { user: { name: "John Doe", role: "user" } };
    getServerSession.mockResolvedValue(fakeSession);

    const result = await Home();

    expect(HomeClient).toHaveBeenCalledWith({ session: fakeSession }, {});
    expect(result).toEqual(<HomeClient session={fakeSession} />);
  });
});