import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

const authOptions = {
    providers: [
        CredentialsProvider({
        name: 'Credentials',
        credentials: {
            email:    { label: 'Email',    type: 'email'    },
            password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
            
            const res   = await fetch('https://api.escuelajs.co/api/v1/users')
            const users = await res.json()
            const user   = users.find(
            u => u.email === credentials.email && u.password === credentials.password
            )
            if (user) {
            return {
                id:    String(user.id),
                name:  user.name,
                email: user.email,
                role:  user.role || 'user'
            }
            }

            return null
        }
        })
    ],

    secret: process.env.NEXTAUTH_SECRET,

    session: { strategy: 'jwt' },
    pages:   { signIn: '/login' },

    callbacks: {
        async jwt({ token, user }) {
        if (user) token.role = user.role
        return token
        },
        async session({ session, token }) {
        session.user.role = token.role
        return session
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }