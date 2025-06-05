import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "adminpass",
    role: "admin",
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    password: "userpass",
    role: "user",
  },
];

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Mock Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = mockUsers.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );
        if (user) {
          // Return user object without password
          const { password, ...userWithoutPass } = user;
          return userWithoutPass;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
