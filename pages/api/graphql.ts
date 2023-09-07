import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-micro';
import { buildSchema } from 'type-graphql';
import { resolvers } from 'prisma/generated/type-graphql';
import { PrismaClient } from '@prisma/client';
import prisma from 'config/prisma';

interface Context {
  prisma: PrismaClient;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const schema = await buildSchema({
    resolvers,
    validate: false,
  });

  const apolloServer = new ApolloServer({
    context: (): Context => ({ prisma }),
    schema,
    tracing: process.env.NODE_ENV === 'development',
    playground: true,
  });
  return apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
};
