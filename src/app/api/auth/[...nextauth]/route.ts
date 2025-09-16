import NextAuth from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/drizzle/db';

export const authOptions = {
  adapter: DrizzleAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'Demo Login',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'demo@example.com' },
      },
      async authorize(credentials) {
        if (credentials?.email) {
          return { id: 'demo', email: credentials.email, name: 'Demo User' };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' as const },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };