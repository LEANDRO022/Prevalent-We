import safeJsonStringify from "safe-json-stringify";
import Image from "next/image";
import prisma from "config/prisma";
import React, { useState, useEffect } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { SuperAdminRoute } from "@components/PrivateRoute";
import useUserImage from "hooks/useUserImage";
import Loading from "@components/Loading";
import { AdminInputPageHeaderSubRoute } from "components/InputPage";
import Modal from "@material-ui/core/Modal";
import { getSession } from "next-auth/client";
import Head from "next/head";

const GET_USER = gql`
  query users($where: UserWhereInput!) {
    users(where: $where) {
      id
      name
      email
      image
      empresaId
      empresa {
        name
      }
      Perfil {
        document
        image
      }
    }
  }
`;

const UPDATE_EMPRESA_USUARIOS = gql`
  mutation updateEmpresa(
    $data: EmpresaUpdateInput!
    $where: EmpresaWhereUniqueInput!
  ) {
    updateEmpresa(data: $data, where: $where) {
      id
      name
      Empleados {
        id
        name
        email
        image
        Perfil {
          document
          image
        }
      }
    }
  }
`;

const DELETE_USUARIO_EMPRESA = gql`
  mutation updateEmpresa(
    $data: EmpresaUpdateInput!
    $where: EmpresaWhereUniqueInput!
  ) {
    updateEmpresa(data: $data, where: $where) {
      id
      name
      Empleados {
        id
        name
        email
        image
        Perfil {
          document
          image
        }
      }
    }
  }
`;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session) {
    let empresa = await prisma.empresa.findUnique({
      where: {
        id: context.query.id,
      },
      include: {
        Empleados: {
          include: {
            Perfil: true,
          },
        },
      },
    });
    empresa = JSON.parse(safeJsonStringify(empresa));
    prisma.$disconnect();
    return {
      props: { empresa }, // will be passed to the page component as props
    };
  } else {
    return {
      props: { empresa: {} },
    };
  }
}

const EmpresaAdmin = ({ empresa }) => {
  const [usuariosAAgregar, setUsuariosAAgregar] = useState([]);
  const [empleados, setEmpleados] = useState(empresa.Empleados ?? []);
  const [
    mutation,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_EMPRESA_USUARIOS);
  const [
    mutationDel,
    { loading: mutationDelLoading, error: mutationDelError },
  ] = useMutation(DELETE_USUARIO_EMPRESA);
  const removerUsuarioAAgregar = (user) => {
    setUsuariosAAgregar(usuariosAAgregar.filter((el) => el.id !== user.id));
  };
  const agregarUsuarios = () => {
    const where = { id: empresa.id };
    const data = {
      Empleados: {
        connect: [],
      },
    };
    usuariosAAgregar.forEach((el) => {
      data.Empleados.connect.push({ id: el.id });
    });
    mutation({
      variables: { where, data },
    }).then(({ data }) => {
      setEmpleados(data.updateEmpresa.Empleados);
      setUsuariosAAgregar([]);
    });
  };

  const retirarEmpleado = (empleado) => {
    const where = { id: empresa.id };
    const data = {
      Empleados: {
        disconnect: {
          id: empleado.id,
        },
      },
    };
    mutationDel({
      variables: { where, data },
    }).then(({ data }) => {
      setEmpleados(empleados.filter((el) => el.id !== empleado.id));
    });
  };

  if (mutationLoading || mutationDelLoading) return <Loading />;
  return (
    <SuperAdminRoute>
      <Head>
        <title>Empresas</title>
        <link rel="icon" href="/img/Favicon.png" />
      </Head>
      {Object.keys(empresa).length > 0 ? (
        <div className="flex flex-col items-center justify-center lg:p-8">
          <AdminInputPageHeaderSubRoute
            sectionName="Ingresar usuarios a empresas"
            sectionRoute="empresas"
            subSectionName={empresa.name}
          />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-2 p-4">
            <div className="lg:col-span-3 ">
              {empleados.length === 0 ? (
                <div className="my-10">
                  <span className="font-bold uppercase">{empresa.name}</span> no
                  tiene empleados registrados
                </div>
              ) : (
                <div className="shadow-lg m-4 rounded-lg bg-gray-200">
                  <div className="my-2 p-6 bg-gray-100 text-xl text-gray-800">
                    Empleados registrados en{" "}
                    <span className="font-bold uppercase">{empresa.name}:</span>
                  </div>
                  <div className="p-2 grid gap-2 grid-cols-1 lg:grid-cols-3 h-1/2 lg:max-h-3/4 lg:h-full overflow-y-scroll">
                    {empleados.map((empleado) => {
                      if (empleado.name) {
                        return (
                          <div
                            key={`EMPLEADO${empleado.id}`}
                            className="bg-white rounded-md p-2 flex text-left items-center justify-around"
                          >
                            <Image
                              height={50}
                              width={50}
                              src={useUserImage(empleado)}
                              className="rounded-full"
                            />
                            <div className="flex flex-col items-start justify-center mx-2">
                              <h2 className="font-medium  text-gray-800 text-sm">
                                {empleado.name ?? ""}
                              </h2>
                              <p className="text-xs text-gray-600">
                                Documento: {empleado.Perfil?.document ?? ""}
                              </p>
                            </div>
                            <Tooltip
                              title={`Retirar a ${
                                empleado.name?.split(" ")[0] ?? ""
                              } de ${empresa.name}`}
                              arrow
                              placement="top"
                            >
                              <div
                                onClick={() => retirarEmpleado(empleado)}
                                className="cursor-pointer shadow-sm flex justify-center items-center text-white bg-red-700 hover:bg-red-600 hover:shadow-md p-1 mx-1 rounded-sm"
                              >
                                <i className="fas fa-trash-alt text-sm" />
                              </div>
                            </Tooltip>
                          </div>
                        );
                      }
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="lg:col-span-2 flex justify-center">
              <div className="m-4 w-full flex flex-col items-center shadow-lg rounded-lg bg-gray-200 border-0">
                <div className="w-full rounded-t bg-gray-100 mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-gray-800 text-xl">
                      Ingreso de Personal
                    </h6>
                  </div>
                </div>
                <div className="flex flex-col items-center m-2 px-6 w-full">
                  <BuscarPersonal
                    usuariosAAgregar={usuariosAAgregar}
                    setUsuariosAAgregar={setUsuariosAAgregar}
                  />
                </div>
                {usuariosAAgregar.length > 0 && (
                  <>
                    <div className="w-full my-4">
                      <div className="grid grid-cols-4 font-bold text-xs text-center w-full">
                        <div>Foto</div>
                        <div>Nombre</div>
                        <div>Cédula</div>
                        <div>Eliminar</div>
                      </div>
                      <div className="grid grid-cols-4 text-center items-center text-xs">
                        {usuariosAAgregar.length > 0 &&
                          usuariosAAgregar.map((user, index) => {
                            return (
                              <React.Fragment key={`USER${index}`}>
                                <div className="flex justify-center items-center">
                                  <Image
                                    height={30}
                                    width={30}
                                    className="rounded-full"
                                    src={useUserImage(user)}
                                  />
                                </div>
                                <div>{user.name}</div>
                                <div>{user?.Perfil?.document ?? ""}</div>
                                <div className="flex justify-center">
                                  <i
                                    className="fas fa-minus-circle text-red-800 hover:text-red-600 cursor-pointer"
                                    onClick={() => removerUsuarioAAgregar(user)}
                                  ></i>
                                </div>
                              </React.Fragment>
                            );
                          })}
                      </div>
                    </div>
                    <button
                      className="m-4 bg-primary1 text-white p-2 rounded-lg shadow-md hover:bg-bluegdm"
                      onClick={agregarUsuarios}
                    >
                      Agregar Usuarios
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>No existe información para la empresa solicitada</div>
      )}
    </SuperAdminRoute>
  );
};

const BuscarPersonal = ({ usuariosAAgregar, setUsuariosAAgregar }) => {
  const [cedula, setCedula] = useState("");
  const [cedulaABuscar, setCedulaABuscar] = useState("");
  const [open, setOpen] = React.useState(false);
  const { loading: qLoading, error, data, refetch } = useQuery(GET_USER, {
    variables: {
      where: {
        Perfil: {
          is: {
            document: {
              equals: cedulaABuscar !== "" ? cedulaABuscar : "none",
            },
          },
        },
      },
    },
  });

  const handleClick = () => {
    if (data && data.users.length > 0) {
      setUsuariosAAgregar([...usuariosAAgregar, data.users[0]]);
      setCedula("");
      setCedulaABuscar("");
    }
    setOpen(!open);
  };

  const agregarUsuario = () => {
    if (cedulaABuscar !== "") {
      if (!data.users[0].empresaId) {
        if (data && data.users.length > 0) {
          setUsuariosAAgregar([...usuariosAAgregar, data.users[0]]);
          setCedula("");
          setCedulaABuscar("");
        }
      } else {
        setOpen(!open);
      }
    }
  };

  const body = data?.users[0]?.empresa && (
    <div className="w-1/2 h-1/2 bg-none border-none absolute top-1/4 left-1/4 outline-none">
      {data && (
        <div className="bg-white m-20 p-10 shadow-2xl rounded-2xl ">
          <h2 className="text-black font-bold text-xl">
            El Usuario {data.users[0]?.name ?? ""} -{" "}
            {data.users[0] ? data.users[0].Perfil.document : ""}
          </h2>
          <p className="my-2 font-medium text-lg">
            ya se encuentra inscrito en{" "}
            {data.users[0] ? data.users[0].empresa.name : ""}.
          </p>
          <p>¿Desea reasignarlo?</p>
          <div className=" flex-row flex my-10">
            <button
              onClick={(e) => {
                setOpen(!open);
              }}
              className="uppercase cursor-pointer shadow-lg hover:shadow-xl bg-white mx-2 py-2 px-4 text-sm font-bold text-black rounded-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleClick}
              className="uppercase cursor-pointer shadow-lg hover:shadow-xl bg-bluegdm hover:bg-bluegdm_hover py-2 px-4 text-sm font-bold text-white rounded-sm"
            >
              Reasignar empresa
            </button>
          </div>
        </div>
      )}
    </div>
  );
  return (
    <div className="flex text-xs w-full items-center">
      <input
        type="text"
        name="cantidad"
        className="rounded-md m-2 p-2 shadow-sm lg:w-60"
        placeholder="Ingresa la cédula de la persona a agregar"
        value={cedula}
        onChange={(e) => setCedula(e.target.value)}
      />
      <Tooltip title="Buscar Persona" arrow placement="right">
        <button onClick={() => setCedulaABuscar(cedula)}>
          <i className="mx-2 fas fa-search text-xl text-gray-700 hover:text-bluegdm cursor-pointer" />
        </button>
      </Tooltip>
      <div className="mx-1">
        {data && cedulaABuscar !== "" && data.users.length > 0 && (
          <Image
            height={30}
            width={30}
            className="rounded-full"
            src={useUserImage(data.users[0])}
          />
        )}
      </div>
      <div className="mx-1">
        <span>
          {qLoading
            ? cedulaABuscar === ""
              ? ""
              : "Buscando..."
            : data?.users
            ? cedulaABuscar === ""
              ? ""
              : data.users.length > 0
              ? data.users[0].name
              : "¡Usuario no encontrado!"
            : ""}
        </span>
      </div>
      <Tooltip
        title={`${
          data && data.users.length > 0 && cedulaABuscar !== ""
            ? "Agregar Empleado"
            : ""
        }`}
        arrow
        placement="right"
      >
        <i
          onClick={data?.users?.length > 0 ? agregarUsuario : () => {}}
          className={`mx-2 fas fa-plus-circle text-xl ${
            data && data.users.length > 0 && cedulaABuscar !== ""
              ? "text-green-800 hover:text-green-500 cursor-pointer"
              : "text-gray-500"
          } `}
        />
      </Tooltip>
      <Modal
        open={open}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <>{data?.users[0]?.empresa && body}</>
      </Modal>
    </div>
  );
};

export default EmpresaAdmin;
