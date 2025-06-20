import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string
        user: {
        id?: number | string;
        name?: string;
        email?: string;
        password?: string;
        image?: string;
        role?: string;
        } & DefaultSession["user"];
    };
    interface User {
        id?: number | string;
        email?: string;
        password?: string;
        role?: string;
        avatar?: string;
        accessToken?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: number | string;
        email?: string;
        password?: string;
        role?: string;
        avatar?: string;
        accessToken?: string
    }
}