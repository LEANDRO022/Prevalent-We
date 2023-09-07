import { useState, useEffect } from 'react';
import { SuperAdminRoute } from '@components/PrivateRoute';
import prisma from 'config/prisma';
import safeJsonStringify from 'safe-json-stringify';
import DropDown from '@components/DropDown';
import Head from 'next/head';
import GraficoProfesiones from '@components/Indicadores/profesion';
import { CVInputPageContainer, AdminInputPageHeaderSubRoute } from '@components/InputPage';
import GraficoEdades from '@components/Indicadores/edad';
import GraficoFormacion from '@components/Indicadores/expformacion';
import GraficoLaboral from '@components/Indicadores/explaboral';
import { useRouter } from 'next/router';

export async function getServerSideProps() {
  const empresas = await prisma.empresa.findMany({
    where: {
      approved: true,
    },
  });
  const tiposAcademicos = await prisma.tipoAcademico.findMany();
  const tiposProfesion = await prisma.tipoProfesional.findMany();
  prisma.$disconnect();
  return {
    props: {
      empresas: JSON.parse(safeJsonStringify(empresas)),
      tiposAcademicos,
      tiposProfesion,
    },
  };
}

const dashboard = ({ empresas, tiposAcademicos, tiposProfesion }) => {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const router = useRouter();
  const [tipoSeleccionado, setTipoSeleccionado] = useState(5);

  useEffect(() => {
    router.prefetch('/admin/indicadores/edad');
    router.prefetch('/admin/indicadores/profesiones');
    router.prefetch('/admin/indicadores/explaboral');
    router.prefetch('/admin/indicadores/expformacion');
  }, []);

  const routeOnDoubleClick = (e, route) => {
    switch (e.detail) {
      case 2:
        router.push(`${route}/?empresa=${empresaSeleccionada}`);
        break;
    }
  };
  return (
    <div>
      <SuperAdminRoute>
        <Head>
          <title>Indicadores</title>
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
        <section>
          <AdminInputPageHeaderSubRoute
            sectionName='Indicadores'
            sectionRoute='indicadores'
            subSectionName='Dashboard'
          />
          <div className='flex flex-col justify-center items-center w-screen'>
            <h1 className='m-4 text-xl text-gray-700 font-bold'>Dashboard General</h1>
            <div className='flex'>
              <DropDown
                instruccion='Información Global'
                datos={empresas}
                datoSeleccionado={empresaSeleccionada}
                setDatoSeleccionado={setEmpresaSeleccionada}
                textColumn='name'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 w-full'>
              <div
                onClick={(e) => routeOnDoubleClick(e, '/admin/indicadores/edad')}
                className=' bg-white rounded-2xl shadow-2xl p-4 m-4 overflow-y-auto pb-2'
              >
                <GraficoEdades empresaSeleccionada={empresaSeleccionada} />
              </div>

              <div
                onClick={(e) => routeOnDoubleClick(e, '/admin/indicadores/profesiones')}
                className=' bg-white rounded-2xl shadow-2xl p-4 m-4 overflow-y-auto pb-2'
              >
                <GraficoProfesiones
                  empresaSeleccionada={empresaSeleccionada}
                  tiposAcademicos={tiposAcademicos}
                />
              </div>

              <div
                onClick={(e) => routeOnDoubleClick(e, '/admin/indicadores/explaboral')}
                className=' bg-white rounded-2xl shadow-2xl p-4 m-4 overflow-y-auto pb-2'
              >
                <GraficoLaboral
                  empresaSeleccionada={empresaSeleccionada}
                  tiposProfesion={tiposProfesion}
                />
              </div>
              <div
                onClick={(e) => routeOnDoubleClick(e, '/admin/indicadores/expformacion')}
                className=' bg-white rounded-2xl shadow-2xl p-4 m-4 overflow-y-auto pb-2'
              >
                <GraficoFormacion
                  empresaSeleccionada={empresaSeleccionada}
                  tiposAcademicos={tiposAcademicos}
                />
              </div>
            </div>
          </div>
        </section>
      </SuperAdminRoute>
    </div>
  );
};

export default dashboard;
