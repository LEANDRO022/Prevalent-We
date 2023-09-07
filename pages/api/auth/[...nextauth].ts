import NextAuth from 'next-auth';
import Auth0Provider from 'next-auth/providers/auth0';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from 'config/prisma';

const options = {
  callbacks: {
    async signIn(user: any) {
      if (Object.keys(user).includes('enabled')) {
        return user.enabled;
      }
      return true;
    },
    async session(session: { user: { id: any } }) {
      const newSession = (await prisma.session.findFirst({
        where: {
          userId: session.user.id,
        },
        include: {
          user: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })) as any;
      return newSession;
    },
  },
  providers: [
    Auth0Provider({
      wellKnown: `https://${process.env.AUTH0_DOMAIN}/`,
      issuer: process.env.AUTH0_DOMAIN,
      authorization: `https://${process.env.AUTH0_DOMAIN}/authorize?response_type=code&prompt=login`,
      clientId: `${process.env.AUTH0_CLIENT_ID}`,
      clientSecret: `${process.env.AUTH0_CLIENT_SECRET}`,
    }),
  ],
  secret: process.env.AUTH0_CLIENT_SECRET,
  adapter: PrismaAdapter(prisma),
};

export default (req: any, res: any) => NextAuth(req, res, options);
