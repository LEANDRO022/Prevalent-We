import { useState, useEffect } from 'react';
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
  query hitoProfesionals($where: HitoProfesionalWhereInput) {
    hitoProfesionals(where: $where) {
      id
      fechaInicio
      fechaFin
      paisId
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

const GraficoLaboral = ({ empresaSeleccionada, tiposProfesion }) => {
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
        text: 'Años Totales de Experiencia en la Empresa',
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
      name: '',
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
      if (data.hitoProfesionals.length > 0) {
        const datosConsolidados = {};
        var contInternacionales = 0;
        data.hitoProfesionals.forEach((hito) => {
          if (!Object.keys(datosConsolidados).includes(hito.tipo.nombre)) {
            datosConsolidados[hito.tipo.nombre] = 0;
          }
          if (hito.fechaFin) {
            var fechaInicio = new Date(hito.fechaInicio).getTime();
            var fechaFin = new Date(hito.fechaFin).getTime();
            var diff = fechaFin - fechaInicio;
            var expYears = Math.round(diff / (1000 * 60 * 60 * 24 * 365));
            datosConsolidados[hito.tipo.nombre] = datosConsolidados[hito.tipo.nombre] + expYears;
          } else {
            var fechaInicio = new Date(hito.fechaInicio).getTime();
            var fechaFin = new Date().getTime();
            var diff = fechaFin - fechaInicio;
            var expYears = Math.round(diff / (1000 * 60 * 60 * 24 * 365));
            datosConsolidados[hito.tipo.nombre] = datosConsolidados[hito.tipo.nombre] + expYears;
          }
          if (hito.paisId != 46) {
            contInternacionales = contInternacionales + 1;
          }
        });
        let ejeX = [];
        let datosGraf = [];
        let total = 0;

        Object.values(
          tiposProfesion.sort((a, b) =>
            a.prioridad > b.prioridad ? 1 : a.prioridad < b.prioridad ? -1 : 0
          )
        ).forEach((el: any) => {
          ejeX.push(el.nombre);
          datosGraf.push(parseInt(datosConsolidados[el.nombre]));
          total = total + (datosConsolidados[el.nombre] ? datosConsolidados[el.nombre] : 0);
        });
        setChartSeries([{ name: 'Experiencia Laboral Total', data: datosGraf }]);
        setChartOptions({
          ...chartOptions,
          xaxis: {
            title: {
              text: 'Años',
            },
            categories: ejeX,
          },
        });
        setTotalEmpleados(total);
        setContInternacional(
          Math.floor((contInternacionales / data.hitoProfesionals.length) * 100)
        );
      }
    } else {
      setChartSeries([]);
      setChartOptions({
        ...chartOptions,
        xaxis: {
          title: {
            text: 'Años',
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
        <h1 className='m-4 text-xl text-gray-700 font-bold'>Experiencia Profesional Total</h1>
        <h1 className='text-base text-gray-700 '>
          Total Años de Experiencia de los empleados:{' '}
          <span className='font-bold'>{totalEmpleados}</span>
        </h1>
        <h1 className='text-base text-gray-700 '>
          % Experiencia Internacional: <span>{contInternacional}%</span>
        </h1>
        <h1 className='text-base text-gray-700 '>
          % Experiencia Nacional: <span>{100 - contInternacional}%</span>
        </h1>
        <Chart options={chartOptions} series={chartSeries} type='bar' height={450} />
      </div>
    )
  );
};

export default GraficoLaboral;
