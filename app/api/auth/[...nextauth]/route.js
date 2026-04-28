import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        rollNumber: { label: "Roll Number", type: "text", placeholder: "e.g. 123456" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Find user in our mock DB
        const { getUser } = require('@/lib/users');
        const user = getUser(credentials.rollNumber);
        
        if (user) {
          // Check stored password for registered users, or default "password" for seed users
          const validPassword = user.password 
            ? credentials.password === user.password 
            : credentials.password === "password";
          
          if (validPassword) {
            return { 
                id: user.id, 
                name: user.name, 
                rollNumber: user.rollNumber, 
                role: user.role,
                permissions: user.permissions
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.rollNumber = user.rollNumber;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.id || token.sub;
        session.user.role = token.role;
        session.user.permissions = token.permissions;
        session.user.rollNumber = token.rollNumber;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: "9aa8a2c417a5b2f7b9e8f1e5df574323a47801e348a",
})


export const { GET, POST } = handlers
