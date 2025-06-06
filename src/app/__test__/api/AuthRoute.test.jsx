import { authOptions } from "../../api/auth/[...nextauth]/route"; // Adjust the path if needed

describe("NextAuth Callbacks", () => {
  const { callbacks } = authOptions;

  describe("jwt callback", () => {
    it("adds role to token if user is present", async () => {
      const token = { name: "John", email: "john@example.com" };
      const user = { role: "admin" };

      const updatedToken = await callbacks.jwt({ token, user });

      expect(updatedToken.role).toBe("admin");
    });

    it("leaves token unchanged if no user is present", async () => {
      const token = { name: "Jane", email: "jane@example.com" };

      const updatedToken = await callbacks.jwt({ token });

      expect(updatedToken).toEqual(token);
    });
  });

  describe("session callback", () => {
    it("adds role from token to session user", async () => {
      const session = { user: { name: "Jane", email: "jane@example.com" } };
      const token = { role: "user" };

      const updatedSession = await callbacks.session({ session, token });

      expect(updatedSession.user.role).toBe("user");
    });
  });
});
