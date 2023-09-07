import { useState, useEffect } from 'react';
import { SuperAdminRoute } from '@components/PrivateRoute';
import prisma from 'config/prisma';
import safeJsonStringify from 'safe-json-stringify';
import Head from 'next/head';
import DropDown from '@components/DropDown';
import { CVInputPageContainer, AdminInputPageHeaderSubRoute } from '@components/InputPage';
import GraficoEdades from '@components/Indicadores/edad';
import { useRouter } from 'next/router';

export async function getStaticProps() {
  const empresas = await prisma.empresa.findMany({
    where: {
      approved: true,
    },
  });
  prisma.$disconnect();
  return {
    props: {
      empresas: JSON.parse(safeJsonStringify(empresas)),
    },
    revalidate: 1, // In seconds
  };
}

const Indicadores = ({ empresas }) => {
  const router = useRouter();
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');

  useEffect(() => {
    setEmpresaSeleccionada((router.query.empresa as string) ?? '');
  }, [router]);

  return (
    <SuperAdminRoute>
      <Head>
        <title>Edad</title>
        <link rel='icon' href='/img/Favicon.png' />
      </Head>
      <CVInputPageContainer>
        <AdminInputPageHeaderSubRoute sectionName='Indicadores' sectionRoute='indicadores' subSectionName='edades' />
        <div className='flex flex-col justify-center items-center w-full'>
          <div className='flex'>
            <DropDown
              instruccion='Información Global'
              datos={empresas}
              datoSeleccionado={empresaSeleccionada}
              setDatoSeleccionado={setEmpresaSeleccionada}
              textColumn='name'
            />
          </div>
          <div className='w-full'>
            <GraficoEdades empresaSeleccionada={empresaSeleccionada} />
          </div>
        </div>
      </CVInputPageContainer>
    </SuperAdminRoute>
  );
};

export default Indicadores;
