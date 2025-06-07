import { authOptions } from "../lib/authOptions"; // adjust path as needed

// Mock global fetch
global.fetch = jest.fn();

describe("authOptions CredentialsProvider authorize", () => {
  const authorize = authOptions.providers[0].authorize;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns null if email or password missing", async () => {
    let result = await authorize(null);
    expect(result).toBeNull();

    result = await authorize({ email: "test@example.com" });
    expect(result).toBeNull();

    result = await authorize({ password: "123456" });
    expect(result).toBeNull();
  });

  test("returns null if login fetch fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => "Invalid credentials",
    });

    const result = await authorize({ email: "test@example.com", password: "123456" });
    expect(result).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("returns null if profile fetch fails", async () => {
    // Mock login success
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: "token123" }),
    });

    // Mock profile failure
    fetch.mockResolvedValueOnce({
      ok: false,
      text: async () => "Profile not found",
    });

    const result = await authorize({ email: "test@example.com", password: "123456" });
    expect(result).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("returns user object on successful authorization", async () => {
    const fakeToken = { access_token: "token123" };
    const fakeProfile = {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword",
      avatar: "avatar.png",
      role: "user",
    };

    // Mock login success
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeToken,
    });

    // Mock profile success
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => fakeProfile,
    });

    const result = await authorize({ email: "john@example.com", password: "password" });

    expect(result).toEqual({
      id: fakeProfile.id,
      name: fakeProfile.name,
      email: fakeProfile.email,
      password: fakeProfile.password,
      avatar: fakeProfile.avatar,
      role: fakeProfile.role,
      accessToken: fakeToken.access_token,
    });

    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("returns null on fetch exception", async () => {
    fetch.mockImplementation(() => {
      throw new Error("Network error");
    });

    const result = await authorize({ email: "john@example.com", password: "password" });
    expect(result).toBeNull();
  });
});

describe("authOptions callbacks", () => {
  const { jwt, session } = authOptions.callbacks;

  test("jwt callback merges user info into token", async () => {
    const user = {
      id: "123",
      email: "test@example.com",
      password: "pass",
      role: "admin",
      avatar: "avatar.png",
      accessToken: "token",
    };
    const token = {};

    const result = await jwt({ token, user });
    expect(result).toEqual({
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role,
      avatar: user.avatar,
      accessToken: user.accessToken,
    });
  });

  test("jwt callback returns token if no user", async () => {
    const token = { foo: "bar" };
    const result = await jwt({ token, user: null });
    expect(result).toEqual(token);
  });

  test("session callback merges token info into session.user", async () => {
    const token = {
      id: "123",
      email: "test@example.com",
      password: "pass",
      role: "admin",
      avatar: "avatar.png",
      accessToken: "token",
    };
    const session = { user: {} };

    const result = await session({ session, token });
    expect(result).toEqual({
      user: {
        id: token.id,
        email: token.email,
        password: token.password,
        role: token.role,
        avatar: token.avatar,
      },
      accessToken: token.accessToken,
    });
  });

  test("session callback returns session if no token", async () => {
    const session = { user: {} };
    const result = await session({ session, token: null });
    expect(result).toEqual(session);
  });
});
