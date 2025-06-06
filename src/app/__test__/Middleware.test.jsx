import { middleware } from "./middleware"; // adjust import path if needed
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

jest.mock("next-auth/jwt");
jest.mock("next/server", () => ({
  NextResponse: {
    redirect: jest.fn(),
    next: jest.fn(() => "next-response"),
  },
}));

describe("middleware", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv, NEXTAUTH_SECRET: "secret" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  function createReq(pathname, url = `http://localhost${pathname}`) {
    return {
      nextUrl: { pathname },
      url,
    };
  }

  test("allows access to public paths if no token", async () => {
    getToken.mockResolvedValue(null);

    const req = createReq("/");
    const result = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe("next-response");
  });

  test("redirects authenticated user from /login to dashboard or profile", async () => {
    getToken.mockResolvedValue({ role: "admin" });

    const req = createReq("/login");
    const redirectUrl = new URL("/dashboard", req.url);

    NextResponse.redirect.mockReturnValue("redirect-response");

    const result = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalledWith(redirectUrl);
    expect(result).toBe("redirect-response");

    // Test for user role
    getToken.mockResolvedValue({ role: "user" });
    const reqUser = createReq("/login");
    const redirectUrlUser = new URL("/profile", reqUser.url);

    const resultUser = await middleware(reqUser);

    expect(NextResponse.redirect).toHaveBeenCalledWith(redirectUrlUser);
    expect(resultUser).toBe("redirect-response");
  });

  test("redirects unauthenticated user from /dashboard to /login", async () => {
    getToken.mockResolvedValue(null);

    const req = createReq("/dashboard");
    const redirectUrl = new URL("/login", req.url);

    NextResponse.redirect.mockReturnValue("redirect-response");

    const result = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalledWith(redirectUrl);
    expect(result).toBe("redirect-response");
  });

  test("redirects non-admin user from /dashboard to /profile", async () => {
    getToken.mockResolvedValue({ role: "user" });

    const req = createReq("/dashboard");
    const redirectUrl = new URL("/profile", req.url);

    NextResponse.redirect.mockReturnValue("redirect-response");

    const result = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalledWith(redirectUrl);
    expect(result).toBe("redirect-response");
  });

  test("allows admin user to access /dashboard", async () => {
    getToken.mockResolvedValue({ role: "admin" });

    const req = createReq("/dashboard");

    const result = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe("next-response");
  });

  test("redirects unauthenticated user from /profile to /login", async () => {
    getToken.mockResolvedValue(null);

    const req = createReq("/profile");
    const redirectUrl = new URL("/login", req.url);

    NextResponse.redirect.mockReturnValue("redirect-response");

    const result = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalledWith(redirectUrl);
    expect(result).toBe("redirect-response");
  });

  test("redirects non-user role from /profile to /dashboard", async () => {
    getToken.mockResolvedValue({ role: "admin" });

    const req = createReq("/profile");
    const redirectUrl = new URL("/dashboard", req.url);

    NextResponse.redirect.mockReturnValue("redirect-response");

    const result = await middleware(req);

    expect(NextResponse.redirect).toHaveBeenCalledWith(redirectUrl);
    expect(result).toBe("redirect-response");
  });

  test("allows user role to access /profile", async () => {
    getToken.mockResolvedValue({ role: "user" });

    const req = createReq("/profile");

    const result = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe("next-response");
  });

  test("allows access to other paths", async () => {
    getToken.mockResolvedValue(null);

    const req = createReq("/some-other-path");

    const result = await middleware(req);

    expect(NextResponse.next).toHaveBeenCalled();
    expect(result).toBe("next-response");
  });
});
