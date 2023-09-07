import { useState, useEffect } from 'react';
import { SuperAdminRoute } from '@components/PrivateRoute';
import { PrismaClient } from '@prisma/client';
import safeJsonStringify from 'safe-json-stringify';
import DropDown from '@components/DropDown';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { MiniLoading } from 'components/Loading';
import dynamic from 'next/dynamic';

const Chart: any = dynamic(
  () => {
    return import('react-apexcharts');
  },
  { ssr: false }
);

const GET_HITOS = gql`
  query hitoAcademicos($where: HitoAcademicoWhereInput) {
    hitoAcademicos(where: $where) {
      id
      fechaInicio
      fechaFin
      programa {
        name
        type {
          nombre
        }
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

const GraficoFormacion = ({ empresaSeleccionada, tiposAcademicos }) => {
  const [chartOptions, setChartOptions] = useState({
    chart: {
      type: 'bar',
      height: 450,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      title: {
        text: 'Años',
      },
      categories: [],
    },
    yaxis: {
      title: {
        text: 'Años totales de experiencia',
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
          return `${val} año${val !== 1 ? 's' : ''}`;
        },
      },
    },
  });
  const [chartSeries, setChartSeries] = useState([
    {
      data: [],
    },
  ]);
  const [totalEmpleados, setTotalEmpleados] = useState(0);
  const [contInternacional, setContInternacional] = useState(0);
  const { loading: qLoading, error, data } = useQuery(
    GET_HITOS,
    empresaSeleccionada != ''
      ? {
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
        }
      : {
          variables: {
            where: {},
          },
        }
  );

  useEffect(() => {
    if (data) {
      if (data.hitoAcademicos.length > 0) {
        const datosConsolidados = {};
        data.hitoAcademicos.forEach((hito) => {
          if (
            hito.programa.type.nombre != 'Primaria' &&
            hito.programa.type.nombre != 'Bachillerato'
          ) {
            if (!Object.keys(datosConsolidados).includes(hito.programa.type.nombre)) {
              if (hito.fechaFin) {
                var fechaInicio = new Date(hito.fechaInicio).getTime();
                var fechaFin = new Date(hito.fechaFin).getTime();
                var diff = fechaFin - fechaInicio;
                var expYears = Math.round(diff / (1000 * 60 * 60 * 24 * 365));
                datosConsolidados[hito.programa.type.nombre] = expYears;
              } else {
                datosConsolidados[hito.programa.type.nombre] = 0;
              }
            }
            if (hito.fechaFin) {
              var fechaInicio = new Date(hito.fechaInicio).getTime();
              var fechaFin = new Date(hito.fechaFin).getTime();
              var diff = fechaFin - fechaInicio;
              var expYears = Math.round(diff / (1000 * 60 * 60 * 24 * 365));
              datosConsolidados[hito.programa.type.nombre] =
                datosConsolidados[hito.programa.type.nombre] + expYears;
            }
          }
        });
        let ejeX = [];
        let datosGraf = [];
        let total = 0;
        Object.keys(
          tiposAcademicos.sort((a, b) =>
            a.prioridad > b.prioridad ? 1 : a.prioridad < b.prioridad ? -1 : 0
          )
        ).forEach((tipo) => {
          Object.keys(datosConsolidados).forEach((el) => {
            if (tiposAcademicos[tipo].nombre === el.toString()) {
              ejeX.push(el);
              datosGraf.push(parseInt(datosConsolidados[el]));
              total = total + datosConsolidados[el];
            }
          });
        });
        setChartSeries([{ data: datosGraf }]);
        setChartOptions({
          ...chartOptions,
          xaxis: {
            title: {
              text: 'años',
            },
            categories: ejeX,
          },
        });
        setTotalEmpleados(total);
      }
    } else {
      setTotalEmpleados(0);
      setChartSeries([{ data: [] }]);
      setChartOptions({
        ...chartOptions,
        xaxis: {
          title: {
            text: 'años',
          },
          categories: [],
        },
      });
    }
  }, [data]);

  if (qLoading) return <MiniLoading />;
  return (
    chartSeries && (
      <div>
        <h1 className='m-4 text-xl text-gray-700 font-bold'>Años de Formación</h1>
        <h1 className='text-base font-medium text-black'>
          Total Años de Formación Académica (*):
          <span className='font-bold'> {totalEmpleados} años</span>
        </h1>
        <Chart options={chartOptions} series={chartSeries} type='bar' height={450} />
        <h5>(*) No incluye Formación Básica Primaria y Secundaria</h5>
      </div>
    )
  );
};

export default GraficoFormacion;
