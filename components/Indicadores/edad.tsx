import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { MiniLoading } from 'components/Loading';
import dynamic from 'next/dynamic';
import { CSVLink } from 'react-csv';
import { Tooltip } from '@material-ui/core';

const Chart: any = dynamic(
  () => {
    return import('react-apexcharts');
  },
  { ssr: false }
);

const GET_USERS = gql`
  query users($where: UserWhereInput) {
    users(where: $where) {
      name
      email
      isActive
      Perfil {
        fechaNacimiento
        document
        gender
      }
    }
  }
`;

const getRangoEdad = (edad) => {
  const rangos = [
    { min: 0, max: 20 },
    { min: 20, max: 25 },
    { min: 25, max: 30 },
    { min: 30, max: 35 },
    { min: 35, max: 40 },
    { min: 40, max: 45 },
    { min: 45, max: 50 },
    { min: 50, max: 55 },
    { min: 55, max: 60 },
    { min: 60, max: 160 },
  ];
  let rango = rangos.filter((el) => el.min <= edad && el.max > edad);
  if (rango.length === 0) {
    return 'N/D';
  } else {
    return `${rango[0].min === 0 ? 18 : rango[0].min}${rango[0].max === 160 ? ' en adelante' : '-' + rango[0].max}`;
  }
};

function calculate_age(dob) {
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

const GraficoEdades = ({ empresaSeleccionada }) => {
  const [sumEdad, setSumEdad] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDrillDown, setShowDrillDown] = useState(false);

  const [ejeX, setEjeX] = useState({});
  const [chartSeriePie, setChartSeriePie] = useState([]);
  const [chartSeries, setChartSeries] = useState([
    {
      name: '',
      data: [],
    },
  ]);

  const { loading: qLoading, error, data } = useQuery(
    GET_USERS,
    empresaSeleccionada != ''
      ? {
          variables: {
            where: {
              empresaId: {
                equals: empresaSeleccionada,
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
      if (data.users.length > 0) {
        const datosConsolidados = {
          '18-20': 0,
          '20-25': 0,
          '25-30': 0,
          '30-35': 0,
          '35-40': 0,
          '40-45': 0,
          '45-50': 0,
          '50-55': 0,
          '55-60': 0,
          '60 en adelante': 0,
          'N/D': 0,
        };

        let contEdad = 0;
        const Masculinos = [];
        const Femenino = [];
        data.users.forEach((user) => {
          const edad = calculate_age(new Date(user.Perfil?.fechaNacimiento));
          const rango = getRangoEdad(edad);
          contEdad = contEdad + edad || 0;
          if (user.Perfil?.gender == 'Masculino') {
            Masculinos.push(user.name);
          } else if (user.Perfil?.gender == 'Femenino') {
            Femenino.push(user.name);
          }
          if (!Object.keys(datosConsolidados).includes(rango)) {
            datosConsolidados[rango] = 1;
          } else {
            datosConsolidados[rango] += 1;
          }
        });
        let ejeX = [];
        const series = [];
        let seriedata = [];
        const consolidado2 = [Femenino.length, Masculinos.length];
        ejeX = Object.keys(datosConsolidados);
        seriedata = Object.values(datosConsolidados);
        series.push({ name: 'Edad', data: seriedata });
        setChartSeries(series);
        setSumEdad(Math.round(contEdad / data.users.length));
        setChartSeriePie(consolidado2);
        setEjeX({ categories: ejeX });
      }
    } else {
      setChartSeries([]);
      setSumEdad(0);
      setChartSeriePie([]);
      setEjeX({ categories: [] });
    }
  }, [data]);

  const chartPieOptions = {
    chart: {
      id: 'donutedades',
      width: 380,
      type: 'donut',
    },
    labels: ['Mujeres', 'Hombres'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
  };
  const chartOptions = {
    chart: {
      id: 'baredades',
      type: 'bar',
      height: 450,
      events: {
        dataPointSelection: function (event, chartContext, config) {
          setSelectedCategory(config.w.config.xaxis.categories[config.dataPointIndex]);
          setShowDrillDown(true);
          // The last parameter config contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts
        },
      },
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
    fill: {
      opacity: 1,
      colors: ['#9C27B0', '#E91E63', '#F44336'],
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val} Persona${val !== 1 ? 's' : ''}`;
        },
      },
    },
  };

  if (qLoading) return <MiniLoading />;
  return (
    <>
      <div className={`${showDrillDown ? 'invisible h-0' : 'visible'} grid justify-items-center w-full items-center`}>
        <div className='flex items-center justify-center'>
          <h1 className='m-4 text-xl text-gray-700 font-bold'>Rango de Edades</h1>
          <h1 className='text-sm'>Edad Promedio:{sumEdad}</h1>
        </div>
        {chartSeriePie && (
          <div className='justify-self-end'>
            <div className='flex z-10'>
              <DonutChart options={chartPieOptions} series={chartSeriePie} />
            </div>
          </div>
        )}
        {chartSeries && ejeX && (
          <div className='justify-self-center w-full'>
            <Chart
              id='baredades'
              options={{
                ...chartOptions,
                xaxis: ejeX,
              }}
              series={chartSeries}
              type='bar'
              height={450}
            />
          </div>
        )}
      </div>
      {showDrillDown && (
        <div>
          <DrillDown selectedCategory={selectedCategory} data={data} setShowDrillDown={setShowDrillDown} />
        </div>
      )}
    </>
  );
};

const DrillDown = ({ selectedCategory, data, setShowDrillDown }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [CSVData, setCSVData] = useState([]);
  useEffect(() => {
    const fd = [];
    const dataToDownload = [['Nombre', 'Email', 'Fecha de nacimiento', 'Edad']];
    data.users.forEach((user) => {
      const edad = calculate_age(new Date(user.Perfil?.fechaNacimiento));
      const rango = getRangoEdad(edad);
      if (rango === selectedCategory) {
        dataToDownload.push([user.name, user.email, user.Perfil?.fechaNacimiento, edad]);
        fd.push({
          nombre: user.name,
          email: user.email,
          fechaNacimiento: user.Perfil?.fechaNacimiento,
          edad: edad,
        });
      }
    });
    setCSVData(dataToDownload);
    setFilteredData(fd);
  }, [data, selectedCategory]);

  return (
    <div className='flex flex-col md:justify-center items-center overflow-scroll'>
      <div
        className='my-8 self-start uppercase cursor-pointer justify-end shadow-xs hover:shadow-lg bg-bluegdm hover:bg-bluegdm_hover p-2 text-sm font-bold text-white rounded-sm'
        onClick={() => setShowDrillDown(false)}
      >
        <i className='fas fa-arrow-left mx-4' />
        Retornar al gráfico
      </div>
      <div className='flex justify-center items-center w-full'>
        <div className='w-full text-center'>Personas con rango de edad de {selectedCategory}</div>
        <div className='justify-self-end cursor-pointer mx-4'>
          <Tooltip title='Descargar datos'>
            <CSVLink data={CSVData} filename={'download.csv'} target='_blank'>
              <i className='fas fa-file-csv text-3xl text-green-600 hover:text-green-500' />
            </CSVLink>
          </Tooltip>
        </div>
      </div>
      <div className='hidden lg:block'>
        <table className='my-8 mx-2 table'>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Fecha de nacimiento</th>
            <th>Edad</th>
          </tr>
          {filteredData.map((el) => {
            return (
              <tr>
                <td>{el.nombre}</td>
                <td>{el.email}</td>
                <td>{el.fechaNacimiento ? new Date(el.fechaNacimiento).toLocaleDateString() : 'sin registro'}</td>
                <td>{el.edad || 'sin registro'}</td>
              </tr>
            );
          })}
        </table>
      </div>
      <style jsx>{`
        .table {
          font-family: Arial, Helvetica, sans-serif;
          border-collapse: collapse;
          width: 100%;
        }

        .table td,
        .table th {
          border: 1px solid #ddd;
          padding: 8px;
        }

        .table tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        .table tr:hover {
          background-color: #ddd;
        }

        .table th {
          padding-top: 12px;
          padding-bottom: 12px;
          text-align: left;
          background-color: #736e6e;
          color: white;
        }
      `}</style>
    </div>
  );
};

const DonutChart = ({ options, series }) => {
  return <Chart id='chartedades' options={options} series={series} type='donut' height={150} />;
};

export default GraficoEdades;
