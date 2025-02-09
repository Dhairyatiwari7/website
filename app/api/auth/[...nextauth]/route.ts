import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "../../../lib/db";
import User from "../../../models/users";
import bcrypt from "bcryptjs";
export const authOptions = {
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email", placeholder: "user@example.com" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Please provide both email and password");
          }
  
          const client = await clientPromise;
          const user = await User.findOne({ email: credentials.email });
          
          if (!user) {
            throw new Error("No user found with this email");
          }
  
          const isValidPassword = await bcrypt.compare(credentials.password, user.password);
          if (!isValidPassword) {
            throw new Error("Invalid password");
          }
  
          return { id: user._id, name: user.name, email: user.email };
        },
      }),
    ],
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        if (token) {
          session.user.id = token.id;
          session.user.email = token.email;
        }
        return session;
      },
      async jwt({ token, user }: { token: any; user?: any }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
        }
        return token;
      },
    },
    pages: {
      signIn: "/login",
    },
    session: {
      strategy: 'jwt' as 'jwt',
    },
    secret: 'buXmQGB0ra2iR0UXQnJeqQrR04Arxs25nZ3vnd57VDM=',
  };
  
  const handler = NextAuth(authOptions);
  export { handler as GET, handler as POST };