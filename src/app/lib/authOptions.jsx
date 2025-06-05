import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: 'blabla@gmail.com' },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await fetch("https://api.escuelajs.co/api/v1/auth/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            console.error(`Login Failed: ${await response.text()}`);
            return null;
          }

          const data = await response.json();
          console.log('data:', data);

          const profileResponse = await fetch("https://api.escuelajs.co/api/v1/auth/users/{id}", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.access_token}`,
            },
          });

          if (!profileResponse.ok) {
            console.error(`Profile Fetch Failed: ${await profileResponse.text()}`);
            return null;
          }

          const profile = await profileResponse.json();
          console.log('profile:', profile);

          return {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            password: profile.password,
            avatar: profile.avatar,
            role: profile.role,
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.password = user.password;
        token.role = user.role;
        token.avatar = user.avatar;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.password = token.password;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
