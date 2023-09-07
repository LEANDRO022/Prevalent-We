import { SuperAdminRoute } from 'components/PrivateRoute';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { AdminInputPageHeader } from 'components/InputPage';
import safeJsonStringify from 'safe-json-stringify';
import prisma from 'config/prisma';
import { getSession } from 'next-auth/client';

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session) {
    let empresas = await prisma.empresa.findMany({
      where: {
        approved: true,
      },
      include: {
        datos: true,
      },
    });
    empresas = JSON.parse(safeJsonStringify(empresas));
    prisma.$disconnect();
    return {
      props: {
        empresas,
      },
    };
  } else {
    return {
      props: {
        empresas: {},
      },
    };
  }
}

const Empresas = ({ empresas }) => {
  return (
    <SuperAdminRoute>
      <Head>
        <title>Empresas</title>
        <link rel='icon' href='/img/Favicon.png' />
      </Head>
      <section className=''>
        <div className='p-8 flex flex-col items-center justify-center'>
          <AdminInputPageHeader sectionName='Ingresar usuarios a empresas' />
          <div className='flex'>
            {empresas &&
              empresas.map((empresa) => {
                return <Empresa key={`Empresa${empresa.id}`} id={empresa.id} nombre={empresa.name} logo={empresa.datos?.logo} />;
              })}
          </div>
        </div>
      </section>
    </SuperAdminRoute>
  );
};

const Empresa = ({ id, nombre, logo }) => {
  return (
    <Link href={`/admin/empresas/${id}`}>
      <div className='flex flex-col items-center justify-center m-2 shadow-lg rounded-lg p-4 cursor-pointer bg-gray-200'>
        <div className='relative h-52 w-52'>
          <Image
            className='rounded-lg'
            src={logo !== '' ? logo : '/img/default.jpg'}
            layout='fill'
            alt='EnterpriseLogo'
            objectFit='fill'
            quality={100}
          />
        </div>
        <div className='mt-4'>
          <h2 className='text-gray-900 title-font text-lg font-medium'>{nombre}</h2>
        </div>
      </div>
    </Link>
  );
};

export default Empresas;
