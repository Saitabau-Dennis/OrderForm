import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "@/auth.config";

// Extend default session shape so callers can rely on `session.user.id`.
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

class UnverifiedEmailError extends CredentialsSignin {
  code = "unverified_email" as const;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, // 1 hour
  },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const [{ default: db }, bcrypt] = await Promise.all([
          import("@/lib/db"),
          import("bcryptjs"),
        ]);

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.user.findUnique({
          where: { email }
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Enforce email verification after validating credentials.
        // This prevents triggering verification emails on bad password attempts.
        if (!user.emailVerified) {
          throw new UnverifiedEmailError();
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Copy custom fields from JWT to session for server/client consumers.
      if (token && session.user) {
        const tokenId =
          typeof token.id === "string" ? token.id : token.sub;
        session.user.id = tokenId ?? "";
        session.user.name = token.name;
        session.user.email = typeof token.email === "string" ? token.email : "";
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Persist user id on first sign-in, then keep it stable across refreshes.
      if (user) {
        token.id = user.id;
      }
      if (!token.id && token.sub) {
        token.id = token.sub;
      }
      return token;
    },
  },
});
