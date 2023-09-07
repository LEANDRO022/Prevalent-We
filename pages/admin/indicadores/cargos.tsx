import { useState, useEffect } from 'react';
import { SuperAdminRoute } from '@components/PrivateRoute';
import { PrismaClient } from '@prisma/client';
import safeJsonStringify from 'safe-json-stringify';
import DropDown from '@components/DropDown';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import Loading from 'components/Loading';
import dynamic from 'next/dynamic';
import { CVInputPageContainer, AdminInputPageHeaderSubRoute } from '@components/InputPage';

const Chart: any = dynamic(
  () => {
    return import('react-apexcharts');
  },
  { ssr: false }
);

const GET_HITOS = gql`
  query hitoProfesionals($where: HitoProfesionalWhereInput) {
    hitoProfesionals(where: $where) {
      id
      tipo {
        nombre
      }
      cv {
        user {
          name
          Perfil {
            gender
          }
        }
      }
    }
  }
`;

const prisma = new PrismaClient();

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
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(empresas[0].id);

  return (
    <SuperAdminRoute>
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
        <AdminInputPageHeaderSubRoute sectionName='Indicadores' sectionRoute='indicadores' subSectionName='Cargos' />
        <div className='flex flex-col justify-center items-center w-full'>
          <h1 className='m-4 text-xl text-gray-700 font-bold'>Cantidad de personas por tipo de cargo</h1>
          <div className='flex'>
            <DropDown
              instruccion='Seleccione la empresa'
              datos={empresas}
              datoSeleccionado={empresaSeleccionada}
              setDatoSeleccionado={setEmpresaSeleccionada}
              textColumn='name'
            />
          </div>
          <div className='w-full'>
            <GraficoProfesiones empresaSeleccionada={empresaSeleccionada} />
          </div>
        </div>
      </CVInputPageContainer>
    </SuperAdminRoute>
  );
};

const GraficoProfesiones = ({ empresaSeleccionada }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'bar',
      height: 450,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      title: {
        text: 'Cantidad de Personas',
      },
      tickAmount: 1,
    },
    // stroke: {
    //   show: true,
    //   width: 2,
    //   colors: ['transparent'],
    // },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} Persona${val !== 1 ? 's' : ''}`;
        },
      },
    },
  });
  const [chartSeries, setChartSeries] = useState([
    {
      name: '',
      data: [],
    },
  ]);

  const { loading: qLoading, error, data } = useQuery(GET_HITOS, {
    variables: {
      where: {
        AND: {
          cv: {
            is: {
              user: {
                is: {
                  empresa: {
                    is: {
                      id: {
                        equals: empresaSeleccionada,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  useEffect(() => {
    if (data) {
      if (data.hitoProfesionals.length > 0) {
        const datosConsolidados = {};
        data.hitoProfesionals.forEach((hito) => {
          if (!Object.keys(datosConsolidados).includes(hito.tipo.nombre)) {
            datosConsolidados[hito.tipo.nombre] = {
              Femenino: 0,
              Masculino: 0,
            };
          }
          if (hito.cv.user.Perfil?.gender) {
            datosConsolidados[hito.tipo.nombre][hito.cv.user.Perfil.gender] =
              datosConsolidados[hito.tipo.nombre][hito.cv.user.Perfil?.gender] + 1;
          }
        });

        let ejeX = [];
        let masculinos = [];
        let femeninas = [];
        Object.keys(datosConsolidados).forEach((el) => {
          ejeX.push(el);
          masculinos.push(datosConsolidados[el].Masculino);
          femeninas.push(datosConsolidados[el].Femenino);
        });
        setChartSeries([
          { name: 'Mujeres', data: femeninas },
          { name: 'Hombres', data: masculinos },
        ]);
        setChartOptions({ ...chartOptions, xaxis: { categories: ejeX } });
      }
    }
  }, [data]);

  if (qLoading) return <Loading />;
  return <Chart options={chartOptions} series={chartSeries} type='bar' height={450} />;
};

export default Indicadores;
