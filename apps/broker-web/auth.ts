import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginUser } from './lib/api';
import { DEFAULT_LOCALE } from './lib/i18n/config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: `/${DEFAULT_LOCALE}/login` },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        try {
          const data = await loginUser(email, password);
          if (!data?.access_token) return null;

          return {
            id: data._id,
            email: data.email,
            name: data.full_name,
            accessToken: data.access_token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
