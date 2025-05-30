import NextAuth from "next-auth";

const handler = NextAuth({
    providers: [CredentialsProvider({
        name: "Credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            const res = await fetch("https://api.escuelajs.co/api/v1/auth/login"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password,
                }),
            });

                if (!res.ok) return null;
                const user = await res.json();

                if (user && user.access_token) {
                    return { ...user, email: credentials.email };
                }
                return null;
            };
            }
        },
    }),
    session: "",
    callbacks: {
        session: ({ session }) => {
            return session;
        },
    },
    pages: "",
})