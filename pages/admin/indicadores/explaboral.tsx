import { useState, useEffect } from 'react';
import { SuperAdminRoute } from '@components/PrivateRoute';
import prisma from 'config/prisma';
import safeJsonStringify from 'safe-json-stringify';
import DropDown from '@components/DropDown';
import { gql } from 'apollo-boost';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { CVInputPageContainer, AdminInputPageHeaderSubRoute } from '@components/InputPage';
import GraficoLaboral from '@components/Indicadores/explaboral';

export async function getStaticProps() {
  const empresas = await prisma.empresa.findMany({
    where: {
      approved: true,
    },
  });
  const tiposProfesion = await prisma.tipoProfesional.findMany();
  prisma.$disconnect();
  return {
    props: {
      empresas: JSON.parse(safeJsonStringify(empresas)),
      tiposProfesion,
    },
    revalidate: 1, // In seconds
  };
}

const Indicadores = ({ empresas, tiposProfesion }) => {
  const router = useRouter();
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');

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
        <AdminInputPageHeaderSubRoute
          sectionName='Indicadores'
          sectionRoute='indicadores'
          subSectionName='Exp Laboral'
        />
        <div className='flex flex-col justify-center items-center w-full'>
          <h1 className='m-4 text-xl text-gray-700 font-bold'>Experiencia Profesional Total</h1>
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
            <GraficoLaboral
              empresaSeleccionada={empresaSeleccionada}
              tiposProfesion={tiposProfesion}
            />
          </div>
        </div>
      </CVInputPageContainer>
    </SuperAdminRoute>
  );
};

export default Indicadores;
