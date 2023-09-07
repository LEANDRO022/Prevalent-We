import { useState, useEffect } from 'react';
import { SuperAdminRoute } from '@components/PrivateRoute';
import prisma from 'config/prisma';
import safeJsonStringify from 'safe-json-stringify';
import DropDown from '@components/DropDown';
import dynamic from 'next/dynamic';
import GraficoProfesiones from '@components/Indicadores/profesion';
import Head from 'next/head';
import { CVInputPageContainer, AdminInputPageHeaderSubRoute } from '@components/InputPage';
import { useRouter } from 'next/router';

export async function getStaticProps() {
  const empresas = await prisma.empresa.findMany({
    where: {
      approved: true,
    },
  });
  const tiposAcademicos = await prisma.tipoAcademico.findMany();
  prisma.$disconnect();
  return {
    props: {
      empresas: JSON.parse(safeJsonStringify(empresas)),
      tiposAcademicos,
    },
    revalidate: 1, // In seconds
  };
}

const Indicadores = ({ empresas, tiposAcademicos }) => {
  const router = useRouter();
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [tipoSeleccionado, setTipoSeleccionado] = useState();

  useEffect(() => {
    setEmpresaSeleccionada((router.query.empresa as string) ?? '');
  }, [router]);

  return (
    <SuperAdminRoute>
      <Head>
        <title>Profesiones</title>
        <link rel='icon' href='/img/Favicon.png' />
      </Head>
      {/* <PowerBIEmbed
        cssClassName='mt-2'
        embedConfig={{
          type: 'report',
          embedUrl:
            'https://app.powerbi.com/view?r=eyJrIjoiYWUxZjVjYmEtZDU5Zi00ZmYzLWE2ZGItNDY3MWFhODZjMTlhIiwidCI6IjMwZWE2ZjFkLWExODEtNGQzZS1iMWViLTdhMTkwNTM2YzNmMyJ9&pageName=ReportSection',
          accessToken: '',
        }}
      /> */}
      <CVInputPageContainer>
        <AdminInputPageHeaderSubRoute sectionName='Indicadores' sectionRoute='indicadores' subSectionName='Profesiones' />
        <div className='flex flex-col justify-center items-center w-full'>
          <h1 className='m-4 text-xl text-gray-700 font-bold'>Composición Profesiones</h1>
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
            <GraficoProfesiones empresaSeleccionada={empresaSeleccionada} tiposAcademicos={tiposAcademicos} />
          </div>
        </div>
      </CVInputPageContainer>
    </SuperAdminRoute>
  );
};

export default Indicadores;
