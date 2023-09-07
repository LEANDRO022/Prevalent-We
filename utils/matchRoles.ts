import prisma from 'config/prisma';
import { getSession } from 'next-auth/react';

const matchRoles = async (ctx: {
  resolvedUrl: any;
  query: { id: any };
  req: any;
}) => {
  let url = ctx.resolvedUrl;
  if (url.includes('?')) {
    [url] = url.split('?');
  }
  const { id } = ctx.query;

  if (id) {
    url = url.replace(id, '[id]');
  }
  const session: any = await getSession({ req: ctx.req });
  const roles = await prisma.page.findFirst({
    where: {
      AND: {
        route: {
          equals: url,
        },
        roles: {
          some: {
            users: {
              some: {
                id: session?.user?.id,
              },
            },
          },
        },
      },
    },
  });
  return !roles;
};

export default matchRoles;
