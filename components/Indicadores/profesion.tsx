import { useState, useEffect } from "react";
import DropDown from "../DropDown";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { MiniLoading } from "../Loading";
import dynamic from "next/dynamic";
import { CSVLink } from "react-csv";
import { Tooltip } from "@material-ui/core";

const Chart: any = dynamic(
  () => {
    return import("react-apexcharts");
  },
  { ssr: false }
);

const GET_HITOS = gql`
  query hitoAcademicos($where: HitoAcademicoWhereInput) {
    hitoAcademicos(where: $where) {
      id
      programa {
        name
      }
      cv {
        user {
          name
          email
          Perfil {
            gender
            fechaNacimiento
            document
          }
        }
      }
    }
  }
`;

const GraficoProfesiones = ({ empresaSeleccionada, tiposAcademicos }) => {
  const [tipoSeleccionado, setTipoSeleccionado] = useState("5");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showDrillDown, setShowDrillDown] = useState(false);
  const [ejeX, setEjeX] = useState([]);
  const [chartSeries, setChartSeries] = useState([
    {
      name: "",
      data: [],
    },
  ]);

  const { loading: qLoading, error, data } = useQuery(
    GET_HITOS,
    empresaSeleccionada != ""
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
                programa: {
                  is: {
                    type: {
                      is: {
                        id: {
                          equals: parseInt(tipoSeleccionado),
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
            where: {
              programa: {
                is: {
                  type: {
                    is: {
                      id: {
                        equals: parseInt(tipoSeleccionado),
                      },
                    },
                  },
                },
              },
            },
          },
        }
  );

  useEffect(() => {
    if (data) {
      if (data.hitoAcademicos.length > 0) {
        let ejeX = [];
        let serieDatos = [];
        data.hitoAcademicos.forEach((hito) => {
          if (ejeX.filter((el) => el === hito.programa.name).length === 0) {
            ejeX.push(hito.programa.name);
            serieDatos.push(
              data.hitoAcademicos.filter(
                (el) => el.programa.name === hito.programa.name
              ).length
            );
          }
        });
        setChartSeries(serieDatos);
        setEjeX(ejeX);
      }
    } else {
      setChartSeries([]);
      setEjeX([]);
    }
  }, [data]);

  const chartOptions = {
    chart: {
      id: "chart_profesiones",
      width: 380,
      type: "pie",
      events: {
        dataPointSelection: function (event, chartContext, config) {
          setSelectedCategory(config.w.config.labels[config.dataPointIndex]);
          setShowDrillDown(true);
        },
      },
    },
    labels: [],
    responsive: [
      {
        breakpoint: 1400,
        options: {
          pie: {
            size: 0.8,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  if (qLoading) return <MiniLoading />;
  return (
    <>
      <div
        className={`${
          showDrillDown ? "invisible h-0" : "visible"
        } w-full grid items-center`}
      >
        <h1 className="m-4 text-xl text-gray-700 font-bold">
          Distribución de Profesiones
        </h1>
        <div className="">
          <DropDown
            instruccion="Seleccione el tipo de profesión"
            datos={tiposAcademicos}
            datoSeleccionado={tipoSeleccionado}
            setDatoSeleccionado={setTipoSeleccionado}
            textColumn="nombre"
          />
        </div>
        <div className="w-full h-96">
          <Chart
            id={"chart_profesiones"}
            options={{ ...chartOptions, labels: ejeX }}
            series={chartSeries}
            type="donut"
            height={450}
          />
        </div>
      </div>
      {showDrillDown && (
        <div>
          <DrillDown
            selectedCategory={selectedCategory}
            data={data}
            setShowDrillDown={setShowDrillDown}
          />
        </div>
      )}
    </>
  );
};

function calculate_age(dob) {
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

const DrillDown = ({ selectedCategory, data, setShowDrillDown }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [CSVData, setCSVData] = useState([]);
  useEffect(() => {
    if (data) {
      const dt = JSON.parse(JSON.stringify(data));
      const fd = dt.hitoAcademicos.filter(
        (el) => el.programa?.name === selectedCategory
      );
      const dataToCSV = [["Nombre", "Email", "Cédula", "Edad"]];
      const users = fd.map((hito) => {
        const edad = calculate_age(
          new Date(hito.cv.user.Perfil?.fechaNacimiento)
        );
        dataToCSV.push([
          hito.cv.user.name,
          hito.cv.user.email,
          hito.cv.user.Perfil?.document,
          edad,
        ]);
        return {
          nombre: hito.cv.user.name,
          email: hito.cv.user.email,
          documento: hito.cv.user.Perfil?.document,
          edad: edad,
        };
      });
      setCSVData(dataToCSV);
      setFilteredData(users);
    }
  }, [data, selectedCategory]);

  return (
    <div className="flex flex-col my-2 justify-center items-center">
      <div
        className="my-8 self-start uppercase cursor-pointer justify-end shadow-xs hover:shadow-lg bg-bluegdm hover:bg-bluegdm_hover p-2 text-sm font-bold text-white rounded-sm"
        onClick={() => setShowDrillDown(false)}
      >
        <i className="fas fa-arrow-left mx-4" />
        Retornar al gráfico
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="w-full text-center">
          Personas con estudios en {selectedCategory}
        </div>
        <div className="justify-self-end cursor-pointer mx-4">
          <Tooltip title="Descargar datos">
            <CSVLink data={CSVData} filename={"download.csv"} target="_blank">
              <i className="fas fa-file-csv text-3xl text-green-600 hover:text-green-500" />
            </CSVLink>
          </Tooltip>
        </div>
      </div>
      <div className="hidden lg:block">
        <table className="my-8 table">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Cedula</th>
            <th>Edad</th>
          </tr>
          {filteredData.map((el, index) => {
            return (
              <tr key={"DRILLDOWNPROFESION" + index}>
                <td>{el.nombre}</td>
                <td>{el.email}</td>
                <td>{el.document}</td>
                <td>{el.edad}</td>
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

export default GraficoProfesiones;
