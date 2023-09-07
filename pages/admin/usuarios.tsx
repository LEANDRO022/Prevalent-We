/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import useTable from '@components/ReactTable/useTable';
import prisma from 'config/prisma';
import Head from 'next/head';
import safeJsonStringify from 'safe-json-stringify';
import { Table, TableBody, TableRow, TableCell, makeStyles } from '@material-ui/core';
import { data } from 'autoprefixer';
import { CVInputPageContainer, AdminInputPageHeader } from 'components/InputPage';
import { SuperAdminRoute } from 'components/PrivateRoute';
import EnhancedTable from '@components/ReactTable/useTable';
import { getSession } from 'next-auth/client';

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session) {
    let users = await prisma.user.findMany({
      include: {
        empresa: true,
        roles: true,
        Perfil: true,
      },
    });
    let rol = await prisma.roles.findMany();
    rol = JSON.parse(safeJsonStringify(rol));
    users = JSON.parse(safeJsonStringify(users));
    prisma.$disconnect();
    return {
      props: {
        users,
        rol,
      },
    };
  } else {
    return {
      props: {
        users: {},
        rol: {},
      },
    };
  }
}

export default function Usuarios({ users, rol }) {
  return (
    <SuperAdminRoute>
      <Head>
        <title>Usuarios</title>
        <link rel='icon' href='/img/Favicon.png' />
      </Head>
      <CVInputPageContainer>
        <AdminInputPageHeader sectionName='Usuarios' />
        <div className='mx-2 my-10 w-full'>
          <EnhancedTable users={users} roles={rol} />
        </div>
      </CVInputPageContainer>
    </SuperAdminRoute>
  );
}
