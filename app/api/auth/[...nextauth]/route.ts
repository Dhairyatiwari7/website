import NextAuth from "next-auth";
import { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "../../../lib/db";
import User from "../../../models/users";
import bcrypt from "bcryptjs";
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}


export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          await connectToDB();
          if (!credentials) {
            return null;
          }
          const user = await User.findOne({ username: credentials.username });
          if (!user) {
            return null;
          }
          const isMatch = await bcrypt.compare(credentials.password, user.password);
          if (!isMatch) {
            return null;
          }
          return { id: user._id, name: user.username };
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        if (session.user) {
          session.user.id = token.id as string;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
