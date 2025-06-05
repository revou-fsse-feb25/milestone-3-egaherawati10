// import NextAuth, { DefaultSession } from "next-auth";
// import { JWT } from "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string
        user: {
        id?: number | string;
        email?: string;
        password?: string;
        avatar?: string;
        role?: string; // tambahkan role di sini
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