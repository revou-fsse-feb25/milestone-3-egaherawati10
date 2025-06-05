import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const res = await fetch("https://api.escuelajs.co/api/v1/users");
          if (!res.ok) throw new Error("Failed to fetch users");
          const users = await res.json();

          // Find user by email
          const user = users.find(
            (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
          );

          if (!user) {
            return null;
          }

          // NOTE: Platzi API does not provide passwords, so here you should implement your own password check.
          // For demo, accept any password that matches "password123"
          if (credentials.password !== "password123") {
            return null;
          }

          // Assign role based on email or other logic
          const role = user.email === "admin@platzi.com" ? "admin" : "user";

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role,
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };


// import React from "react";
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// const handler = NextAuth({
//     providers: [CredentialsProvider({
//         name: "Credentials",
//         credentials: {
//             email: { label: "Email", type: "email" },
//             password: { label: "Password", type: "password" },
//         },
//         async authorize(credentials) {
//             const res = await fetch("https://api.escuelajs.co/api/v1/users/", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     email: credentials.email,
//                     password: credentials.password,
//                 }),
//             });

//                 if (!res.ok) return null;
//                 const user = await res.json();

//                 if (user && user.access_token) {
//                     return { ...user, email: credentials.email };
//                 }
//                 return null;
//             },
//        }),
//     ],
//     session: {
//         strategy: "jwt",        
//     },
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.accessToken = user.access_token;
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             session.accessToken = token.accessToken;
//             return session;
//         },
//     },
//     pages: {
//         signIn: "/login",
//     },
// });

// export { handler as GET, handler as POST };